import React from "react";
import {
  ExtPanel,
  ExtContainer,
  ExtList,
  ExtButton,
} from "@sencha/ext-react-modern";

Ext.require(["Ext.drag.*"]);

const setProxyByItem = function (item) {
  return {
    type: "placeholder",
    cls: "proxy-drag-custom",
    cursorOffset: [0, 0],
    html: item.content,
  };
};

class ListTest extends React.Component {
  store = new Ext.data.Store({
    data: [
      {
        firstName: "Peter",
        lastName: "Venkman",
      },
      {
        firstName: "Raymond",
        lastName: "Stantz",
      },
      {
        firstName: "Egon",
        lastName: "Spengler",
      },
      {
        firstName: "Winston",
        lastName: "Zeddemore",
      },
    ],
  });

  itemList = [
    { content: "1", yTop: null, yBottom: null, id: 1 },
    { content: "2", yTop: null, yBottom: null, id: 2 },
    { content: "3", yTop: null, yBottom: null, id: 3 },
    { content: "4", yTop: null, yBottom: null, id: 4 },
  ];

  componentDidMount() {
    this.initDragItem();
  }

  initDragItem = () => {
    this.sortableList = this.itemList.map((item, index) => {
      const dragSource = new Ext.drag.Source({
        element: this.refs[item.content + index].cmp.el,
        constrain: this.refs.mainPanel.cmp.el,
        // proxy: "original",
        proxy: setProxyByItem(item),
        listeners: {
          dragmove: (source, info) => {
            // debugger
            // console.log(source, info);
          },
          dragend: (object, info) => {
            const dragendY = info.cursor.current.y;

            const dragendItemIndex = this.itemList.findIndex((item) => {
              return dragendY > item.yTop && dragendY < item.yBottom;
            });
            console.log(info);
            // 用 id 找唯一
            const currentItemIndex = this.itemList.findIndex(
              (item) => item.id === info.source.dragId
            );

            console.log(
              "current：" + currentItemIndex,
              "dragend：" + dragendItemIndex
            );

            const currentItem = this.itemList[currentItemIndex];
            this.itemList[currentItemIndex] = undefined;
            this.itemList = this.itemList.filter((item) => item);
            const startIndex = dragendItemIndex === -1 ? 0 : dragendItemIndex;
            this.itemList.splice(startIndex, 0, currentItem);

            this.itemList.forEach((item, index) => {
              item.yTop = this.yMapping[index].yTop;
              item.yBottom = this.yMapping[index].yBottom;

              this.sortableList[index].setProxy(setProxyByItem(item));
              this.sortableList[index].dragId = this.itemList[index].id;
            });
            console.log(this.itemList);
            console.log(this.sortableList);

            this.setState({});
          },
        },
      });

      const { offsetTop, offsetHeight } = dragSource.config.element.dom;
      this.itemList[index].yTop = 100 + offsetTop;
      this.itemList[index].yBottom = 100 + offsetTop + offsetHeight;
      this.itemList[index].id = index + 1;

      dragSource.dragId = index + 1;
      console.log(dragSource);

      this.yMapping = this.itemList.map((item) => {
        return {
          yTop: item.yTop,
          yBottom: item.yBottom,
        };
      });

      return dragSource;
    });
  };

  render() {
    return (
      <ExtPanel ref="mainPanel" width={"30%"} height={700} cls="main-panel">
        {/* <ExtList
          // itemTpl="{firstName} {lastName}"
          itemTpl={
            '<span class="myStyle ' +
            Ext.baseCSSPrefix +
            'list-sortablehandle">' +
            "</span>{firstName}"
          }
          maxHeight={500}
          store={this.store}
          plugins={[
            {
              type: "sortablelist",
            },
          ]}
          infinite
          onChildtouchend={(e) => {
            console.log("onChildtouchend", e);
          }}
        ></ExtList> */}

        {this.itemList.map((item, index) => {
          return (
            <ExtContainer
              key={index}
              style={{ marginBottom: "5px" }}
              ref={item.content + index}
              cls="proxy-placeholder proxy-source"
            >
              <div>
                <span>{item.content}</span>
                <button
                  id={item.id}
                  onClick={(event) => {
                    const startIndex = this.itemList.findIndex(
                      (item) => item.id == event.target.id
                    );

                    if (startIndex > -1) {
                      this.itemList.splice(startIndex, 1);
                    }
                    this.setState({}, (params) => {
                      this.initDragItem();
                      console.log(this.itemList);
                      console.log(this.sortableList);
                    });
                  }}
                >
                  X
                </button>
              </div>
              <input
                type="text"
                value={item.content}
                onChange={(event) => {
                  item.content = event.target.value;
                  this.setState({});
                  console.log(event);
                }}
              />
            </ExtContainer>
          );
        })}
      </ExtPanel>
    );
  }
}

export default ListTest;
