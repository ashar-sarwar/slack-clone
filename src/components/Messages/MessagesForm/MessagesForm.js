import React, { Component } from "react";
import { Header, Segment, Input, Icon, Button } from "semantic-ui-react";
import uuidv4 from "uuid/v4";
import "./MessagesForm.css";
import firebase from "./../../../firebase";
import FileModal from "./../FileModal/FileModal";
import ProgressBar from "../../Commons/ProgressBar";

class MessagesForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      storageRef: firebase.storage().ref(),
      uploadTask: null,
      uploadState: "",
      percentUploaded: 0,
      message: "",
      channel: this.props.currentChannel,
      user: this.props.currentUser,
      loading: false,
      errors: [],
      modal: false
    };
  }

  componentWillUnmount() {
    if (this.state.uploadTask !== null) {
      this.state.uploadTask.cancel();
      this.setState({ uploadTask: null });
    }
  }

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
    console.log(this.state.message);
  };

  setValue = key => {
    this.setState(key);
  };

  createMessage = (fileURL = null) => {
    const message = {
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      user: {
        id: this.state.user.uid,
        name: this.state.user.displayName,
        avatar: this.state.user.photoURL
      }
    };
    if (fileURL !== null) {
      message["image"] = fileURL;
    } else {
      message["content"] = this.state.message;
    }
    return message;
  };
  sendMessage = () => {
    const { getMessagesRef } = this.props;
    const { message, channel } = this.state;

    if (message) {
      this.setState({ loading: true });
      getMessagesRef()
        .child(channel.id)
        .push()
        .set(this.createMessage())
        .then(() => {
          this.setState({ loading: false, message: "", errors: [] });
        })
        .catch(err => {
          this.setState({
            loading: false,
            errors: this.state.errors.concat(err)
          });
        });
    } else {
      this.setState({
        errors: this.state.errors.concat({ message: "Add a message" })
      });
    }
  };

  getPath = () => {
    if (this.props.isPrivateChannel) {
      return `chat/private/-${this.state.channel.id}`;
    } else {
      return `chat/public`;
    }
  };

  uploadFile = (file, metaData) => {
    const pathToUpload = this.state.channel.id;
    const ref = this.props.getMessagesRef();
    const filePath = `${this.getPath()}/${uuidv4()}.jpg`;

    this.setState(
      {
        uploadState: "uploading",
        uploadTask: this.state.storageRef.child(filePath).put(file, metaData)
      },
      () => {
        this.state.uploadTask.on(
          "state_changed",
          snap => {
            const percentUploaded = Math.round(
              (snap.bytesTransferred / snap.totalBytes) * 100
            );
            this.setState({ percentUploaded });
          },

          err => {
            console.log("ERR", err);

            this.setState({
              errors: this.state.errors.concat(err),
              uploadState: "error",
              uploadTask: null
            });
          },
          () => {
            this.state.uploadTask.snapshot.ref

              .getDownloadURL()
              .then(downloadURL => {
                this.sendFileMessage(downloadURL, ref, pathToUpload);
              })
              .catch(err => {
                this.setState({
                  errors: this.state.errors.concat(err),
                  uploadState: "error",
                  uploadTask: null
                });
              });
          }
        );
      }
    );
  };

  sendFileMessage = (fileURL, ref, pathToUpload) => {
    ref
      .child(pathToUpload)
      .push()
      .set(this.createMessage(fileURL))
      .then(() => {
        this.setState({ uploadFile: "done" });
      })
      .catch(err => {
        this.setState({ errors: this.state.errors.concat(err) });
      });
  };

  render() {
    const {
      errors,
      message,
      loading,
      modal,
      uploadState,
      percentUploaded
    } = this.state;
    return (
      <Segment className="messages_form">
        <Input
          fluid
          name="message"
          onChange={this.handleChange}
          value={message}
          style={{ marginBottom: "0.7em" }}
          label={<Button icon={"add"} />}
          labelPosition="left"
          className={
            errors.some(error => error.message.includes("message"))
              ? "error"
              : ""
          }
          placeholder="Write your message"
        />
        <Button.Group icon widths="2">
          <Button
            onClick={this.sendMessage}
            disabled={loading}
            color="orange"
            content="Add Reply"
            labelPosition="left"
            icon="edit"
          />
          <Button
            color="teal"
            disabled={uploadState === "uploading"}
            onClick={() => this.setValue({ modal: true })}
            content="Upload Media"
            labelPosition="right"
            icon="cloud upload"
          />
        </Button.Group>
        <FileModal
          modal={modal}
          setValue={key => this.setValue(key)}
          uploadFile={this.uploadFile}
        />
        <ProgressBar
          uploadState={uploadState}
          percentUploaded={percentUploaded}
        />
      </Segment>
    );
  }
}

export default MessagesForm;
