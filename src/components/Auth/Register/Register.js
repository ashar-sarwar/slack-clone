import React, { Component } from "react";
import md5 from "md5";
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
import "./Register.css";
import firebase from "./../../../firebase";
import Util from "../../../Util";
import _ from "lodash";
class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      errors: {},
      loading: false,
      userRef: firebase.database().ref("users")
    };
  }

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  validation = () => {
    this.setState({ errors: {}, loading: true });
    const { name, email, password, confirmPassword, errors } = this.state;

    let formErrors = {};

    if (!Util.isValidName(name)) {
      formErrors.name = "name is invalid";
    }

    if (!Util.isEmailValid(email)) {
      formErrors.email = "email is invalid";
    }

    if (!Util.isPasswordValid(password)) {
      formErrors.password = "password is invalid";
    }

    if (_.isEmpty(name)) {
      formErrors.name = "Name is req";
    }
    if (_.isEmpty(email)) {
      formErrors.email = "email is req";
    }

    if (_.isEmpty(password)) {
      formErrors.password = "password is req";
    }
    if (confirmPassword !== password) {
      formErrors.confirmPassword = "Password does not match";
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
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(result => {
        console.log(result);
        result.user
          .updateProfile({
            displayName: this.state.name,
            photoURL: `http://gravatar.com/avatar/${md5(
              result.user.email
            )}?d=identicon`
          })
          .then(() => {
            this.saveUser(result).then(() => {
              console.log("user saved");
            });
            this.setState({ loading: false });
          })
          .catch(err => {
            let formError = {};
            formError.err = err.message;
            this.setState({ errors: formError, loading: false });
          });
      })
      .catch(err => {
        console.log(err);
        let formError = {};
        formError.err = err.message;
        this.setState({ errors: formError, loading: false });
      });
  };

  saveUser = createdUser => {
    return this.state.userRef.child(createdUser.user.uid).set({
      name: createdUser.user.displayName,
      avatar: createdUser.user.photoURL
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
      <Grid textAlign="center" verticalAlign="middle" className="register">
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h2" icon color="orange" textAlign="center">
            <Icon name="puzzle place" color="orange" />
            Register for Connecting
          </Header>
          <Form onSubmit={this.handleSubmit} size="large">
            <Segment stacked>
              <Form.Input
                fluid
                name="name"
                icon="user"
                iconPosition="left"
                placeholder="name"
                value={name}
                onChange={this.handleChange}
                type="text"
                error={errors.name}
              />
              {errors.name && (
                <p
                  style={{
                    color: "red",
                    fontSize: 20
                  }}
                >
                  {errors.name}
                </p>
              )}
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
              <Form.Input
                fluid
                name="confirmPassword"
                icon="lock"
                iconPosition="left"
                placeholder="Password Confirmation"
                value={confirmPassword}
                onChange={this.handleChange}
                type="password"
              />
              {errors.confirmPassword && (
                <p
                  style={{
                    color: "red",
                    fontSize: 20
                  }}
                >
                  {errors.confirmPassword}
                </p>
              )}
              <Button
                disabled={loading}
                className={loading ? "loading" : ""}
                color="orange"
                size="large"
                fluid
              >
                Submit
              </Button>
            </Segment>
          </Form>
          {errors.err && <Message error>{errors.err}</Message>}
          <Message>
            Already a User?<Link to="/login">Login</Link>
          </Message>
        </Grid.Column>
      </Grid>
    );
  }
}

export default Register;
