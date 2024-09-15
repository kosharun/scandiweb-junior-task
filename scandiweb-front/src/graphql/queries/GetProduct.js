import { gql } from "@apollo/client";

export const GET_PRODUCT = gql`
    query GetProduct($productId: ID!) {
        GetProduct(id: $productId) {
            id
            name 
            gallery 
            prices {
                amount currency{symbol}
            } 
            attributes {
                name 
                items {
                    value 
                    id
                    display_value
                }
            } 
            in_stock
            description
        } 
    }
`;
