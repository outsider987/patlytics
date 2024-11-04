from fastapi import APIRouter, HTTPException
import logging
import json
from models import InfringementRequest, InfringementResponse
from repositories import DataRepository
from services import AIAnalysisService

router = APIRouter()
data_repo = DataRepository("./patents.json", "./company_products.json")
ai_service = AIAnalysisService()

@router.post("/check-infringement", response_model=InfringementResponse)
async def check_infringement(request: InfringementRequest):
    logging.info(f"Starting infringement check for patent {request.patent_id} against company {request.company_name}")
    
    # Find patent
    patent = data_repo.find_patent(request.patent_id)
    if not patent:
        logging.error(f"Patent with id {request.patent_id} not found")
        raise HTTPException(status_code=404, detail=f"Patent with id {request.patent_id} not found")

    # Find company
    company = data_repo.find_company(request.company_name)
    if not company:
        logging.error(f"Company {request.company_name} not found")
        raise HTTPException(status_code=404, detail="Company not found")

    # Parse claims
    claims = []
    if isinstance(patent.get("claims"), str):
        try:
            claims_data = json.loads(patent["claims"])
            claims = [claim["text"] for claim in claims_data if "text" in claim]
        except json.JSONDecodeError:
            logging.warning("Failed to parse claims JSON")

    # Get analysis
    top2_infringing_products = await ai_service.analyze_top2_infringing_features(
        patent["description"],
        patent["abstract"],
        data_repo.get_company_products(company)
    )

    if not top2_infringing_products:
        raise HTTPException(status_code=500, detail="Failed to analyze infringing products")

    analysis_result = await ai_service.analyze_claims_infringement(
        claims,
        top2_infringing_products,
        patent["description"]
    )

    if not analysis_result:
        raise HTTPException(status_code=500, detail="Failed to analyze claims infringement")

    return InfringementResponse(
        patent_id=request.patent_id,
        company_name=company["name"],
        top_infringing_products=analysis_result["top_infringing_products"],
        overall_risk_assessment=analysis_result["overall_risk_assessment"]
    ) 