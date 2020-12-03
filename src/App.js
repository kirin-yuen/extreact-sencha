import React, { Component } from "react";
import SearchItem from "./view/search";

class App extends Component {
  constructor() {
    super();
  }

  state = {
    result: "",
  };

  itemList = ["Chocolate", "Coconut", "Mint", "Strawberry", "Vanilla"];

  componentDidMount = () => {};

  searchItemList = (searchInput) => {
    console.log(searchInput);

    if (searchInput === "Chocolate") {
      this.itemList = ["gogogo"];
    }
  };

  searchResult = (searchInput) => {
    console.log(searchInput);
    this.setState({
      result: searchInput,
    });
  };

  render() {
    return (
      <div>
        {this.state.result}

        <SearchItem parent={this} itemList={this.itemList}></SearchItem>
      </div>
    );
  }
}
export default App;
