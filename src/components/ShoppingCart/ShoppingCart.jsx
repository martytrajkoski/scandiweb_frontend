import React from "react";
import ShoppingCartItem from "./ShoppingCartItem";
import { createOrder } from "../../api/api";

class ShoppingCart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cartProducts: [],
        };
    }

    componentDidMount() {
        const cartProducts = JSON.parse(localStorage.getItem("cart")) || [];
        this.setState({ cartProducts });
    }
    
    handleQuantityChange = (index, newQuantity) => {
        const updatedCartProducts = [...this.state.cartProducts];
       
        if (newQuantity <= 0) {
            updatedCartProducts.splice(index, 1);
        } else {
            updatedCartProducts[index].quantity = newQuantity;
        }

        this.props.updateCartProducts(updatedCartProducts);

        this.setState({ cartProducts: updatedCartProducts }, () => {
            localStorage.setItem("cart", JSON.stringify(this.state.cartProducts));
        });
    };

    handleOptionChange = (index, newOptions) => {
        const updatedCartProducts = [...this.state.cartProducts];
        updatedCartProducts[index].selectedOptions = newOptions;

        this.setState({ cartProducts: updatedCartProducts }, () => {
            localStorage.setItem("cart", JSON.stringify(this.state.cartProducts));
        });
    };

    placeOrder = async () => {
        const { cartProducts } = this.state;
    
        if (cartProducts.length === 0) {
            alert("Your cart is empty! Add some items before placing an order.");
            return;
        }
        
        const total_amount = cartProducts.reduce(
            (sum, product) => sum + product.prices[0].amount * product.quantity,
            0
        );

        const selectedOptionsToString = (selectedOptions) => {
            return Object.entries(selectedOptions)
                .map(([key, value]) => `${key}: ${value}`)
                .join(', ');
        };

        const items = cartProducts.map((product) => ({
            product_id: product.id,
            quantity: product.quantity,
            selectedOptions: selectedOptionsToString(product.selectedOptions)
        }));

        try {
            await createOrder(total_amount, items);
        
            this.setState({ cartProducts: [] }, () => {
                localStorage.removeItem("cart");
                localStorage.setItem("totalQuantity", "0");
                alert("Your order has been placed successfully!");
            });
        } catch (error) {
            console.error("Error placing the order:", error);
    
            alert(
                error?.message || 
                "An error occurred while placing the order. Please try again."
            );
        }
    };
     

    render() {
        const { cartProducts } = this.state;
        const totalCost = cartProducts.reduce((sum, product) => sum + product.prices[0].amount * product.quantity, 0);
        const totalQuantity = cartProducts.reduce((sum, product) => sum + product.quantity, 0);

        return (
            <div className="shopping-cart">
                <div className="bag-counter">
                    <span><b>My Bag,</b>{totalQuantity} {totalQuantity>1 ? (<p>Items</p>):(<p>Item</p>)}</span> 
                </div>
                <div className="cart-items">
                    {cartProducts.map((product, index) => (
                        <ShoppingCartItem
                            key={index}
                            product={product}
                            selectedOptions={product.selectedOptions || {}}
                            onQuantityChange={(newQuantity) => this.handleQuantityChange(index, newQuantity)}
                            onOptionChange={(newOptions) => this.handleOptionChange(index, newOptions)}
                        />
                    ))}
                </div>
                <div className="cart-total" data-testid="cart-total">
                    <div>Total</div>
                    <div>${totalCost.toFixed(2)}</div>
                </div>
                
                <button className="cart-submit" onClick={this.placeOrder} disabled={totalQuantity<1}>PLACE ORDER</button>
            </div>
        );
    }
}

export default ShoppingCart;
