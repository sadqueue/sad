import React, { Component } from "react";

// CopyButton as a class-based component
class CopyButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isHovered: false,
      isCopied: false,
    };
  }

  handleCopy = () => {
    const { textToCopy } = this.props;
    navigator.clipboard.writeText(textToCopy).then(() => {
      this.setState({ isCopied: true });
      setTimeout(() => {
        this.setState({ isCopied: false });
      }, 2000); // Reset after 2 seconds
    });
  };

  handleMouseEnter = () => {
    this.setState({ isHovered: true });
  };

  handleMouseLeave = () => {
    this.setState({ isHovered: false });
  };

  render() {
    const { isHovered, isCopied } = this.state;

    return (
      <button
        onClick={this.handleCopy}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        style={{
          backgroundColor: isHovered ? "#4CAF50" : "#008CBA",
          color: "#fff",
          border: "none",
          padding: "10px 20px",
          cursor: "pointer",
          borderRadius: "5px",
          transition: "background-color 0.3s ease",
        }}
      >
        {isCopied ? "Copied!" : "Copy"}
      </button>
    );
  }
}

export default CopyButton; // Export the CopyButton component
