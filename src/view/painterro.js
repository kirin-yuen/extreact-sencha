import React from "react";
import { ExtButton } from "@sencha/ext-react-modern";
import Painterro from "painterro";

class MyPainterro extends React.Component {
  constructor() {
    super();
  }

  show = () => {
    Painterro().show();
  };

  render() {
    return (
      <div>
        <ExtButton
          text="Open image editor"
          ui="action round"
          handler={this.show}
        ></ExtButton>
      </div>
    );
  }
}

export default MyPainterro;
