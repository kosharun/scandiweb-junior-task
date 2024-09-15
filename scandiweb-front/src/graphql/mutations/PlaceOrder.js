import { gql } from "@apollo/client";

export const PLACE_ORDER = gql`
    mutation PlaceOrder($orderItems: [OrderItems!]!, $price: Float!, $currency: String!) {
        PlaceOrder(order_items: $orderItems, price: $price, currency: $currency) {
            success
            orderId
            message
        }
    }
`;