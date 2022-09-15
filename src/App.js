import React from "react";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  useRoutes,
} from "react-router-dom";
import Tradding from './containers/Tradding/index';
const App = () => {
  let routes = useRoutes([
    { path: "/", element: <Tradding /> },
    { path: "/tradding/:symbol/:pair", element: <Tradding /> },
    // ...
  ]);
  return routes;
};

const AppWrapper = () => {
  return (
    <Router>
      <App />
    </Router>
  );
};

export default AppWrapper;