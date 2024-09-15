import React, { Component } from 'react';
import '../styles/Cart.css';
import { PLACE_ORDER } from '../graphql/mutations/PlaceOrder';
import { Mutation } from '@apollo/client/react/components';

class Cart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cartItems: [],
            total: 0,
            totalQuantity: 0
        };
    }

    static defaultProps = {
        updateCartQuantity: () => {}
    };

    componentDidMount() {
        this.loadCartItems();
        window.addEventListener('cartUpdated', this.loadCartItems);
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.cartItems !== this.state.cartItems) {
            this.updateTotal();
            this.props.updateCartQuantity(this.state.totalQuantity);
        }
    }

    componentWillUnmount() {
        window.removeEventListener('cartUpdated', this.loadCartItems);
    }

    loadCartItems = () => {
        let items = [];
        let totalPrice = 0;
        let totalQty = 0;

        for (let key in sessionStorage) {
            if (sessionStorage.hasOwnProperty(key)) {
                let item = JSON.parse(sessionStorage.getItem(key));
                if (item && item.selectedPrice && item.selectedColor && item.selectedSize) {
                    items.push(item);
                    totalPrice += item.selectedPrice.amount * item.quantity;
                    totalQty += item.quantity;
                }
            }
        }

        this.setState({
            cartItems: items,
            total: totalPrice.toFixed(2),
            totalQuantity: totalQty
        });
    };

    updateTotal = () => {
        const { cartItems } = this.state;
        const newTotal = cartItems.reduce((acc, item) => acc + (item.selectedPrice.amount * item.quantity), 0);
        const newTotalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);
        this.setState({
            total: newTotal.toFixed(2),
            totalQuantity: newTotalQuantity
        }, () => {
            this.props.updateCartQuantity(this.state.totalQuantity);
        });
    };

    incrementQuantity = (index) => {
        const { cartItems } = this.state;
        const updatedItems = [...cartItems];
        updatedItems[index].quantity += 1;
        this.setState({ cartItems: updatedItems }, () => {
            this.updateSessionStorage(updatedItems[index]);
        });
    };

    decrementQuantity = (index) => {
        const { cartItems } = this.state;
        const updatedItems = [...cartItems];
        if (updatedItems[index].quantity > 1) {
            updatedItems[index].quantity -= 1;
            this.setState({ cartItems: updatedItems }, () => {
                this.updateSessionStorage(updatedItems[index]);
                this.updateTotal(); 
            });
        } else {
            const itemId = updatedItems[index].uniqueKey;
            updatedItems.splice(index, 1);
            this.setState({ cartItems: updatedItems }, () => {
                sessionStorage.removeItem(itemId);
                this.updateTotal(); 
            });
        }
    };

    updateSessionStorage = (item) => {
        sessionStorage.setItem(item.uniqueKey, JSON.stringify(item));
    };

    handlePlaceOrder = (placeOrder) => {
        const { cartItems, total } = this.state;
        const orderItems = cartItems.map(item => {
            const attributes = [];
            if (item.selectedColor.id !== "") {
                attributes.push({ id: item.selectedColor.id, value: item.selectedColor.value });
            }
            if (item.selectedSize.id !== "") {
                attributes.push({ id: item.selectedSize.id, value: item.selectedSize.value });
            }
            return {
                product_id: item.productId,
                quantity: item.quantity,
                attributes: attributes
            };
        });

        placeOrder({
            variables: {
                orderItems,
                price: parseFloat(total),
                currency: cartItems[0].selectedPrice.symbol 
            }
        }).then(response => {
            const { success, orderId, message } = response.data.PlaceOrder;
            if (success) {
                console.log('Order placed successfully:', orderId);
                // Clear the cart
                this.setState({
                    cartItems: [],
                    total: 0,
                    totalQuantity: 0
                });
                sessionStorage.clear();
                this.props.updateCartQuantity(0);
            } else {
                console.error('Order placement failed:', message);
            }
        }).catch(error => {
            console.error('Error placing order:', error);
        });
    };

    
    render() {
        const { showCart } = this.props;
        const { cartItems, total, totalQuantity } = this.state;
    
        return (
            showCart && (
                <div className="cart-modal">
                    <h3>My Bag, {totalQuantity} {totalQuantity === 1 ? 'item' : 'items'}</h3>
    
                    <div className="cart-items-container">
                        {cartItems.map((item, index) => (
                            <div key={index} className="cart-item">
                                <div className="cart-item-details">
                                    <p className="product-name">{item.itemName || 'Product Name'}</p>
                                    <p className="product-price">{item.selectedPrice.symbol}{item.selectedPrice.amount}</p>
    
                                    {item.availableSizes && item.availableSizes.length > 0 && (
                                        <div 
                                            className="size-options" 
                                            data-testid={`cart-item-attribute-size`}>
                                            <p className="attribute-label">Size:</p>
                                            {item.availableSizes.map((size, idx) => (
                                                <span
                                                    key={idx}
                                                    className={`size-option ${
                                                        size.value === item.selectedSize.value ? 'selected' : ''
                                                    }`}
                                                    data-testid={`cart-item-attribute-size-${size.value.toLowerCase()}${
                                                        size.value === item.selectedSize.value ? '-selected' : ''
                                                    }`}
                                                >
                                                    {size.value}
                                                </span>
                                            ))}
                                        </div>
                                    )}
    
                                    {item.availableColors && item.availableColors.length > 0 && (
                                        <div 
                                            className="color-options" 
                                            data-testid={`cart-item-attribute-color`}>
                                            <p className="attribute-label">Color:</p>
                                            {item.availableColors.map((color, idx) => (
                                                <span
                                                    key={idx}
                                                    className={`color-option ${
                                                        color.value === item.selectedColor.value ? 'selected' : ''
                                                    }`}
                                                    data-testid={`cart-item-attribute-color-${color.value.toLowerCase()}${
                                                        color.value === item.selectedColor.value ? '-selected' : ''
                                                    }`}
                                                    style={{ backgroundColor: color.value }}
                                                ></span>
                                            ))}
                                        </div>
                                    )}
    
                                    <div className="quantity-control">
                                        <button data-testid='cart-item-amount-increase' className="quantity-btn" onClick={() => this.incrementQuantity(index)}>
                                            +
                                        </button>
                                        <p data-testid='cart-item-amount' className="quantity-value">{item.quantity}</p>
                                        <button data-testid='cart-item-amount-decrease' className="quantity-btn" onClick={() => this.decrementQuantity(index)}>
                                            -
                                        </button>
                                    </div>
                                </div>
                                <div className="cart-item-image">
                                    <img src={item.selectedImage} alt="Product" />
                                </div>
                            </div>
                        ))}
                    </div>
    
                    <div data-testid='cart-total' className="cart-total">
                        <p>
                            Total: <span className="total-amount">${total}</span>
                        </p>
                    </div>
                    <Mutation mutation={PLACE_ORDER}>
                        {(placeOrder, { loading }) => (
                            <div>
                                <button onClick={() => this.handlePlaceOrder(placeOrder)} className={totalQuantity === 0 ? "place-order-disabled-btn" : "place-order-btn"}>Place Order</button>
                                {loading && <p>Placing order...</p>}
                            </div>
                        )}
                    </Mutation>
                </div>
            )
        );
    }
}

export default Cart;