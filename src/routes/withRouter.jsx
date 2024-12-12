import { useNavigate } from "react-router-dom";
import React from "react";

export function withRouter(Component) {
  function ComponentWithRouter(props) {
    let navigate = useNavigate();
    return <Component {...props} navigate={navigate} />;
  }

  return ComponentWithRouter;
}
