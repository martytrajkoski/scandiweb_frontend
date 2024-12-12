import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home/Home";
import React from "react";
import Category from "../pages/Category/Category";
import ProductPage from "../pages/ProductPage/ProductPage";

class AppRoutes extends React.Component {
    render() {
        return (
            <Router>
                <Routes>
                    <Route path="/" element={<Navigate to="/all" />} />
                    <Route path="/" element={<Home />}>
                        <Route path=":category" element={<Category/>}/>
                        <Route path="product/:id"element={<ProductPage/>} />
                    </Route>
                </Routes>
            </Router>
        );
    }
}

export default AppRoutes;
