import React, { cloneElement } from "react";
import {
  ExtChipview,
  ExtContainer,
  ExtCombobox,
  ExtButton,
} from "@sencha/ext-react-modern";

class Keyword extends React.Component {
  chipviewModel = {
    data: [
      {
        chipKeywordKey: "Thor",
      },
      {
        chipKeywordKey: "Caption America",
      },
      {
        chipKeywordKey: "Iron man",
      },
      {
        chipKeywordKey: "Son Goku",
      },
      {
        chipKeywordKey: "Son Gohan",
      },
    ],
  };

  maxChip = 7; // 最大标签数
  showNumber = 5; // 列表显示条数，不包含输入时自动加入新记录
  loadDataLength = 3; // 输入字符长度达到后开始加载数据
  SUFFIX = "(New Keyword)"; // 输入新增记录的后缀

  comboxModel = {
    data: [
      {
        comboxKeywordKey: "Thor",
      },
      {
        comboxKeywordKey: "Caption America",
      },
      {
        comboxKeywordKey: "Iron man",
      },
      {
        comboxKeywordKey: "Son Goku",
      },
      {
        comboxKeywordKey: "Son Gohan",
      },
    ],
  };

  /**
   * 将 store 里的数据转为 js 方便操作的数组
   * @param {Object} store 待转换的 store 对象
   * @return {Array} 转换成功数组
   */
  storeToArray(store) {
    return store && store.getData().items.map((item) => item.data);
  }

  /**
   * 查重复
   * @param {String} content 字符串 content 在 数组中是否存在
   * @return {Boolean} 是否重复
   */
  noDuplicate = (content) => {
    return !this.storeToArray(this.store2).some(
      (item) => item.chipKeywordKey === content
    );
  };

  store1 = new Ext.data.Store(this.chipviewModel);
  store2 = new Ext.data.Store(this.chipviewModel);

  comboxStore = new Ext.data.Store(this.comboxModel);

  componentDidMount() {
    // 检测 store 变化
    this.store2.onEndUpdate = (e) => {
      if (this.store2.count() >= this.maxChip) {
        this.myCombox.clearValue();
        this.myCombox.setDisabled(true);
      } else {
        this.myCombox.setDisabled(false);
      }
    };
  }

  render() {
    return (
      <ExtContainer layout="vbox">
        <ExtChipview
          draggable
          style={{ background: "yellowgreen" }}
          padding={10}
          store={this.store1}
          displayField={"chipKeywordKey"}
          closeHandler={(chipview, location) => {
            chipview.store.remove(location.record);

            // Stop the event, otherwise the NavigationModel
            // will try to click on the nonexistent Chip
            return false;
          }}
        />
        <ExtChipview
          style={{ background: "pink" }}
          padding={10}
          store={this.store2}
          displayField={"chipKeywordKey"}
          ripple={false}
          closeHandler={(chipview, location) => {
            chipview.store.remove(location.record);

            // Stop the event, otherwise the NavigationModel
            // will try to click on the nonexistent Chip
            return false;
          }}
        />

        <ExtCombobox
          collapseOnSelect={false}
          width={"100%"}
          store={this.comboxStore}
          displayField="comboxKeywordKey"
          queryMode="local"
          anyMatch
          clearable
          maxLength={30}
          ref={(myCombox) => {
            this.myCombox = myCombox.cmp;
          }}
          focusable
          // 选项模板
          itemTpl={"<div>{comboxKeywordKey} {suffix}</div>"}
          onBlur={() => {
            console.log("onBlur", this.canAdd);
            this.canAdd = false;
          }}
          onFocus={() => {
            console.log("focus", this.canAdd);
            this.canAdd = false;
          }}
          doKeyDown={() => {
            window.scrollTo(0, 100);
            console.log(11);
          }}
          // 下拉菜单关闭
          onCollapse={() => {
            console.log("onCollapse", this.canAdd);
            this.canAdd = true;
          }}
          // 该事件当输入和选中下拉项都会触发，因此要作加入 this.canAdd 作为区分判断
          onSelect={(event) => {
            // 不同交互下 onCollapse 和 onSelect 触发顺序不一样，因此需要使用 setTimeout
            window.setTimeout(() => {
              console.log("onSelect", this.canAdd);

              const { comboxKeywordKey } = event.newValue.data;

              if (this.canAdd && this.noDuplicate(comboxKeywordKey)) {
                this.store2.add({
                  chipKeywordKey: comboxKeywordKey,
                });
                this.myCombox.setValue(comboxKeywordKey);
              }
              this.canAdd = false;
            }, 20);
          }}
          doKeyDown={(event) => {
            window.setTimeout(() => {
              const trimInput = event._value.trim();

              console.log("onchange", trimInput);
              if (trimInput.length) {
                // 输入字符超过 loadDataLength 开始加载数据
                if (trimInput.length > this.loadDataLength) {
                  this.comboxStore.setData(this.comboxModel.data); // 加载数据
                }

                // 获取 store 里的数据，转换成数组
                let newData = this.storeToArray(this.comboxStore);

                // 只显示 showNumber 条加一条新记录
                newData = newData.slice(0, this.showNumber);

                if (this.noDuplicate(trimInput)) {
                  newData.push({
                    comboxKeywordKey: trimInput,
                    suffix: this.SUFFIX,
                  });
                }

                this.comboxStore.setData(newData);
              }
              // trimInput 有值则代表输入触发该事件，空值则代表没有点击下拉选择项
              if (trimInput) {
                this.canAdd = false;
              }
            }, 10);
          }}
        />
        <ExtButton
          text="save all keyword"
          handler={() => {
            const query = this.store2.query("chipKeywordKey", "", true);
            this.store1.setRecords(query.items);
          }}
        ></ExtButton>
      </ExtContainer>
    );
  }
}

export default Keyword;
