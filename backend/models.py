from pydantic import BaseModel, Field
from typing import List
from datetime import datetime
import uuid

class InfringementRequest(BaseModel):
    patent_id: str = Field(..., alias="patentId")
    company_name: str = Field(..., alias="companyName")

    class Config:
        populate_by_name = True
        allow_population_by_field_name = True

class InfringingProduct(BaseModel):
    product_name: str
    infringement_likelihood: str
    relevant_claims: List[str]
    explanation: str
    specific_features: List[str]

class InfringementResponse(BaseModel):
    analysis_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    patent_id: str
    company_name: str
    analysis_date: str = Field(default_factory=lambda: datetime.now().strftime("%Y-%m-%d"))
    top_infringing_products: List[InfringingProduct]
    overall_risk_assessment: str 