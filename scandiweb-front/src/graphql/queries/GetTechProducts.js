import { gql } from "@apollo/client";

export const GET_TECH_PRODUCTS = gql`
    query GetTechProducts {
        GetTechProducts{products{id name in_stock gallery description category attributes{name} prices{amount currency{label symbol}} brand}} 
    }
`;