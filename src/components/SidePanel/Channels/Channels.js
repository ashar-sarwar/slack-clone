import React, { Component } from "react";
import {
  Menu,
  Icon,
  Modal,
  Form,
  Input,
  Button,
  Message,
  Label
} from "semantic-ui-react";
import _ from "lodash";
import { connect } from "react-redux";
import firebase from "./../../../firebase";
import {
  setCurrentChannel,
  setPrivateChannel
} from "./../../../actions/channelActions";

class Channels extends Component {
  constructor(props) {
    super(props);
    this.state = {
      channels: [],
      modal: false,
      channelName: "",
      channelDetails: "",
      activeChannel: "",
      channelsRef: firebase.database().ref("channels"),
      messagesRef: firebase.database().ref("messages"),
      notifications: [],
      firstLoad: true,
      errors: {}
    };
  }

  componentDidMount() {
    this.addListeners();
  }
  componentWillUnmount() {
    this.removeListeners();
  }

  addListeners = () => {
    let loadedChannels = [];
    this.state.channelsRef.on("child_added", snap => {
      loadedChannels.push(snap.val());
      this.setState({ channels: loadedChannels }, () => {
        this.setFirstChannel();
      });
      this.addNotificationListener(snap.key);
    });
  };

  addNotificationListener = channelId => {
    this.state.messagesRef.child(channelId).on("value", snap => {
      if (this.state.channel) {
        this.handleNotifications(
          channelId,
          this.state.channel.id,
          this.state.notifications,
          snap
        );
      }
    });
  };

  handleNotifications = (channelId, currentChannelId, notifications, snap) => {
    let lastTotal = 0;

    let index = notifications.findIndex(
      notification => notification.id === channelId
    );

    if (index !== -1) {
      if (channelId !== currentChannelId) {
        lastTotal = notifications[index].total;
        if (snap.numChildren() - lastTotal > 0) {
          notifications[index].count = snap.numChildren() - lastTotal;
        }
      }
      notifications[index].lastKnownTotal = snap.numChildren();
    } else {
      notifications.push({
        id: channelId,
        total: snap.numChildren(),
        lastKnownTotal: snap.numChildren(),
        count: 0
      });
    }

    this.setState({ notifications });
  };

  removeListeners = () => {
    this.state.channelsRef.off();
    this.state.channels.forEach(channel => {
      this.state.messagesRef.child(channel.id).off();
    });
  };

  openModal = () => {
    this.setState({ modal: true });
  };
  closeModal = () => {
    this.setState({ modal: false });
  };
  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  addChannel = () => {
    const { channelsRef, channelName, channelDetails } = this.state;
    const { current_user } = this.props;
    const key = channelsRef.push().key;

    const newChannel = {
      id: key,
      name: channelName,
      details: channelDetails,
      createdBy: {
        name: current_user.displayName,
        avatar: current_user.photoURL
      }
    };

    channelsRef
      .child(key)
      .update(newChannel)
      .then(() => {
        this.setState({ channelName: "", channelDetails: "", modal: false });
      })
      .catch(err => {
        let formError = {};
        formError.err = err.message;
        this.setState({ errors: formError });
      });
  };

  clearNotifications = () => {
    let index = this.state.notifications.findIndex(
      notification => notification
    );

    let updatedNotifications = [...this.state.notifications];
    updatedNotifications[index].total = this.state.notifications[
      index
    ].lastKnownTotal;
    updatedNotifications[index].count = 0;

    this.setState({ notifications: updatedNotifications });
  };

  getNotificationCount = channel => {
    let count = 0;

    this.state.notifications.forEach(notification => {
      if (notification.id === channel.id) {
        count = notification.count;
      }
    });

    if (count > 0) return count;
  };

  changeChannel = channel => {
    this.setActiveChannel(channel);
    this.clearNotifications();
    this.props.setCurrentChannel(channel);
    this.props.setPrivateChannel(false);
    this.setState({ channel });
  };

  setActiveChannel = channel => {
    this.setState({ activeChannel: channel.id });
  };

  setFirstChannel = () => {
    const { firstLoad, channels } = this.state;
    const firstChannel = channels[0];
    if (firstLoad && channels.length > 0) {
      this.props.setCurrentChannel(firstChannel);
      this.setActiveChannel(firstChannel);
      this.setState({ channel: firstChannel });
    }
    this.setState({ firstLoad: false });
  };

  displayChannels = channels =>
    channels.length > 0 &&
    channels.map(channel => (
      <Menu.Item
        key={channel.id}
        onClick={() => this.changeChannel(channel)}
        name={channel.name}
        style={{ color: "#b3aead", opacity: 0.7 }}
        active={channel.id === this.state.activeChannel}
      >
        {this.getNotificationCount(channel) && (
          <Label color="red">{this.getNotificationCount(channel)}</Label>
        )}
        # {channel.name}
      </Menu.Item>
    ));

  handleSubmit = e => {
    e.preventDefault();
    if (this.validation()) {
      this.addChannel();
    }
  };

  validation = () => {
    const { channelName } = this.state;

    let formErrors = {};

    if (_.isEmpty(channelName)) {
      formErrors.channelName = "Channel Name cannot be empty";
    }

    this.setState({ errors: !_.isEmpty(formErrors) ? formErrors : {} });

    if (_.isEmpty(formErrors)) {
      return true;
    } else {
      return false;
    }
  };

  render() {
    const { channels, channelName, channelDetails, modal, errors } = this.state;
    return (
      <div>
        <Menu.Menu className="menu">
          <Menu.Item style={{ color: "#b3aead" }}>
            <span>
              <Icon name="exchange" />
              CHANNELS
            </span>
            ({channels.length})<Icon name="add" onClick={this.openModal} />
          </Menu.Item>
          {this.displayChannels(channels)}
        </Menu.Menu>
        <Modal basic open={modal} onClose={this.closeModal}>
          <Modal.Header>Add a Channel</Modal.Header>
          <Modal.Content>
            <Form>
              <Form.Field>
                <Input
                  label="Name of Channel"
                  name="channelName"
                  value={channelName}
                  onChange={this.handleChange}
                  error={errors.channelName}
                />
                {errors.channelName && (
                  <p
                    style={{
                      color: "red",
                      fontSize: 20
                    }}
                  >
                    {errors.channelName}
                  </p>
                )}
              </Form.Field>
              <Form.Field>
                <Input
                  label="About the Channel"
                  name="channelDetails"
                  value={channelDetails}
                  onChange={this.handleChange}
                />
              </Form.Field>
            </Form>
          </Modal.Content>

          {errors.err && <Message error>{errors.err}</Message>}
          <Modal.Actions>
            <Button color="green" onClick={this.handleSubmit}>
              <Icon name="checkmark" />
              Add
            </Button>
            <Button color="red" onClick={this.closeModal}>
              <Icon name="remove" />
              Cancel
            </Button>
          </Modal.Actions>
        </Modal>
      </div>
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
)(Channels);
