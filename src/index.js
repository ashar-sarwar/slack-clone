import React, { Component } from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  withRouter
} from "react-router-dom";
import "semantic-ui-css/semantic.min.css";
import Register from "./components/Auth/Register/Register";
import Login from "./components/Auth/Login/Login";
import firebase from "./firebase";
import { Provider, connect } from "react-redux";
import store from "./store";
import { setUser, clearUser } from "./actions/userActions";
import Spinner from "./components/Commons/Spinner";
import App from "./components/App";

class Root extends Component {
  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      console.log(user);
      if (user) {
        this.props.setUser(user);
        this.props.history.push("/");
      } else {
        this.props.history.push("/login");
        this.props.clearUser();
      }
    });
  }
  render() {
    return this.props.loading ? (
      <Spinner />
    ) : (
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/" component={App} />
      </Switch>
    );
  }
}

const mapStateToProps = state => ({
  loading: state.user.isLoading
});

const actions = {
  setUser,
  clearUser
};

const RootWithAuth = withRouter(
  connect(
    mapStateToProps,
    actions
  )(Root)
);

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <RootWithAuth />
    </Router>
  </Provider>,
  document.getElementById("root")
);
