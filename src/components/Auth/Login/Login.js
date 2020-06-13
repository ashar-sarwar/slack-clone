import React, { Component } from "react";
import {
  Grid,
  Form,
  Segment,
  Button,
  Header,
  Message,
  Icon
} from "semantic-ui-react";
import { Link } from "react-router-dom";
import "./Login.css";
import firebase from "./../../../firebase";
import Util from "../../../Util";
import _ from "lodash";
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      errors: {},
      loading: false
    };
  }

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  validation = () => {
    this.setState({ errors: {}, loading: true });
    const { email, password } = this.state;

    let formErrors = {};

    if (!Util.isEmailValid(email)) {
      formErrors.email = "email is invalid";
    }

    if (!Util.isPasswordValid(password)) {
      formErrors.password = "password is invalid";
    }

    if (_.isEmpty(email)) {
      formErrors.email = "email is req";
    }

    if (_.isEmpty(password)) {
      formErrors.password = "password is req";
    }

    this.setState({ errors: !_.isEmpty(formErrors) ? formErrors : {} });

    if (_.isEmpty(formErrors)) {
      return true;
    } else {
      this.setState({ loading: false });
      return false;
    }
  };

  handleSubmit = e => {
    e.preventDefault();

    if (!this.validation()) {
      return;
    }

    firebase
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(result => {})
      .catch(err => {
        let formError = {};
        formError.err = err.message;
        this.setState({ errors: formError, loading: false });
      });
  };

  render() {
    const {
      name,
      email,
      password,
      confirmPassword,
      errors,
      loading
    } = this.state;
    console.log("Errors", errors);
    return (
      <Grid textAlign="center" verticalAlign="middle" className="Login">
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h2" icon color="violet" textAlign="center">
            <Icon name="code branch" color="violet" />
            Login for Dev Chat
          </Header>
          <Form onSubmit={this.handleSubmit} size="large">
            <Segment stacked>
              <Form.Input
                fluid
                name="email"
                icon="mail"
                iconPosition="left"
                placeholder="Email address"
                value={email}
                onChange={this.handleChange}
                text="email"
                error={errors.email}
              />
              {errors.email && (
                <p
                  style={{
                    color: "red",
                    fontSize: 20
                  }}
                >
                  {errors.email}
                </p>
              )}
              <Form.Input
                fluid
                name="password"
                icon="lock"
                iconPosition="left"
                placeholder="Password"
                value={password}
                onChange={this.handleChange}
                type="password"
                error={errors.password}
              />
              {errors.password && (
                <p
                  style={{
                    color: "red",
                    fontSize: 20
                  }}
                >
                  {errors.password}
                </p>
              )}

              <Button
                disabled={loading}
                className={loading ? "loading" : ""}
                color="violet"
                size="large"
                fluid
              >
                Submit
              </Button>
            </Segment>
          </Form>
          {errors.err && <Message error>{errors.err}</Message>}
          <Message>
            Don't have an Account ? <Link to="/register"> Register</Link>
          </Message>
        </Grid.Column>
      </Grid>
    );
  }
}

export default Login;
