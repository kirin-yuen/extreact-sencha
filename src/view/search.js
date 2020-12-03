import React from "react";
import { ExtSearchfield } from "@sencha/ext-react-modern";

class SearchItem extends React.Component {
  constructor(props) {
    super(props);

    // 父传子参数
    this.searchMaxLength = props.maxLength || 255; // 搜索框最大长度
    this.lengthToShowItemList = props.lengthToShowItemList || 0; // 输入长度大于多才出现列表
    this.parent = props.parent;
    this.itemList = props.itemList || [];
  }

  state = {
    toggleClass: "", // 是否显示里列表
  };

  searchChangeTimer = null;

  inputValue = "";
  chooseItemIndex = "";

  /**
   * 隐藏列表
   */
  hideList = () => {
    this.setState({
      toggleClass: "",
    });
  };

  /**
   * 显示列表
   */
  showList = () => {
    this.setState({
      toggleClass: "show",
    });
  };

  /**
   * 输入时会弹出搜索列表，返回当前输入内容
   * @param {Object} event
   */
  onSearchChange = (event) => {
    console.log(this.searchChangeTimer,22222);
    // 清除定时器
    if (this.searchChangeTimer) {
      clearTimeout(this.searchChangeTimer);
    }
    
    const { newValue } = event;

    const trimInput = newValue.trim();

    // 如输入框第一个字母输入数字，则会重复重发 onChange 事件，因此需要加入额外判断逻辑
    if (this.chooseItemIndex) {
      this.inputValue = trimInput;
    }

    if (trimInput.length > this.lengthToShowItemList) {
      this.searchChangeTimer = setTimeout(() => {
        this.parent.searchItemList(trimInput);

        // 通过 chooseItemIndex 来判断是输入还是选中列表项
        if (!this.chooseItemIndex) {
          this.showList();
        } else {
          this.chooseItemIndex = "";
        }
      }, 500);
      // 选中列表项
    } else {
      this.hideList();
    }
  };

  /**
   * 输入时会弹出搜索列表，返回当前输入内容
   * @param {Object} event
   */
  onItemListClick = (event, index) => {
    this.chooseItemIndex = index + 1;
    this.inputValue = event.target.innerText;
    this.hideList();

    // 选中列表项
    this.parent.searchResult(event.target.innerText);
  };

  render() {
    const { toggleClass } = this.state;

    return (
      <div className="search-list">
        <ExtSearchfield
          width="100%"
          placeholder="Search..."
          value={this.inputValue}
          onChange={this.onSearchChange}
          onBlur={() => {
            window.setTimeout(() => {
              this.hideList();
            }, 1);
          }}
          maxLength={this.searchMaxLength}
        ></ExtSearchfield>

        <ul className={toggleClass}>
          {this.itemList.length ? (
            this.itemList.map((item, index) => {
              return (
                <li
                  key={index}
                  onClick={(event) => {
                    this.onItemListClick(event, index);
                  }}
                >
                  {item}
                </li>
              );
            })
          ) : (
            <li>暂无数据</li>
          )}
        </ul>
      </div>
    );
  }
}

export default SearchItem;
