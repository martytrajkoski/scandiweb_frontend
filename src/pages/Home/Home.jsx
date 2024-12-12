import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import { Outlet } from "react-router-dom";

class Home extends React.Component{
    render(){
        return(
            <div className="home-container">
                <Navbar></Navbar>
                <div className="outlet">
                    <Outlet />
                </div>
            </div>
        )
    }
}

export default Home;