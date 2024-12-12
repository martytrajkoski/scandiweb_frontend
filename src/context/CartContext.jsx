import React, { createContext, Component } from "react";

export const CartContext = createContext();

export class CartProvider extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cart: JSON.parse(localStorage.getItem("cart")) || [],
            totalQuantity: JSON.parse(localStorage.getItem("totalQuantity")) || 0,
        };
    }

    updateCart = (updatedCart) => {
        const totalQuantity = updatedCart.reduce((sum, item) => sum + item.quantity, 0);
        
        this.setState({ cart: updatedCart, totalQuantity });
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        localStorage.setItem("totalQuantity", totalQuantity);
    };

    render() {
        return (
            <CartContext.Provider
                value={{
                    cart: this.state.cart,
                    totalQuantity: this.state.totalQuantity,
                    updateCart: this.updateCart,
                }}
            >
                {this.props.children}
            </CartContext.Provider>
        );
    }
}
