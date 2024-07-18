import React from "react";
import ReactDOM from "react-dom";

// 只能在componentDidMount之后调用，因为内部用到了body元素
// 因为有setTimeout延迟，所以300ms内卸载组件会导致内存泄漏
// 在没有滚动条的情况下可能会有抖动，后续处理...
export default class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visibleClass: false,
        };

        this.changeDrawer = this.changeDrawer.bind(this);
        this.drawerContent = React.createRef();
    }
    componentDidMount() {
        this.scrollWidth = this.getScrollWidth();
    }
    componentDidUpdate(prevProps) {
        if (prevProps.visible !== this.props.visible) {
            this.changeDrawer(this.props.visible);
        }
    }
    getScrollWidth() {
        let noScroll,
            scroll,
            oDiv = document.createElement("DIV");
        oDiv.style.cssText =
            "position:absolute; top:-9999px; width:100px; height:100px; overflow:hidden;";
        noScroll = document.body.appendChild(oDiv).clientWidth;
        oDiv.style.overflowY = "scroll";
        scroll = oDiv.clientWidth;
        document.body.removeChild(oDiv);
        return noScroll - scroll;
    }
    changeDrawer(status) {
        const body = document.body;
        // 如果是默认加载Drawer组件，此处调用过早会导致动画失效，需要把这个事件排到队列最后执行
        // setTimeout事件需要在组件卸载的时候clear掉，否则会造成内存泄漏
        setTimeout(() => this.setState({ visibleClass: status }));

        if (status) {
            body.setAttribute(
                "style",
                "position: relative; overflow-y: hidden; touch-action: none; width:calc(100% - " +
                    this.scrollWidth +
                    "px);",
            );
            body.setAttribute("class", "ant-scrolling-effect");
        } else {
            setTimeout(() => {
                body.setAttribute("class", "");
                body.setAttribute("style", "");
            }, 300);
        }
    }
    render() {
        const { visible, children, onClose } = this.props;
        return visible ||
            (this.drawerContent.current &&
                this.drawerContent.current.childNodes.length)
            ? ReactDOM.createPortal(
                  <div
                      className={`common-distance-wrap drawer-wrap${
                          this.state.visibleClass ? " drawer-open" : ""
                      } ${this.props.className}`}
                  >
                      <div
                          className="drawer-mask"
                          onClick={() => {
                              onClose();
                          }}
                      ></div>
                      <div className="drawer-content-wrapper">
                          <div
                              ref={this.drawerContent}
                              className="drawer-content"
                          >
                              <div
                                  className="games-slider inner"
                                  onClick={() => {
                                      onClose();
                                  }}
                              ></div>
                              {children}
                          </div>
                      </div>
                  </div>,
                  (this.props.wrapDom && this.props.wrapDom.current) ||
                      document.body,
              )
            : null;
    }
}
