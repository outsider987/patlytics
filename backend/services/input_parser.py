from abc import ABC, abstractmethod
from thefuzz import fuzz
from typing import List, Dict, Any

class InputParserInterface(ABC):
    @abstractmethod
    def parse_and_validate(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """Parse and validate input data"""
        pass

class FuzzyMatchInterface(ABC):
    @abstractmethod
    def find_matches(self, query: str, candidates: List[str], threshold: int = 80) -> List[str]:
        """Find fuzzy matches in the candidate list"""
        pass

class BasicInputParser(InputParserInterface):
    def parse_and_validate(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        # Normalize patent ID
        if 'patentId' in input_data:
            patent_id = input_data['patentId'].strip().upper()
            # Add basic patent ID format validation
            if not patent_id.startswith('US-'):
                patent_id = f"US-{patent_id}"
            input_data['patentId'] = patent_id

        # Normalize company name
        if 'companyName' in input_data:
            company_name = input_data['companyName'].strip()
            input_data['companyName'] = company_name

        return input_data

class FuzzyMatcher(FuzzyMatchInterface):
    def find_matches(self, query: str, candidates: List[str], threshold: int = 30) -> List[str]:
        matches = []
        for candidate in candidates:
            ratio = fuzz.ratio(query.lower(), candidate.lower())
            if ratio >= threshold:
                matches.append(candidate)
        return matches 