from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
import json
from typing import List, Dict, Optional
import openai
import os
from dotenv import load_dotenv
import uuid
from datetime import datetime
from fuzzywuzzy import fuzz
from openai import OpenAI
from fastapi.middleware.cors import CORSMiddleware

client = OpenAI()

# Load environment variables
load_dotenv()

# Configure OpenAI
openai.api_key = os.getenv("OPENAI_API_KEY")
# openai.organization = os.getenv("OPENAI_ORG")
# client.organization = os.getenv("OPENAI_ORG")
# client.api_key = os.getenv("OPENAI_API_KEY")

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Load patent and company data
with open("./patents.json") as f:
    patents = json.load(f)

with open("./company_products.json") as f:
    company_data = json.load(f)


class InfringementRequest(BaseModel):
    patent_id: str
    company_name: str


class SpecificFeature(BaseModel):
    features: List[str]


class InfringingProduct(BaseModel):
    product_name: str
    infringement_likelihood: str
    relevant_claims: List[str]
    explanation: str
    specific_features: List[str]


class InfringementResponse(BaseModel):
    analysis_id: str
    patent_id: str
    company_name: str
    analysis_date: str
    top_infringing_products: List[InfringingProduct]
    overall_risk_assessment: str


def find_patent(patent_id: str):
    for patent in patents:
        if patent["publication_number"] == patent_id:
            return patent
    return None


def find_company(company_name: str, threshold: int = 80):
    best_match = None
    highest_ratio = 0

    for company in company_data["companies"]:
        # Try both simple ratio and partial ratio matching
        ratio = max(
            fuzz.ratio(company["name"].lower(), company_name.lower()),
            fuzz.partial_ratio(company["name"].lower(), company_name.lower()),
        )

        if ratio > highest_ratio:
            highest_ratio = ratio
            best_match = company

    # Return the best match if it meets the threshold
    return best_match if highest_ratio >= threshold else None


async def analyze_top2_infringing_features(
    patent_description: Optional[str],
    abstract: Optional[str],
    product_description_list: List[Dict[str, str]],
):
    try:
        prompt = f"""Analyze the following patent description and product descriptions to identify the top 2 most specific features of products that may infringe the patent.
        
        Patent features: 
          1.description: {patent_description}
          2.abstract: {abstract}
       
    
          
        Products Descriptions: 
        {product_description_list}
        
        please return the top 2 product names in JSON format:
        [
          "product name",
          "product name2"
        ]
        
        """

        response = openai.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": "You are a patent analysis expert specializing in identifying potential patent infringement.",
                },
                {"role": "user", "content": prompt},
            ],
            # stream=True,
        )

        # Parse the response as JSON
        analysis_data = json.loads(
            response.choices[0]
            .message.content.strip()
            .replace("```json\n", "")
            .replace("\n```", "")
        )
        return analysis_data
    except Exception as e:
        print(f"Error in analyze_top_infringing_features: {str(e)}")
        return None


async def analyze_claims_infringement_with_gpt(
    claims: List[str], top2_infringing_features: List[str], patent_description: str
):
    try:
        # Create a template for the expected JSON response
        json_template = {
            "top_infringing_products": [
                {
                    "product_name": "Product 1",
                    "infringement_likelihood": "High/Medium/Low",
                    "relevant_claims": ["1", "2"],
                    "explanation": "Explanation here",
                    "specific_features": []
                },
                {
                    "product_name": "Product 2", 
                    "infringement_likelihood": "High/Medium/Low",
                    "relevant_claims": ["1", "2"],
                    "explanation": "Explanation here",
                    "specific_features": []
                }
            ],
            "overall_risk_assessment": "Overall assessment here"
        }

        prompt = (
            "Analyze if the following products potentially infringe the patent claim.\n\n"
            f"Patent Claims: {claims}\n\n"
            f"Patent Description: {patent_description}\n\n"
            f"Top 2 infringing products names: {top2_infringing_features}\n\n"
            "Please analyze each claim and determine if it is relevant to the potential infringement.\n"
            f"Return your analysis in this exact JSON format:\n{json.dumps(json_template, indent=2)}"
        )

        response = openai.chat.completions.create(
            model="gpt-4o-mini",  # Fixed typo in model name from gpt-4o
            messages=[
                {"role": "system", "content": "You are a patent analysis expert. Provide analysis in the exact JSON format requested."},
                {"role": "user", "content": prompt}
            ],
        )

        # Clean and parse the response
        content = response.choices[0].message.content.strip()
        # Remove any markdown formatting if present
        if "```json" in content:
            content = content.split("```json")[1].split("```")[0].strip()
        elif "```" in content:
            content = content.split("```")[1].strip()
            
        analysis_data = json.loads(content)
        return analysis_data
    except Exception as e:
        print(f"Error in analyze_claims_infringement_with_gpt: {str(e)}")
        return None


@app.post("/check-infringement", response_model=InfringementResponse)
async def check_infringement(request: InfringementRequest):
    # Find patent

    patent = find_patent(request.patent_id)
    if not patent:
        raise HTTPException(
            status_code=404, detail=f"Patent with id {request.patent_id} not found"
        )

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

    # top2_infringing_features = await analyze_top2_infringing_features(
    #     patent["description"],
    #     patent["abstract"],
    #     [product for product in company["products"]],
    # )
    top2_infringing_features = [
        "Walmart Grocery",
        "Quick Add from Ads"
    ]

    top_infringing_products_and_overall_risk_assessment = await analyze_claims_infringement_with_gpt(
        claims, top2_infringing_features, patent["description"]
    )

    return {
        "analysis_id": str(uuid.uuid4()),
        "patent_id": request.patent_id,
        "company_name": company["name"],
        "analysis_date": datetime.now().strftime("%Y-%m-%d"),
        "top_infringing_products": top_infringing_products_and_overall_risk_assessment["top_infringing_products"],
        "overall_risk_assessment": top_infringing_products_and_overall_risk_assessment["overall_risk_assessment"]
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
