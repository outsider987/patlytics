import { request } from "../util/request";

interface FuzzyMatchResponse {
  query: string;
  matches: string[];
}

export function useCheckInfringementAPI() {
  const POST_CHECK_INFRINGEMENT = async (data: any) => {
    const res = await request.post("/check-infringement", data);
    return res.data;
  };

  const GET_FUZZY_MATCH_COMPANY = async (companyName: string): Promise<FuzzyMatchResponse> => {
    const res = await request.get(`/fuzzy-match/company/${companyName}`);
    return res.data;
  };

  const GET_FUZZY_MATCH_PATENT = async (patentId: string): Promise<FuzzyMatchResponse> => {
    const res = await request.get(`/fuzzy-match/patent/${patentId}`);
    return res.data;
  };

  return {
    POST_CHECK_INFRINGEMENT,
    GET_FUZZY_MATCH_COMPANY,
    GET_FUZZY_MATCH_PATENT,
  };
}
