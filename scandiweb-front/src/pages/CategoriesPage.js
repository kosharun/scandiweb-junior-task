import React, { Component } from "react";
import { Query } from "@apollo/client/react/components";
import { GET_TECH_PRODUCTS } from "../graphql/queries/GetTechProducts";
import { GET_CLOTHES_PRODUCTS } from "../graphql/queries/GetClothesProducts";
import Card from "../components/Card";
import '../styles/CategoriesPage.css';
import { Link } from "react-router-dom";

class CategoriesPage extends Component {
    handleProductClick = (productId) => {
        this.props.setProduct(productId);
    }

    updateQuickShopState = () => {
        this.props.updateQuickShopState();
    }

    convertToKebabCase = (str) => {
        return str.trim().split(/\s+/).map(word => word.toLowerCase()).join('-');
    };

    render() {
        const { category } = this.props;
        const query = category === "clothes" ? GET_CLOTHES_PRODUCTS : GET_TECH_PRODUCTS;

        return (
            <Query query={query}>
                {({ loading, error, data }) => {
                    if (loading) return <p>Loading...</p>;
                    if (error) return <p>Error</p>;

                    const products = category === "clothes" ? data.GetClothesProducts.products : data.GetTechProducts.products;

                    return (
                        <div className="categories-container">
                            <h2 className="categories-title">{category.toUpperCase()}</h2>
                            <ul className="categories-list">
                                {products.map((product) => {
                                    const kebabName = this.convertToKebabCase(product.name);
                                    return (
                                        <li key={product.id}>
                                            <Link data-testid={`product-${kebabName}`} key={product.id} to={"/product"} onClick={() => this.handleProductClick(product.id)}><Card in_stock={product.in_stock} image={product.gallery[0]} title={product.name} price={product.prices[0].currency.symbol + product.prices[0].amount} updateQuickShopState={this.updateQuickShopState} /></Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    ); 
                }}
            </Query>
        );
    }
}

export default CategoriesPage;
