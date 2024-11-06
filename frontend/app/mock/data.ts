export const mockResultData = {
  analysis_id: "51c8cab8-2ebb-403f-8b43-4b02856c4507",
  patent_id: "US-RE49889-E1",
  company_name: "Walmart Inc.",
  analysis_date: "2024-11-04",
  top_infringing_products: [
    {
      product_name: "Walmart Grocery",
      infringement_likelihood: "High",
      relevant_claims: ["1", "2", "5", "11"],
      explanation:
        "Walmart Grocery likely infringes on the claims as it involves presenting advertisements for products, allowing users to select items and add them to a shopping list, and transmitting tracking information related to those selections. The app's core functionality aligns closely with the claims described.",
      specific_features: [
        "Integration of digital ads in the app",
        "Ability to open shopping lists",
        "Adding store identification and product selection functionalities",
      ],
    },
    {
      product_name: "Quick Add from Ads",
      infringement_likelihood: "High",
      relevant_claims: ["1", "6", "14", "20"],
      explanation:
        "Quick Add from Ads appears to directly copy the functionalities outlined in the patent claims, particularly in terms of presenting advertisements, receiving selections, and incorporating those into shopping lists. The features and functions are consistent with the methods described in the patent.",
      specific_features: [
        "Display of advertisements",
        "Option to add products to shopping list",
        "Routing to shopping list after user interaction",
      ],
    },
  ],
  overall_risk_assessment:
    "There is a significant risk of patent infringement by both products due to their functionalities mirroring several claims outlined in the patent, particularly around digital advertisement engagement and shopping list integration.",
};
