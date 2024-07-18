# F1-M3-WEB-CODE

# A: [modal弹窗]

    1.classname= "confirm-modal-of-forgetuser"
    modal.info({}) 样式
    有title/okText按钮居中。

    2.classname = confirm-modal-of-public oneButton dont-show-close-button elementTextLeft
    (注：confirm-modal-of-public 满足大部分基本的modal.info / modal.confirm 样式)
    oneButton 加在只有一个按钮的情况,按钮会居中有左右margin
    dont-show-close-button 用于不显示右上角的 X，（closable=false属性设置了也没用）
    elementTextLeft 内容文字会左对齐

    3.modal组件（不含confirm/info）
        3.1 className 尽量（根据自己的情况） 用"modal-pubilc" + 自定义className. 样式写于 modal.less 内，方便修改协调。
        3.2 className="modal-otpVerification" 仅用于各种otp验证的modal,别用在其他的的modal className里面。

    4.一些用modal confirm/info做的提示窗写在 helper.js中。
        showResultModal()
        showSmallResultModal()
        具体用法全局搜索下都有，如果不能满足需要，增加className 或者修改这两个方法有可能影响到他们，可以考虑按照这个在helper.js中新增方法。

# B: [webp格式]

    1.生成webp格式的图片，详情可查看webp.js。
    2.在终端里运行node webp 即可执行生成图片了。

# C: [SEO]

    1.目前SEO的title、Keywords、description、footer 都采用API获取。(https://strapistag1.fun88.biz/admin)当前是在这个网址中逐一填写相关信息。
    2.如果API没有则用本地写死的，本地的相关内容写于 data/seo/seo.static.js。(基本上都会采用API的数据)。
    3.seo footer 中的部分内容在文字前需要有圆点，这里列表统一用 ol 来写，把ul留给其他的需要。
    4.目前尝试(https://strapistag1.fun88.biz/admin)在这个网站中添加footer，给标签写style、classname 会可能保存失败，或者添加了但是在项目网页中也不会显示，所以暂时用标签名来写css。

# D: [图片路径]

    1. xxx.less中URL路径用: @{base-path}/img/xxx/xxx.png
    2. html、JS路径用 ${process.env.BASE_PATH}/img/xxx/xxx.png
    3. 外部链接不用修改可直接用
    这些 next.config.js 中都有配置定义好。
