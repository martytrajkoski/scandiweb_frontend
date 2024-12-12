import React from "react";
import { withRouter } from "../../routes/withRouter";
import addToCartIcon from "../../assets/Circle Icon.png"

class Product extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOptions: {}
    }
  }

  componentDidMount() {
    const { product } = this.props;

    if (product && product.inStock) {
      this.setDefaultOptions(product);
    }
  }

  componentDidUpdate(prevProps) {
    const { product } = this.props;
    if (product !== prevProps.product) {
      if (product && product.inStock) {
        this.setDefaultOptions(product);
      }
    }
  }

  setDefaultOptions = (product) => {
    product.attribute.forEach((attribute) => {
      if (product.inStock && attribute.items.length > 0) {
        this.handleOptionSelect(attribute.id, attribute.items[0].value);
      }
    });
  };

  handleOptionSelect = (attributeId, itemValue) => {
    this.setState((prevState) => ({
      selectedOptions: {
        ...prevState.selectedOptions,
        [attributeId]: itemValue,
      },
    }));
  };

  addToCart = (e) => {
    e.stopPropagation();
    const { product } = this.props;
    const { selectedOptions } = this.state;
    const cartItem = {
      ...product,
      selectedOptions,
      quantity: 1
    };
    
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    
    const existingItemIndex = cart.findIndex(item => 
      item.id === cartItem.id && 
      JSON.stringify(item.selectedOptions) === JSON.stringify(cartItem.selectedOptions)
    );

    if (existingItemIndex > -1) {
        cart[existingItemIndex].quantity += 1;
      } else {
        cart.push(cartItem);
      }
      
      
      localStorage.setItem("cart", JSON.stringify(cart));

    };

  handleNavigation = () => {
    this.props.navigate(`/product/${this.props.product.id}`);
  };

  render() {
    const { product, selectedOptions } = this.props;
    
    return (
      <div 
        className="product" 
        onClick={this.handleNavigation}
        data-testid={`product-${product.name.toLowerCase().replace(/ /g, "-")}`}
      >
        {product.inStock ? (
          <>
            <img src={product.gallery[0]} alt="image" />
            <div className="product-addToCart" onClick={this.addToCart}>
              <img src={addToCartIcon} alt="" />
            </div>
          </>
        ) : (
          <div className="product-outofstock">
            <p>OUT OF STOCK</p>
            <img src={product.gallery[0]} alt="image" />
          </div>
        )}
        <div className="product-info">
          <p className="product-title">{product.brand} | {product.name}</p>
          <p className="product-price">{product.prices[0].currency.symbol}{product.prices[0].amount}</p>
        </div>
      </div>
    );
  }
}

export default withRouter(Product);
