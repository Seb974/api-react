import React from "react";
import ReactDOM from "react-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import MessagesPage from "./pages/MessagesPage";
import MessagesPageWithApiPagination from "./pages/MessagesPageWithApiPagination";
import { HashRouter, Switch, Route } from "react-router-dom";

require("../css/app.css");

console.log("Hello world !!!");

const App = () => {
  return (
      <HashRouter>
        <Navbar />
        <main className="container pt-5">
            <Switch>
                <Route path="/" component={HomePage} exact />
                <Route path="/messages" component={MessagesPage} />
            </Switch>
        </main>
      </HashRouter>
  )
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
