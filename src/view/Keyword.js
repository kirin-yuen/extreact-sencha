import React, { cloneElement } from "react";
import {
  ExtPanel,
  ExtChipview,
  ExtContainer,
  ExtCombobox,
  ExtButton,
} from "@sencha/ext-react-modern";

class Keyword extends React.Component {
  isExpand = false;

  SUFFIX = " New Keyword";

  listDataMaxLength = 5;

  listData = [
    { keyName: "1ABC" },
    { keyName: "2BCD" },
    { keyName: "3CDE" },
    { keyName: "4EDF" },
    { keyName: "5FGH" },
  ];

  renderListData() {
    return this.listData.slice(0, this.listDataMaxLength + 1);
  }

  setNewKewword(keyword) {
    const result = { keyName: `${keyword}${this.SUFFIX}` };

    if (this.listData.length >= this.listDataMaxLength) {
      console.log(this.listData);
      this.listData[this.listDataMaxLength] = result;
    } else {
      this.listData[this.listData.length] = result;
    }
  }

  model = {
    data: [
      {
        chipContent: "frederick.bloggs@sentcha.com",
      },
      {
        chipContent: "joe.poe@sentcha.com",
      },
      {
        chipContent: "mike.jones@sentcha.com",
      },
    ],
  };

  state = {
    hi: "",
    store: new Ext.data.Store(this.model),

    tempStore: new Ext.data.Store(this.model),
  };

  render() {
    console.log("render");
    return (
      <ExtContainer layout="vbox">
        <ExtContainer layout="hbox" cls="keyword-grid">
          <ExtContainer flex={4} cls="left"></ExtContainer>
          <ExtContainer flex={2} layout="vbox">
            <ExtContainer flex={2} layout="vbox" cls="keyword-box">
              <ExtContainer>
                <div
                  className="keyword-box-title"
                  onClick={() => {
                    this.modal.cmp.show();
                    this.isExpand = true;
                    console.log(this.isExpand);
                  }}
                >
                  Keyword(s)
                </div>
              </ExtContainer>
              <ExtContainer cls={"keyword-box-body " + "empty"}>
                <ExtChipview
                  id="chip"
                  onChildtap={() => {
                    console.log(300003);
                  }}
                  store={this.state.store}
                  displayField={"chipContent"}
                  closeHandler={(chipview, location) => {
                    this.state.store.remove(location.record);

                    // Stop the event, otherwise the NavigationModel
                    // will try to click on the nonexistent Chip
                    return false;
                  }}
                />
              </ExtContainer>
            </ExtContainer>
            <ExtContainer flex={3} layout="vbox" cls="keyword-box">
              <div className="keyword-box-title">Annotation</div>
            </ExtContainer>
            {/* <div className="left"> </div> */}
          </ExtContainer>
        </ExtContainer>

        <ExtPanel
          ref={(modal) => {
            this.modal = modal;
          }}
          floated
          modal
          centered
          width={600}
          padding={10}
          hideOnMaskTap
        >
          <ExtContainer>
            <ExtChipview
              id="tempChip"
              store={this.state.tempStore}
              displayField={"chipContent"}
              closeHandler={(chipview, location) => {
                this.state.tempStore.remove(location.record);

                // Stop the event, otherwise the NavigationModel
                // will try to click on the nonexistent Chip
                return false;
              }}
            />
            <ExtCombobox
              id="mycombox"
              store={this.renderListData()}
              displayField="keyName"
              valueField="keyName"
              queryMode="local"
              clearable
              typeAhead
              collapseOnSelect
              onCollapse={(event) => {
                console.log(event.field.raw, 222222);
                const value = event.field.getValue() || event.field.rawValue;

                const storeData = this.state.tempStore
                  .getData()
                  .items.map((item) => item.data.chipContent);

                console.log(event.field);

                // 判断是否有值
                if (value) {
                  if (!storeData.includes(value)) {
                    this.state.tempStore.add({
                      chipContent: value,
                    });
                  }
                  // console.log(
                  //   this.state.tempStore.getData(),
                  //   Ext.getCmp("chip").getStore()
                  // );
                }
              }}
              onSelect={(event) => {
                console.log(
                  Ext.getCmp("mycombox")
                    .getOptions()
                );
                console.log(event.newValue.data);
                this.setNewKewword(event.newValue.data.keyName);
                // this.setState({
                //   hi: "3",
                // });
              }}
            />
            <ExtButton
              text="save"
              handler={() => {
                // this.state.store.setData(this.state.tempStore.getData());
                // console.log(this.state.store.getData());
                // Ext.getCmp("chip").refresh();

                // this.modal.cmp.hide();
                this.state.store.load();
                // this.setState({
                //   hi: "22",
                // });
                // this.setState({
                //   store: this.state.tempStore
                // })
                // this.state.store = this.state.tempStore;
              }}
            ></ExtButton>
          </ExtContainer>
        </ExtPanel>
      </ExtContainer>
    );
  }
}

export default Keyword;
