from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import json
from typing import List, Dict, Optional

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

def check_claim_infringement(claim: str, product_description: str) -> Optional[str]:
    # Simple keyword matching - this could be enhanced with more sophisticated NLP
    claim_words = set(claim.lower().split())
    desc_words = set(product_description.lower().split())
    
    overlap = claim_words.intersection(desc_words)
    if len(overlap) > 3:  # Arbitrary threshold for demonstration
        return f"Product description contains key elements from claim: {', '.join(overlap)}"
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
            explanation = check_claim_infringement(claim, product["description"])
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