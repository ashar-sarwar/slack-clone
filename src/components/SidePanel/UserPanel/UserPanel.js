import React, { Component } from "react";
import { Grid, Header, Icon, Dropdown, Image } from "semantic-ui-react";
import firebase from "./../../../firebase";
import { connect } from "react-redux";

class UserPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  dropdownOptions = () => [
    {
      key: "user",
      text: (
        <span>
          Sign in as{" "}
          {this.props.current_user && this.props.current_user.displayName}
        </span>
      ),
      disabled: true
    },
    { key: "avatar", text: <span>Change Avatar</span> },
    { key: "signout", text: <span onClick={this.handleSignOut}>Sign Out</span> }
  ];

  handleSignOut = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {})
      .catch();
  };

  render() {
    const { current_user } = this.props;
    return (
      <Grid style={{ background: "4c3c4c" }}>
        <Grid.Column>
          <Grid.Row style={{ padding: "1.2rem", margin: 0 }}>
            <Header style={{ color: "white" }} floated="left" as="h2">
              <Icon name="code" />
              <Header.Content>Dev Chat </Header.Content>
            </Header>
            <Header style={{ color: "white", padding: "0.25rem" }} as="h4">
              <Dropdown
                trigger={
                  <span>
                    <Image src={current_user.photoURL} spaced="right" avatar />
                    {current_user.displayName}
                  </span>
                }
                options={this.dropdownOptions()}
              />
            </Header>
          </Grid.Row>
        </Grid.Column>
      </Grid>
    );
  }
}

const actions = {};

export default connect(
  null,
  actions
)(UserPanel);
