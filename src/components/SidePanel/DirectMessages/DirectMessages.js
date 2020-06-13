import React, { Component } from "react";
import { Menu, Icon } from "semantic-ui-react";
import { connect } from "react-redux";
import firebase from "./../../../firebase";
import {
  setCurrentChannel,
  setPrivateChannel
} from "./../../../actions/channelActions";

class DirectMessages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeChannel: "",
      users: [],
      user: this.props.current_user,
      userRef: firebase.database().ref("users"),
      connectedRef: firebase.database().ref(".info/connected"),
      presenceRef: firebase.database().ref("presence")
    };
  }

  componentDidMount() {
    if (this.state.user) {
      this.addListeners(this.state.user.uid);
    }
  }

  componentWillUnmount() {
    this.removeListeners();
  }

  removeListeners = () => {
    this.state.userRef.off();
    this.state.presenceRef.off();
    this.state.connectedRef.off();
  };

  isUserOnline = user => {
    return user.status === "online";
  };

  changeChannel = user => {
    const channelId = this.getChannelId(user.uid);

    const channelData = {
      id: channelId,
      name: user.name
    };
    this.props.setCurrentChannel(channelData);
    this.props.setPrivateChannel(true);
    this.setActiveChannel(user.uid);
  };

  setActiveChannel = id => {
    this.setState({ activeChannel: id });
  };

  getChannelId = userId => {
    const currentUserId = this.state.user.uid;

    return userId < currentUserId
      ? `${userId}/${currentUserId}`
      : `${currentUserId}/${userId}`;
  };

  addListeners = id => {
    let loadedUsers = [];
    this.state.userRef.on("child_added", snap => {
      if (id !== snap.key) {
        let user = snap.val();
        user["uid"] = snap.key;
        user["status"] = "offline";
        loadedUsers.push(user);

        this.setState({ users: loadedUsers });
      }
    });
    this.state.connectedRef.on("value", snap => {
      if (snap.val() === true) {
        const ref = this.state.presenceRef.child(id);
        ref.set(true);
        ref.onDisconnect().remove(err => {
          if (err !== null) {
            console.error(err);
          }
        });
      }
    });
    this.state.presenceRef.on("child_added", snap => {
      if (id !== snap.key) {
        this.addStatusToUser(snap.key);
      }
    });
    this.state.presenceRef.on("child_removed", snap => {
      if (id !== snap.key) {
        this.addStatusToUser(snap.key, false);
      }
    });
  };

  addStatusToUser = (id, connected = true) => {
    const updatedUsers = this.state.users.reduce((acc, user) => {
      if (user.uid === id) {
        user["status"] = `${connected ? "online" : "offline"}`;
      }
      return acc.concat(user);
    }, []);
    this.setState({ users: updatedUsers });
  };

  render() {
    const { users, activeChannel } = this.state;
    return (
      <Menu.Menu className="menu">
        <Menu.Item>
          <span>
            <Icon name="mail" />
          </span>{" "}
          ({users.length})
        </Menu.Item>
        {users.map(user => (
          <Menu.Item
            key={user.uid}
            active={user.uid === activeChannel}
            onClick={() => this.changeChannel(user)}
            style={{ opacity: 0.7, fontStyle: "italic" }}
          >
            <Icon
              name="circle"
              color={this.isUserOnline(user) ? "green" : "red"}
            />
            @{user.name}
          </Menu.Item>
        ))}
      </Menu.Menu>
    );
  }
}

const actions = {
  setCurrentChannel,
  setPrivateChannel
};

export default connect(
  null,
  actions
)(DirectMessages);
