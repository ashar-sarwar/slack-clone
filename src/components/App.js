import React, { Component } from "react";
import { Grid } from "semantic-ui-react";
import ColorPanel from "./ColorPanel/ColorPanel";
import SidePanel from "./SidePanel/SidePanel";
import Messages from "./Messages/Messages";
import MetaPanel from "./MetaPanel/MetaPanel";
import { connect } from "react-redux";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { user, currentChannel, isPrivateChannel, userPosts } = this.props;
    return (
      <Grid columns="equal" style={{ background: "#eee" }}>
        <ColorPanel />
        <SidePanel key={user && user.uid} current_user={user} />

        <Grid.Column style={{ marginLeft: 320 }}>
          <Messages
            key={currentChannel && currentChannel.id}
            currentChannel={currentChannel}
            currentUser={user}
            isPrivateChannel={isPrivateChannel}
          />
        </Grid.Column>

        <Grid.Column width={4}>
          <MetaPanel
            key={currentChannel && currentChannel.id}
            userPosts={userPosts}
            currentChannel={currentChannel}
            isPrivateChannel={isPrivateChannel}
          />
        </Grid.Column>
      </Grid>
    );
  }
}
const mapStateToProps = state => ({
  user: state.user.current_user,
  currentChannel: state.channel.currentChannel,
  isPrivateChannel: state.channel.isPrivateChannel,
  userPosts: state.channel.userPosts
});
export default connect(mapStateToProps)(App);
