import React, { Component } from 'react';
import '../styles/Card.css';

class Card extends Component {

    updateQuickShopState = () => {
        this.props.updateQuickShopState();
    }

    render() {
        const { image, title, price, in_stock } = this.props;

        return (
            <div className="card bg-white overflow-hidden relative">
                <img 
                    className={`card-image w-full h-60 object-cover ${!in_stock ? 'out-of-stock' : ''}`} 
                    src={image} 
                    alt={title} 
                />
                {!in_stock && (
                    <div className="overlay">
                        <span className="out-of-stock-text">Out of Stock</span>
                    </div>
                )}
                <div className="p-4">
                    <h2 className="card-title text-gray-700 mb-2">{title}</h2>
                    <p className="card-price font-semibold">{price}</p>
                </div>

                { in_stock &&
                    <button className="quick-shop-btn absolute bottom-2 right-2 bg-green-500 text-white p-2 rounded-full" onClick={this.updateQuickShopState}>
                        <i className="bi bi-cart"></i> 
                    </button>
                }
            </div>
        );
    }
}

export default Card;
