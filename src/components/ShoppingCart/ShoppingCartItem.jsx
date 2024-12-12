import React from "react";

class ShoppingCartItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedOptions: props.selectedOptions || {},
            quantity: props.product?.quantity || 0,
        };
    }

    handleQuantityChange = (change) => {
        const newQuantity = this.state.quantity + change;
        if (newQuantity >= 0) {
            this.setState({ quantity: newQuantity });
            this.props.onQuantityChange(newQuantity);
        }
    };

    handleOptionSelect = (attributeName, itemValue) => {
        this.setState((prevState) => ({
            selectedOptions: {
                ...prevState.selectedOptions,
                [attributeName]: itemValue,
            },
        }), () => {
            this.props.onOptionChange(this.state.selectedOptions);
        });
    };

    render() {
        const { product } = this.props;
        const { selectedOptions, quantity } = this.state;

        const attributes = product.attribute || [];

        return (
            <div className="cart-item">
                <div className="item-info">
                    <p className="item-title">{product.name}</p>
                    <p className="item-price">
                        {product.prices[0].currency.symbol}{product.prices[0].amount}
                    </p>
                    {attributes.map((attribute) => (
                        <div key={attribute.id}  data-testid={`cart-item-attribute-${attribute.name.toLowerCase().replace(" ", "-")}`}>
                            <p className="product-property">{attribute.name}:</p>
                            <div className={attribute.name.toLowerCase() === "color" ? "item-color" : "item-size"}>
                                {attribute.items.map((item) => (
                                    <button
                                        key={item.id}
                                        style={attribute.name.toLowerCase() === "color" ? { backgroundColor: item.displayValue.toLowerCase() } : {}}
                                        className={selectedOptions[attribute.name] === item.value ? "active" : ""}
                                        onClick={() => this.handleOptionSelect(attribute.name, item.value)}
                                        disabled={!product.inStock}
                                        data-testid={
                                            selectedOptions[attribute.name] === item.value
                                                ? `cart-item-attribute-${attribute.name.toLowerCase().replace(" ", "-")}-${item.value.toLowerCase()}-selected`
                                                : `cart-item-attribute-${attribute.name.toLowerCase().replace(" ", "-")}-${item.value.toLowerCase()}`
                                        }
                                    >
                                        {attribute.name.toLowerCase() === "color" ? "" : item.displayValue}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="item-quantity">
                    <button onClick={() => this.handleQuantityChange(1)} data-testid="cart-item-amount-increase">+</button>
                    <p data-testid="cart-item-amount">{quantity}</p>
                    <button onClick={() => this.handleQuantityChange(-1)} data-testid="cart-item-amount-decrease">-</button>
                </div>
                <img src={product.gallery[0]} alt="product" className="item-image" />
            </div>
        );
    }
}

export default ShoppingCartItem;
