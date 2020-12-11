import React, { cloneElement } from "react";
import {
  ExtPanel,
  ExtChipview,
  ExtContainer,
  ExtCombobox,
  ExtButton,
} from "@sencha/ext-react-modern";

class Keyword extends React.Component {
  model = {
    data: [
      {
        keywordKey: "abc",
      },
      {
        keywordKey: "bcd",
      },
      {
        keywordKey: "cde",
      },
    ],
  };
  collapse = true;
  SUFFIX = " (New Keyword)";

  comboxModel = {
    data: [
      {
        keywordKey: "A1fadfdsf",
      },
      {
        keywordKey: "B1dddaaa",
      },
      {
        keywordKey: "C1sfsadfsf",
      },
      {
        keywordKey: "D1zzxcvxcv",
      },
      {
        keywordKey: "E1kjhkhj",
      },
      {
        keywordKey: "F1dafsdf",
      },
    ],
  };

  store1 = new Ext.data.Store(this.model);
  store2 = new Ext.data.Store(this.model);

  comboxStore = new Ext.data.Store({ data: [] });

  render() {
    return (
      <ExtContainer layout="vbox" padding={10}>
        <ExtChipview
          id="chip1"
          store={this.store1}
          displayField={"keywordKey"}
          closeHandler={(chipview, location) => {
            chipview.store.remove(location.record);

            // Stop the event, otherwise the NavigationModel
            // will try to click on the nonexistent Chip
            return false;
          }}
        />
        <ExtChipview
          id="chip2"
          store={this.store2}
          displayField={"keywordKey"}
          closeHandler={(chipview, location) => {
            chipview.store.remove(location.record);

            // Stop the event, otherwise the NavigationModel
            // will try to click on the nonexistent Chip
            return false;
          }}
        />

        <ExtButton
          text="update chipview"
          handler={() => {
            const query = this.store1.query("keywordKey", "b", true);
            const record = this.store1.findRecord("keywordKey", "b", 0, true);
            console.log(query);
            console.log(record);
            this.store2.setRecords(record);
          }}
        ></ExtButton>
        <ExtButton
          text="set chipview"
          handler={() => {
            this.store2.setData([
              {
                keywordKey: "11",
              },
              {
                keywordKey: "22",
              },
              {
                keywordKey: "33",
              },
            ]);
          }}
        ></ExtButton>

        <ExtCombobox
          width={"100%"}
          label="State"
          store={this.comboxStore}
          displayField="keywordKey"
          queryMode="local"
          labelAlign="placeholder"
          anyMatch
          //   queryDelay={1000}
          ref={(myCombox) => {
            this.myCombox = myCombox.cmp;
          }}
          onCollapse={(event) => {
            console.log("Collapse", event);
            const value = event.field._inputValue;

            // 后缀无需加入，去除后缀
            if (value && value.indexOf(this.SUFFIX) > -1) {
              console.log("kkkkk", value.replace(this.SUFFIX, ""));
              //   this.myCombox.setValue(value.replace(this.SUFFIX, ""));
              this.myCombox.inputElement.dom.value = value.replace(
                this.SUFFIX,
                ""
              );
            } else {
              // this.myCombox.setValue(newValue);
            }
          }}
          onChange={(event) => {
            console.log("onChange...", event);
            const newValue = event.newValue;
            if (newValue.trim().length > 4) {
              this.comboxStore.setData(this.comboxModel.data);

              let newData = this.comboxStore
                .getData()
                .items.map((item) => item.data);
              console.log(newData);
              newData = newData.slice(0, 5);

              newData.push({
                keywordKey: `${newValue}${this.SUFFIX}`, // onChange
              });
              this.comboxStore.setData(newData);
            }
          }}
        />
        <ExtButton
          text="update combox"
          handler={() => {
            // this.comboxStore.setData([
            //   {
            //     keywordKey: "new A1",
            //     comboxValue: "new VA1",
            //   },
            //   {
            //     keywordKey: "new B1",
            //     comboxValue: "new VB1",
            //   },
            //   {
            //     keywordKey: "new C1",
            //     comboxValue: "new VC1",
            //   },
            // ]);
          }}
        ></ExtButton>
      </ExtContainer>
    );
  }
}

export default Keyword;
