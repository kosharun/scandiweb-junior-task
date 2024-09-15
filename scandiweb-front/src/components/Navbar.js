import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/Navbar.css';
import { GET_CATEGORIES } from '../graphql/queries/GetCategories';
import { Query } from '@apollo/client/react/components';
import Cart from './Cart';  // Import the Cart component

class Navbar extends Component {
    state = {
        showCart: false,
        cartQuantity: 0,
    };

    handleCategoryClick = (category) => {
        this.props.setCategory(category);
    };

    toggleCart = () => {
        this.setState((prevState) => ({
            showCart: !prevState.showCart, 
        }));
    };

    updateCartQuantity = (quantity) => {
        this.setState({ cartQuantity: quantity });
    };

    render() {
        const { showCart } = this.state;

        return (
            <Query query={GET_CATEGORIES}>
                {({ loading, error, data }) => {
                    if (loading) return <p>Loading...</p>;
                    if (error) return <p>Error: {error.message}</p>;
                    return (
                        <>
                            <nav className="navbar">
                                <div className="left-links">
                                    {data.GetCategories.slice(1).map((category) => {
                                        return (
                                            <NavLink
                                                key={category.id}
                                                to={`/categories/${category.name}`}
                                                activeClassName="active"
                                                onClick={() => this.handleCategoryClick(category.name)}
                                                data-testid={window.location.pathname.includes(category.name) ? 'active-category-link' : 'category-link'}
                                            >
                                                {category.name.toUpperCase()}
                                            </NavLink>
                                        );
                                    })}
                                </div>
                                <div className="logo">
                                    <img src="/images/logo.png" alt="Logo" />
                                </div>
                                <div className="right-icons">
                                    <button data-testid='cart-btn' className="cart-icon-container">
                                        <i className="bi bi-cart" onClick={this.toggleCart}></i>
                                        {this.state.cartQuantity > 0 && (
                                            <span className="cart-count-bubble">{this.state.cartQuantity}</span>
                                        )}
                                    </button>
                                </div>
                            </nav>

                            {showCart && <div className="greyed-out" onClick={this.toggleCart}></div>}

                            <Cart showCart={this.state.showCart} updateCartQuantity={this.updateCartQuantity} />
                        </>
                    );
                }}
            </Query>
        );
    }
}

export default Navbar;