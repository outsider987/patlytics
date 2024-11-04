import json
from typing import Optional, Dict, List
from fuzzywuzzy import fuzz

class DataRepository:
    def __init__(self, patents_file: str, company_file: str):
        with open(patents_file) as f:
            self.patents = json.load(f)
        with open(company_file) as f:
            self.company_data = json.load(f)

    def find_patent(self, patent_id: str) -> Optional[Dict]:
        return next(
            (patent for patent in self.patents if patent["publication_number"] == patent_id),
            None
        )

    def find_company(self, company_name: str, threshold: int = 80) -> Optional[Dict]:
        best_match = None
        highest_ratio = 0

        for company in self.company_data["companies"]:
            ratio = max(
                fuzz.ratio(company["name"].lower(), company_name.lower()),
                fuzz.partial_ratio(company["name"].lower(), company_name.lower()),
            )

            if ratio > highest_ratio:
                highest_ratio = ratio
                best_match = company

        return best_match if highest_ratio >= threshold else None

    def get_company_products(self, company: Dict) -> List[Dict]:
        return company.get("products", []) 