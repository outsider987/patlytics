from typing import Dict, Any, List

from repositories import DataRepository
from .input_parser import BasicInputParser, FuzzyMatcher


class AnalysisService:
    def __init__(self, input_parser: BasicInputParser, fuzzy_matcher: FuzzyMatcher):
        self.input_parser = input_parser
        self.fuzzy_matcher = fuzzy_matcher
        # This would typically come from a database
        json_data = DataRepository(
            company_file="./company_products.json", patents_file="./patents.json"
        )
        print(json_data.company_data)
        company_names = [company["name"] for company in json_data.company_data["companies"]]
        self.known_companies = company_names
        publication_numbers = [
            patent["publication_number"]
            for patent in json_data.patents
        ]

        self.known_patents = publication_numbers

    def find_company_matches(self, company_name: str) -> Dict[str, Any]:
        # Parse and validate input
        parsed_data = self.input_parser.parse_and_validate(
            {"companyName": company_name}
        )

        # Find company matches
        company_matches = self.fuzzy_matcher.find_matches(
            parsed_data["companyName"], self.known_companies
        )

        return {"query": company_name, "matches": company_matches}

    def find_patent_matches(self, patent_id: str) -> Dict[str, Any]:
        # Parse and validate input
        parsed_data = self.input_parser.parse_and_validate({"patentId": patent_id})

        # Find patent matches
        patent_matches = self.fuzzy_matcher.find_matches(
            parsed_data["patentId"],
            self.known_patents,
            threshold=85,  # Higher threshold for patents
        )

        return {"query": patent_id, "matches": patent_matches}
