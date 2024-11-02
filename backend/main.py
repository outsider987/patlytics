from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import json
from typing import List, Dict, Optional
import openai
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure OpenAI
openai.api_key = os.getenv("OPENAI_API_KEY")

app = FastAPI()

# Load patent and company data
with open("backend/patents.json") as f:
    patents = json.load(f)

with open("backend/company_products.json") as f:
    company_data = json.load(f)

class InfringementRequest(BaseModel):
    patent_id: int
    company_name: str

class InfringingProduct(BaseModel):
    name: str
    description: str
    infringing_claims: List[str]
    explanation: str

class InfringementResponse(BaseModel):
    patent_id: int
    company_name: str
    infringing_products: List[InfringingProduct]

def find_patent(patent_id: int):
    for patent in patents:
        if patent["id"] == patent_id:
            return patent
    return None

def find_company(company_name: str):
    for company in company_data["companies"]:
        if company["name"].lower() == company_name.lower():
            return company
    return None

async def analyze_infringement_with_gpt(claim: str, product_description: str, product_name: str) -> Optional[str]:
    try:
        prompt = f"""Analyze if the following product potentially infringes the patent claim.
        
        Product Name: {product_name}
        Product Description: {product_description}
        
        Patent Claim: {claim}
        
        Provide a detailed analysis of potential infringement. If there is potential infringement, 
        explain specifically which elements of the claim are present in the product. 
        If there is no potential infringement, explain why not.
        
        Format your response as:
        INFRINGEMENT: [Yes/No]
        EXPLANATION: [Your detailed analysis]
        """

        response = await openai.ChatCompletion.acreate(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a patent analysis expert specializing in identifying potential patent infringement."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,
            max_tokens=500
        )

        analysis = response.choices[0].message.content
        
        # Parse the GPT response
        lines = analysis.split('\n')
        infringement = False
        explanation = ""
        
        for line in lines:
            if line.startswith("INFRINGEMENT:"):
                infringement = "yes" in line.lower()
            elif line.startswith("EXPLANATION:"):
                explanation = line.replace("EXPLANATION:", "").strip()
        
        if infringement:
            return explanation
        return None

    except Exception as e:
        print(f"Error in GPT analysis: {str(e)}")
        return None

@app.post("/check-infringement", response_model=InfringementResponse)
async def check_infringement(request: InfringementRequest):
    # Find patent
    patent = find_patent(request.patent_id)
    if not patent:
        raise HTTPException(status_code=404, detail="Patent not found")

    # Find company
    company = find_company(request.company_name)
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")

    # Parse claims
    claims = []
    if isinstance(patent.get("claims"), str):
        try:
            claims_data = json.loads(patent["claims"])
            claims = [claim["text"] for claim in claims_data if "text" in claim]
        except json.JSONDecodeError:
            claims = []
    
    # Check each product for potential infringement
    potential_infringements = []
    
    for product in company["products"]:
        infringing_claims = []
        explanations = []
        
        for i, claim in enumerate(claims, 1):
            explanation = await analyze_infringement_with_gpt(claim, product["description"], product["name"])
            if explanation:
                infringing_claims.append(f"Claim {i}")
                explanations.append(explanation)
        
        if infringing_claims:
            potential_infringements.append({
                "name": product["name"],
                "description": product["description"],
                "infringing_claims": infringing_claims,
                "explanation": " | ".join(explanations)
            })
    
    # Sort by number of infringing claims and return top 2
    potential_infringements.sort(key=lambda x: len(x["infringing_claims"]), reverse=True)
    top_infringements = potential_infringements[:2]
    
    return {
        "patent_id": request.patent_id,
        "company_name": request.company_name,
        "infringing_products": top_infringements
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)