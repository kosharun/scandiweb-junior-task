import React, { Component } from "react";
import { Query } from "@apollo/client/react/components";
import { GET_PRODUCT } from "../graphql/queries/GetProduct";
import "../styles/ProductPage.css";
import "../styles/Navbar.css";
import parse from 'html-react-parser';
import Cart from "../components/Cart";

class ProductPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedImage: "",
            gallery: [],
            selectedColor: {id: "", value: "", display_value: ""},
            selectedSize: {id: "", value: ""},
            selectedPrice : {amount: 0, symbol: ""},
            showCart: false,
        };
    }

    handleColorChange = (color) => {
        this.setState({ selectedColor: color });
    };

    handleSizeChange = (size) => {
        this.setState({ selectedSize: size });
    };

    handleAddToCart = (priceAmount, priceSymbol, availableColors, availableSizes, itemName) => {
        const roundedAmount = priceAmount.toFixed(2);
        this.setState(
            { selectedPrice: { amount: roundedAmount, symbol: priceSymbol } },
            () => {
                this.addItemsToCart(availableColors, availableSizes, itemName);
            }
        );
    };

    toggleCart = () => {
        this.setState((prevState) => ({
            showCart: !prevState.showCart, 
        }));
    };

    
    addItemsToCart = (availableColors, availableSizes, itemName) => {
        const { productId } = this.props;
        const { selectedPrice, selectedColor, selectedSize, selectedImage } = this.state;
    
        // Create a unique key based on productId, selectedColor, and selectedSize
        const uniqueKey = `${productId}_${selectedColor.value || 'no-color'}_${selectedSize.value || 'no-size'}`;
    
        // Retrieve item from sessionStorage by the unique key
        let cartItem = sessionStorage.getItem(uniqueKey);
        
        if (cartItem) {
            // If item with same attributes exists, increase the quantity
            cartItem = JSON.parse(cartItem);
            cartItem.quantity += 1;
        } else {
            // Otherwise, create a new item
            cartItem = {
                uniqueKey,
                productId,
                itemName,
                selectedPrice,
                selectedColor,
                selectedSize,
                selectedImage,
                availableColors,
                availableSizes,
                quantity: 1
            };
        }
    
        // Save the updated or new cart item to sessionStorage with the unique key
        sessionStorage.setItem(uniqueKey, JSON.stringify(cartItem));

        const event = new Event('cartUpdated');
        window.dispatchEvent(event);
    };
    
    

    setDefaultAttributes = (color=null, size=null) => {
        color !== null && this.setState({ selectedColor: color }); 
        size !== null && this.setState({ selectedSize: size });
    };

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.productId !== this.props.productId) {
            this.setDefaultImage();
        }
    }

    setPrice = (amount, symbol) => {
        this.setState({ selectedPrice: {amount: amount, symbol: symbol} });
    };

    setDefaultImage = () => {
        const { productId } = this.props;
        this.setState({ selectedImage: "", gallery: [] });
    };

    handleThumbnailClick = (image) => {
        this.setState({ selectedImage: image });
    };

    handlePrevClick = () => {
        const { gallery, selectedImage } = this.state;

        if (gallery.length > 0) {
            const currentIndex = gallery.indexOf(selectedImage);
            if (currentIndex > 0) {
                this.setState({ selectedImage: gallery[currentIndex - 1] });
            }
        }
    };

    handleNextClick = () => {
        const { gallery, selectedImage } = this.state;

        if (gallery.length > 0) {
            const currentIndex = gallery.indexOf(selectedImage);
            if (currentIndex < gallery.length - 1) {
                this.setState({ selectedImage: gallery[currentIndex + 1] });
            }
        }
    };

    componentWillUnmount() {
        this.props.closeQuickShop();
    }
    

    render() {
        const { productId, isQuickShopOpen } = this.props;
        const { selectedImage, gallery } = this.state;

        return (
            <Query query={GET_PRODUCT} variables={{ productId }}>
                {({ loading, error, data }) => {
                    if (loading) return <p>Loading...</p>;
                    if (error) {
                        window.location.href = "/";
                    }
                    
                    const product = data.GetProduct;
                    const newGallery = product.gallery || []; // Ensure gallery is an array

                    // Set default image if not set
                    if (!this.state.selectedImage && newGallery.length > 0) {
                        this.setState({
                            selectedImage: newGallery[0],
                            gallery: newGallery,
                        });
                    }

                    // Find the size and color attributes if they exist
                    const sizeAttribute = product.attributes.find(
                        (attr) => attr.name === "Size"
                    );
                    const colorAttribute = product.attributes.find(
                        (attr) => attr.name === "Color"
                    );


                    // Extract available colors and sizes
                    const availableColors = colorAttribute ? colorAttribute.items : [];
                    const availableSizes = sizeAttribute ? sizeAttribute.items : [];

                    if (isQuickShopOpen && this.state.selectedColor.id === "" && availableColors.length > 0) {
                        {colorAttribute &&
                            colorAttribute.items.length > 0 && (
                                this.setDefaultAttributes(colorAttribute.items[0], null)
                            )
                        }
                    }

                    if (isQuickShopOpen && this.state.selectedSize.id === "" && availableSizes.length > 0) {
                        {sizeAttribute &&
                            sizeAttribute.items.length > 0 && (
                                this.setDefaultAttributes(null, sizeAttribute.items[0])
                            )
                        }
                    }
                    
                    const itemName = product.name;

                    return (
                        <div className="product-page-container">
                            {/* Product Gallery */}
                            <div className="product-gallery-container" data-testid='product-gallery'>
                                <div className="thumbnail-list">
                                    {newGallery.map((image, index) => (
                                        <img
                                            key={index}
                                            src={image}
                                            alt={`Thumbnail ${index}`}
                                            className={`gallery-thumbnail ${
                                                selectedImage === image
                                                    ? "selected"
                                                    : ""
                                            }`}
                                            onClick={() =>
                                                this.handleThumbnailClick(image)
                                            }
                                        />
                                    ))}
                                </div>
                                <div className="carousel">
                                    <div
                                        className="arrow left-arrow"
                                        onClick={this.handlePrevClick}
                                    >
                                        &lt;
                                    </div>
                                    <div className="selected-image">
                                        <img
                                            src={selectedImage}
                                            alt="Selected"
                                            className="main-image"
                                        />
                                    </div>
                                    <div
                                        className="arrow right-arrow"
                                        onClick={this.handleNextClick}
                                    >
                                        &gt;
                                    </div>
                                </div>
                            </div>

                            {/* Product Details */}
                            <div className="product-details">
                                {/* Product Name */}
                                <h1 className="product-name">{product.name}</h1>

                                {/* Size Options (Only render if available) */}
                                {sizeAttribute &&
                                    sizeAttribute.items.length > 0 && (
                                        <div className="product-size">
                                            <h4>SIZE:</h4>
                                            <div className="size-options" data-testid='product-attribute-size'>
                                                {sizeAttribute.items.map(
                                                    (item, idx) => (
                                                        <button
                                                            key={idx}
                                                            className={`size-option ${
                                                                item.value ===
                                                                this.state.selectedSize.value
                                                                    ? "selected"
                                                                    : ""
                                                            }`}
                                                            onClick={() =>
                                                                this.handleSizeChange(
                                                                    item
                                                                )
                                                            }
                                                        >
                                                            {item.value}
                                                        </button>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    )}

                                {/* Color Options (Only render if available) */}
                                {colorAttribute &&
                                    colorAttribute.items.length > 0 && (
                                        <div className="product-color">
                                            <h4>COLOR:</h4>
                                            <div className="color-options" data-testid='product-attribute-color'>
                                                {colorAttribute.items.map(
                                                    (item, idx) => (
                                                        <div
                                                            key={idx}
                                                            className={`color-option ${
                                                                item.value ===
                                                                this.state
                                                                    .selectedColor.value
                                                                    ? "selected"
                                                                    : ""
                                                            }`}
                                                            style={{
                                                                backgroundColor:
                                                                    item.value,
                                                            }}
                                                            onClick={() =>
                                                                this.handleColorChange(
                                                                    item
                                                                )
                                                            }
                                                        ></div>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    )}

                                {/* Product Price */}
                                <p className="product-price">
                                    {product.prices[0].currency.symbol}
                                    {product.prices[0].amount}
                                </p>

                                {/* Add to Cart Button */}
                                
                                    <button 
                                        data-testid='add-to-cart'
                                        className={`${(product.in_stock && (this.state.selectedColor.id !== ""  || this.state.selectedSize.id !== "" || (!colorAttribute && !sizeAttribute))) ? 'add-to-cart-button' : 'disabled-button'}`}
                                        onClick={
                                            () => {
                                                this.handleAddToCart(
                                                    product.prices[0].amount,
                                                    product.prices[0].currency.symbol,
                                                    availableColors,
                                                    availableSizes,
                                                    itemName
                                            );
                                            this.setState({ showCart: true }); 
                                        }}>
                                        ADD TO CART
                                    </button>
                                    {this.state.showCart && <div className="greyed-out" onClick={this.toggleCart}></div>}


                                
                                {/* Product Description */}
                                <p className="product-description" data-testid='product-description'>
                                    {parse(product.description)}
                                </p>
                            </div>
                            <Cart showCart={this.state.showCart} />
                        </div>
                    );
                }}
            </Query>
        );
    }
}

export default ProductPage;
