import React from "react";
import shoppingCart from "../../assets/Empty Cart.png";
import Logo from "../../assets/logo.png";
import ShoppingCart from "../ShoppingCart/ShoppingCart";
import { fetchCategories } from "../../api/api"; 
import { withRouter } from "../../routes/withRouter";

class Navbar extends React.Component {    
    constructor(props) {
        super(props);

        this.state = {
            categories: null, 
            loading: true, 
            error: null,
            isCartVisible: false,
            activeCategory: "ALL", 
            cartProducts: [],
        };
    }

    componentDidMount() {
        const cartProducts = JSON.parse(localStorage.getItem("cart")) || [];
        const cartQuantity = JSON.parse(localStorage.getItem("totalQuantity") || 0);
        this.setState({ cartProducts });

        this.loadCategories();
    }
    
    loadCategories = async () => {
        try {
            const data = await fetchCategories();
            this.setState({
                categories: data.categories,
                loading: false,
            });
            console.log("data.categories", data.categories);
        } catch (error) {
            this.setState({ error, loading: false });
        }
    };
    
    loadCategory = async (category) => {
        try {
            const data = await fetchCategory(category); 
            this.setState({
                categories: data.categories,
                loading: false,
                activeCategory: category || "ALL",
            });
            console.log("data.categories", data.categories);
        } catch (error) {
            this.setState({ error, loading: false }); 
        }
    };
    
    updateCartProducts = (updatedProducts) => {
        this.setState({ cartProducts: updatedProducts });
        localStorage.setItem("cart", JSON.stringify(updatedProducts));
    };

    toggleCartVisibility = () => {
        this.setState(prevState => ({
            isCartVisible: !prevState.isCartVisible,
        }));
    };

    handleAllCategoriesClick = () => {
        this.setState({ activeCategory: "ALL" });
        this.props.navigate(`all`);
        this.loadCategories();
    };

    handleCategoryClick = (category) => {
        this.setState({ activeCategory: category.name });
        this.props.navigate(`${category.name}`);
        this.loadCategory(category.name);
    };

    render() {
        const { categories, isCartVisible, activeCategory, cartProducts } = this.state;
        const totalQuantity = cartProducts.reduce((sum, product) => sum + product.quantity, 0);

        return (
            <>
                <div className="navbar">
                    <ul className="navbar-links">
                        <li 
                            className={`navbar-item ${activeCategory === "ALL" ? "active" : ""}`}
                            onClick={() => this.handleAllCategoriesClick()}
                            data-testid={ activeCategory === "ALL" ? "active-category-link" : "category-link"}
                        >
                            ALL
                        </li>
                        {categories && categories.map((category) => (
                            <li 
                                key={category.name}
                                className={`navbar-item ${activeCategory === category.name ? "active" : ""}`}
                                onClick={() => this.handleCategoryClick(category)}
                                data-testid={activeCategory === category.name ? "active-category-link" : "category-link"}
                            >
                                {category.name}
                            </li>
                        ))}
                    </ul>
                    <div className="navbar-logo">
                        <img src={Logo} className="logo" alt="Logo" />
                    </div>
                    <div className="navbar-cart" onClick={this.toggleCartVisibility}>
                        {totalQuantity > 0 && (
                            <div className="cart-counter">{totalQuantity}</div>
                        )}
                        <img src={shoppingCart} className="cart-icon" alt="Shopping Cart" />
                    </div>
                </div>
                {isCartVisible && (
                    <>
                        <div className="overlay" data-testid='cart-btn' onClick={this.toggleCartVisibility}></div>
                        <ShoppingCart updateCartProducts={this.updateCartProducts} />
                    </>
                )}
            </>
        );
    }
}

export default withRouter(Navbar);
