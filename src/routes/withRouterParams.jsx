import React from "react";
import { useParams } from "react-router-dom";

function withRouterParams(Component) {
    return function (props) {
        let params = useParams();
        return <Component {...props} params={params} />;
    };
}

export default withRouterParams;
