import React from "react";
import Product from "../../components/Product/Product"; 
import { fetchProducts } from "../../api/api"; 
import withRouterParams from "../../routes/withRouterParams";

class Category extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null, 
            loading: true, 
            error: null 
        };
    }

    componentDidMount(){
        this.loadProducts(); 
    }

    componentDidUpdate(prevProps) {
        if (prevProps.params.category !== this.props.params.category) {
            this.setState({ loading: true, products: null, error: null }, () => {
                this.loadProducts(); 
            });
        }
    }

    loadProducts = async () => {
        const { category } = this.props.params;
        try {
            const data = await fetchProducts();
            
            let filteredProducts = data.products.filter(p => {
                return p.category.id === category;
            });
                        
            if (filteredProducts.length === 0) {
                filteredProducts = data.products;
            }
    
            this.setState({ products: filteredProducts, loading: false });
        } catch (error) {
            this.setState({ error, loading: false });
        }
    };
    
    
    render() {
        const { products, loading, error } = this.state; 
        const { category } = this.props.params;
        if (loading) return <p>Loading...</p>; 
        if (error) return <p>Error: {error.message}</p>;

        return (
            <div className="category">
                <div className="category-type">
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                </div>
                <div className="category-products">
                    {products && products.map((product, index) => (
                        <Product key={index} product={product} />
                    ))}
                </div>
            </div>
        );
    }
}

export default withRouterParams(Category);
