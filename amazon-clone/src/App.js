// import logo from './logo.svg';
import React, { useEffect } from "react";
import "./App.css";
import Header from "./Header";
import Home from "./Home";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Checkout from "./Checkout";
import Login from "./Login";
import { auth } from "./Firebase";
import { useStateValue } from "./StateProvider";
import Payment from "./Payment";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import Orders from "./Orders";

const promise = loadStripe(
  "pk_test_51HzPL7G8252jBwmOzDhyA5z27jhdfcyRVmpFBQCoLmu64rfb7CWSbhZPTP21xi7bSScLw2FIkMNwqyJTwCFaAzBS007vzuoBm1"
);

function App() {
  const [{}, dispatch] = useStateValue();

  useEffect(() => {
    //will Only Run once when the app componenets loads
    auth.onAuthStateChanged((authUser) => {
      console.log("The User is >>>", authUser);

      if (authUser) {
        //the User just logged in /the user was logged in
        dispatch({
          type: "SET_USER",
          user: authUser,
        });
      } else {
        //the user is logged out

        dispatch({
          type: "SET_USER",
          user: null,
        });
      }
    });
  }, []);

  return (
    //BEM
    <Router>
      <div className="App">
        <Switch>
          <Route path="/login">
            {/* <Checkout/> */}
            {/* <h1>Login Page</h1> */}
            <Login />
          </Route>
          <Route path="/orders">
            <Header />
            <Orders />
          </Route>
          <Route path="/checkout">
            <Header />
            <Checkout />
          </Route>

          <Route path="/payment">
            <Header />
            <Elements stripe={promise}>
              <Payment />
            </Elements>
          </Route>

          <Route path="/">
            <Header />
            <Home />
          </Route>
        </Switch>
        {/* <h1>Hello Everyone This is my Store🐱‍💻🐱‍💻</h1> */}
      </div>
    </Router>
  );
}

export default App;
