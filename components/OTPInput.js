import React, { Component } from "react";
import OtpInput from "react-otp-input-rc-17";
import styles from "./otp.module.scss";

export default class App extends Component {
  state = { otp: "" };
  // state = this.props.state;
  // setState = this.props.setState;

  handleChange = (otp) => this.setState({ otp });
  //   handleChange = (otp) => this.setState({ otp );

  render() {
    return (
      <OtpInput
        value={this.state.otp}
        onChange={this.handleChange}
        containerStyle={styles.otp}
        inputStyle={styles.input}
        // errorStyle={styles.error}
        // hasErrored={this.props.checkLength(this.state)}
      />
    );
  }
}
