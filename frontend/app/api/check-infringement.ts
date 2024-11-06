import { request } from "../util/request";

export function useCheckInfringementAPI() {
  const POST_CHECK_INFRINGEMENT = async (data: any) => {
    const res = await request.post("/check-infringement", data);
    return res.data;
  };

  const GET_FUZZY_MATCH_COMPANY = async (companyName: string) => {
    const res = await request.get(`/fuzzy-match/company/${companyName}`);
    return res.data;
  };

  const GET_FUZZY_MATCH_PATENT = async (patentId: string) => {
    const res = await request.get(`/fuzzy-match/patent/${patentId}`);
    return res.data;
  };

  return {
    POST_CHECK_INFRINGEMENT,
    GET_FUZZY_MATCH_COMPANY,
    GET_FUZZY_MATCH_PATENT,
  };
}
