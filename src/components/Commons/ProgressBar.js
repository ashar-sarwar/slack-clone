import React, { Component } from "react";
import { Progress } from "semantic-ui-react";
import "./Commons.css";

const ProgressBar = ({ uploadState, percentUploaded }) => {
  console.log("STATE", uploadState);
  return (
    uploadState == "uploading" && (
      <Progress
        className="progress_bar"
        percent={percentUploaded}
        progress
        indicating
        size="medium"
        inverted
      />
    )
  );
};

export default ProgressBar;
