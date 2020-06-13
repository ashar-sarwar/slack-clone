import React, { Component } from "react";
import mime from "mime-types";
import { Modal, Input, Button, Icon } from "semantic-ui-react";

class FileModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null,
      authorized: ["image/jpeg", "image/png"]
    };
  }

  addFile = e => {
    const file = e.target.files[0];
    if (file) {
      this.setState({ file });
    }
  };

  sendFile = () => {
    const { file } = this.state;
    const { uploadFile, setValue } = this.props;
    if (file !== null) {
      if (this.isAuthorized(file.name)) {
        const metaData = { contentType: mime.lookup(file.name) };
        console.log("HELLLLLLLLo");
        uploadFile(file, metaData);
        setValue({ modal: false });
        this.clearFile();
      }
    }
  };

  clearFile = () => {
    this.setState({ file: null });
  };

  isAuthorized = fileName => {
    console.log("fileNAME", mime.lookup(fileName));
    return this.state.authorized.includes(mime.lookup(fileName));
  };

  render() {
    const { modal, setValue } = this.props;
    return (
      <Modal basic open={modal} onClose={() => setValue({ modal: false })}>
        <Modal.Header>Select an Image File</Modal.Header>
        <Modal.Content>
          <Input
            onChange={this.addFile}
            fluid
            label="file types:jpg,png"
            name="file"
            type="file"
          />
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={this.sendFile} color="green">
            <Icon name="checkmark" />
            Send
          </Button>
          <Button color="red" onClick={() => setValue({ modal: false })}>
            <Icon name="remove" />
            Cancel
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

export default FileModal;
