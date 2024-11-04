import json
import logging
from typing import List, Dict, Optional
from config import client

class AIAnalysisService:
    @staticmethod
    async def analyze_top2_infringing_features(
        patent_description: str,
        abstract: str,
        product_description_list: List[Dict[str, str]]
    ) -> Optional[List[str]]:
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

            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {
                        "role": "system",
                        "content": "You are a patent analysis expert specializing in identifying potential patent infringement.",
                    },
                    {"role": "user", "content": prompt},
                ],
            )

            return json.loads(
                response.choices[0]
                .message.content.strip()
                .replace("```json\n", "")
                .replace("\n```", "")
            )
        except Exception as e:
            logging.error(f"Error in analyze_top_infringing_features: {str(e)}")
            return None

    @staticmethod
    async def analyze_claims_infringement(
        claims: List[str],
        top2_infringing_features: List[str],
        patent_description: str
    ) -> Optional[Dict]:
        try:
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

            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "You are a patent analysis expert. Provide analysis in the exact JSON format requested."},
                    {"role": "user", "content": prompt}
                ],
            )

            content = response.choices[0].message.content.strip()
            if "```json" in content:
                content = content.split("```json")[1].split("```")[0].strip()
            elif "```" in content:
                content = content.split("```")[1].strip()
                
            return json.loads(content)
        except Exception as e:
            logging.error(f"Error in analyze_claims_infringement: {str(e)}")
            return None 