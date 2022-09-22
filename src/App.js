import React from "react";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  useRoutes,
} from "react-router-dom";
import Trading from './containers/Trading/index';
const App = () => {
  let routes = useRoutes([
    { path: "/", element: <Trading /> },
    { path: "/trading/:symbol/:pair", element: <Trading /> },
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