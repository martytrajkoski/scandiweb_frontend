import React from "react";
import ProductGallery from "../../components/ProductGallery/ProductGallery";
import withRouterParams from "../../routes/withRouterParams";
import { fetchProducts } from "../../api/api"; 
import parse from "html-react-parser"; 

class ProductPage extends React.Component{
    
    constructor(props) {
        super(props);
        this.state = {
            selectedOptions: {},
            data: null, 
            loading: true, 
            error: null 
        };
    }

    componentDidMount() {
        this.loadProduct(); 
    }

    loadProduct = async () => {
        const { id } = this.props.params;
        try {
            const data = await fetchProducts();
            const product = data.products.find(p => p.id === id);
            if (product) {
                this.setState({ product, loading: false }, () => {
                    product.attribute.forEach((attribute) => {
                        if(product.inStock)
                            this.handleOptionSelect(attribute.id, attribute.items[0].value);
                    });
                });
            } else {
                this.setState({ error: 'Product not found', loading: false });
            }
        } catch (error) {
            this.setState({ error, loading: false });
        }
    };
    
    handleOptionSelect = (attributeId, itemValue) => {
        this.setState((prevState) => ({
            selectedOptions: {
                ...prevState.selectedOptions,
                [attributeId]: itemValue,
            },
        }));
    };

    addToCart = () => {
        const { product, selectedOptions } = this.state;
        const cartItem = {
            ...product,
            selectedOptions,
            quantity: 1
        };
    
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
    
        const existingItemIndex = cart.findIndex(item => 
            item.value === cartItem.value && 
            JSON.stringify(item.selectedOptions) === JSON.stringify(cartItem.selectedOptions)
        );
    
        if (existingItemIndex > -1) {
            cart[existingItemIndex].quantity += 1;
        } else {
            cart.push(cartItem);
        }

        localStorage.setItem("cart", JSON.stringify(cart));

    };

    // descriptionFilter = (description) => {
    //     return description
    //       .split(/\\n|\\n\\n/)
    //       .filter((line) => line.trim() !== '')
    //       .map((line, index) => (
    //         <React.Fragment key={index}>
    //           <span dangerouslySetInnerHTML={{ __html: line.trim() }} />
    //           <br />
    //         </React.Fragment>
    //     ));
    // };
    descriptionFilter = (description) => {
        return description
            .split(/\\n\\n|\\n/)
            .filter((line) => line.trim() !== "")
            .map((line, index) => <p key={index}>{parse(line.trim())}</p>);
    };

    render(){
        const { product, loading, error, selectedOptions } = this.state;
        console.log('product', product)
        return (
            <div className="product-page">
                {product && (
                    <> 
                        <ProductGallery photos={product.gallery} />
                        <div className="product-details" data-testid="product-gallery">
                            <p className="product-title">
                                {product.brand} | {product.name}
                            </p>
                            {product.attribute.map((attribute) => (
                                <div 
                                    key={attribute.id} 
                                    className="product-attribute"  
                                    data-testid={`product-attribute-${attribute.name.toLowerCase().replace(/ /g, "-")}`}>
                                    <p className="product-property">{attribute.name}:</p>
                                    <div className={attribute.name.toLowerCase() === "color" ? "product-color-buttons" : "product-size-buttons"}>
                                        {attribute.items.map((item) => (
                                            <button
                                                key={item.id}
                                                style={attribute.name.toLowerCase() === "color" ? { backgroundColor: item.displayValue.toLowerCase() } : {}}
                                                className={selectedOptions[attribute.id] === item.value ? "active" : ""}
                                                onClick={() => this.handleOptionSelect(attribute.id, item.value)}
                                                disabled={!product.inStock}
                                            >
                                                {attribute.name.toLowerCase() === "color" ? "" : item.displayValue}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            <div className="product-price">
                                <p className="product-property">Price:</p>
                                <p className="price">
                                    {product.prices[0].currency.symbol}{product.prices[0].amount}
                                </p>
                            </div>
                            <button
                                className="product-submit"
                                onClick={this.addToCart}
                                disabled={!product.inStock}
                                data-testid="add-to-cart"
                            >
                                ADD TO CART
                            </button>
                            {!product.inStock && <p style={{ color: "red" }}>Out of stock</p>}
                            <div data-testid="product-description">
                                {this.descriptionFilter(product.description)}
                            </div>
                        </div>
                    </>
                )}
            </div>
        );

    }
}

export default withRouterParams(ProductPage);