import { gql } from "@apollo/client";

export const GET_CLOTHES_PRODUCTS = gql`
    query GetClothesProducts {
        GetClothesProducts {
            products {
                id
                name
                in_stock
                gallery
                description
                category
                attributes {
                    name
                    items {
                        value
                    }
                }
                prices {
                    amount
                    currency {
                        label
                        symbol
                    }
                }
                brand
            }
        } 
    }
`;