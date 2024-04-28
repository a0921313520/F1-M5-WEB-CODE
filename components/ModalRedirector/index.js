function ModalRedirector(WrappedComponent) {
    let isSetTabKey = true; // 自锁setState:避免多次调用设置tabsKey
    return class HP extends WrappedComponent {
        constructor(props) {
            super(props);

            this.currentModalMap = { ...this.props.dialogTabKey }; // 当前Modal需要传递的属性对象
            this.setConstructor.call(this);
        }
        // componentDidMount () {
        //     typeof super.componentDidMount === "function" && super.componentDidMount()
        // }
        componentDidUpdate(prevProps) {
            if (typeof super.componentDidUpdate === "function") {
                super.componentDidUpdate(prevProps);
            } else {
                if (
                    this.props.dialogTabKey.type !==
                        prevProps.dialogTabKey.type &&
                    isSetTabKey
                ) {
                    isSetTabKey = false;
                    this.currentModalMap = { ...this.props.dialogTabKey };
                    this.props.setModalTabKey(this.currentModalMap, () => {
                        isSetTabKey = true;
                    });
                }
            }
        }
        compoenntWillUnmount() {
            this.currentModalMap = {};
        }
    };
}

export default ModalRedirector;
