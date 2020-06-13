import React, { Component } from "react";
import { Menu } from "semantic-ui-react";
import UserPanel from "./UserPanel/UserPanel";
import Channels from "./Channels/Channels";
import DirectMessages from "./DirectMessages/DirectMessages";
import Starred from "./Starred/Starred";

class SidePanel extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { current_user } = this.props;
    return (
      <Menu
        size="large"
        fixed="left"
        vertical
        style={{ background: "#4c3c4c", fontSize: "1.2rem" }}
      >
        <UserPanel current_user={current_user} />
        <Starred current_user={current_user} />
        <Channels current_user={current_user} />
        <DirectMessages current_user={current_user} />
      </Menu>
    );
  }
}

export default SidePanel;
