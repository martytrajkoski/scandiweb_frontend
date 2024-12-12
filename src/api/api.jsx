const URL = 'http://localhost:8000/graphql';

export const fetchProducts = async () => {
    try {
        const response = await fetch( URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: `{products {
                            id
                            name
                            inStock
                            gallery
                            description
                            brand
                            category {
                            id
                            name
                            }
                            attribute{
                                id
                                name
                                type
                                items{
                                    id
                                    displayValue
                                    value
                                }
                            }
                            prices {
                            amount
                            currency{
                                label
                                symbol
                            }
                            }
                        }
                        }`,
            }),
        });

        // console.log('response', response)
        const { data, errors } = await response.json();

        if (errors) {
            console.error('GraphQL Errors:', errors);
            throw new Error(errors.map((e) => e.message).join(', '));
        }

        // console.log('Categories Data:', data);
        return data;
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
};

export const fetchCategories = async () => {
    try {
        const response = await fetch(URL , {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: `{ categories { id name } }`,
            }),
        });
        console.log('response', response)
        const { data, errors } = await response.json();

        if (errors) {
            console.error('GraphQL Errors:', errors);
            throw new Error(errors.map((e) => e.message).join(', '));
        }

        console.log('Categories Data:', data);
        return data;
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
};

export const fetchCategory = async (category) => {
    try {
        const response = await fetch( URL , {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                query: `{ category(id: "${category}") { id name } }`,
            }),
        });
        const { data, errors } = await response.json();

        if (errors) {
            console.error("GraphQL Errors:", errors);
            throw new Error(errors.map((e) => e.message).join(", "));
        }

        return data;
    } catch (error) {
        console.error("Error fetching category:", error);
        throw error;
    }
};

export const createOrder = async (totalAmount, items) => {
    const query = `
        mutation CreateOrder($input: OrderInput!) {
          createOrder(input: $input) {
            total_amount
            items {
              product_id
              quantity
              selectedOptions
            }
          }
        }
    `;

    const variables = {
        input: {
            total_amount: totalAmount,
            items: items
        }
    };

    try {
        const response = await fetch( URL , {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ query, variables })
        });

        const data = await response.json();

        if (response.ok && data.data) {
            return data.data.createOrder; // Return the created order
        } else {
            throw new Error(
                data.errors?.[0]?.message || "Failed to create order"
            );
        }
    } catch (error) {
        console.error("Error in createOrderRequest:", error.message);
        throw error; // Re-throw the error to be handled by the caller
    }
};


