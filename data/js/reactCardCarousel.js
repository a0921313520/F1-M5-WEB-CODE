module.exports = (function (e) {
    var t = {};
    function n(r) {
        if (t[r]) return t[r].exports;
        var o = (t[r] = { i: r, l: !1, exports: {} });
        return e[r].call(o.exports, o, o.exports, n), (o.l = !0), o.exports;
    }
    return (
        (n.m = e),
        (n.c = t),
        (n.d = function (e, t, r) {
            n.o(e, t) ||
                Object.defineProperty(e, t, { enumerable: !0, get: r });
        }),
        (n.r = function (e) {
            "undefined" != typeof Symbol &&
                Symbol.toStringTag &&
                Object.defineProperty(e, Symbol.toStringTag, {
                    value: "Module",
                }),
                Object.defineProperty(e, "__esModule", { value: !0 });
        }),
        (n.t = function (e, t) {
            if ((1 & t && (e = n(e)), 8 & t)) return e;
            if (4 & t && "object" == typeof e && e && e.__esModule) return e;
            var r = Object.create(null);
            if (
                (n.r(r),
                Object.defineProperty(r, "default", {
                    enumerable: !0,
                    value: e,
                }),
                2 & t && "string" != typeof e)
            )
                for (var o in e)
                    n.d(
                        r,
                        o,
                        function (t) {
                            return e[t];
                        }.bind(null, o),
                    );
            return r;
        }),
        (n.n = function (e) {
            var t =
                e && e.__esModule
                    ? function () {
                          return e.default;
                      }
                    : function () {
                          return e;
                      };
            return n.d(t, "a", t), t;
        }),
        (n.o = function (e, t) {
            return Object.prototype.hasOwnProperty.call(e, t);
        }),
        (n.p = ""),
        n((n.s = 1))
    );
})([
    function (e, t, n) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 });
        (t.POSITION = {
            PREVS: "prevs",
            NEXTS: "nexts",
            PREV: "prev",
            NEXT: "next",
            CURRENT: "current",
            HIDDEN: "hidden",
        }),
            (t.ALIGNMENT = { HORIZONTAL: "horizontal", VERTICAL: "vertical" }),
            (t.SPREADSTATIC = ["-62%", "-38%"]);
    },
    function (e, t, n) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 });
        var r =
                Object.assign ||
                function (e) {
                    for (var t = 1; t < arguments.length; t++) {
                        var n = arguments[t];
                        for (var r in n)
                            Object.prototype.hasOwnProperty.call(n, r) &&
                                (e[r] = n[r]);
                    }
                    return e;
                },
            o = (function () {
                function e(e, t) {
                    for (var n = 0; n < t.length; n++) {
                        var r = t[n];
                        (r.enumerable = r.enumerable || !1),
                            (r.configurable = !0),
                            "value" in r && (r.writable = !0),
                            Object.defineProperty(e, r.key, r);
                    }
                }
                return function (t, n, r) {
                    return n && e(t.prototype, n), r && e(t, r), t;
                };
            })(),
            a = n(2),
            i = c(a),
            u = c(n(3)),
            l = n(6),
            s = n(0);
        function c(e) {
            return e && e.__esModule ? e : { default: e };
        }
        var f = (function (e) {
            function t(e) {
                !(function (e, t) {
                    if (!(e instanceof t))
                        throw new TypeError(
                            "Cannot call a class as a function",
                        );
                })(this, t);
                var n = (function (e, t) {
                    if (!e)
                        throw new ReferenceError(
                            "this hasn't been initialised - super() hasn't been called",
                        );
                    return !t ||
                        ("object" != typeof t && "function" != typeof t)
                        ? e
                        : t;
                })(
                    this,
                    (t.__proto__ || Object.getPrototypeOf(t)).call(this, e),
                );
                return (
                    (n.goTo = function (e) {
                        n.setState(
                            { current_index: Number(e) },
                            n.props.afterChange,
                        );
                    }),
                    (n.next = function () {
                        n._is_mounted && n._cardOnClick(s.POSITION.NEXT);
                    }),
                    (n.prev = function () {
                        return n._cardOnClick(s.POSITION.PREV);
                    }),
                    (n.getCurrentIndex = function () {
                        return n.state.current_index;
                    }),
                    (n._keydownEventListener = function (e) {
                        return 39 === e.which
                            ? n.next()
                            : 37 === e.which
                              ? n.prev()
                              : void 0;
                    }),
                    (n._autoplay = function () {
                        if (n._is_mounted) {
                            var e = n.props.autoplay_speed,
                                t = setInterval(n.next, e);
                            n.setState({ interval: t });
                        }
                    }),
                    (n._resetInterval = function () {
                        clearInterval(n.state.interval), n._autoplay();
                    }),
                    (n._getCardClass = function (e) {
                        var t = n.props,
                            r = t.children,
                            o = t.spread,
                            a = n.state.current_index;
                        return null === a
                            ? s.POSITION.HIDDEN
                            : e === a
                              ? s.POSITION.CURRENT
                              : e === a + 1 ||
                                  (0 === e &&
                                      a === i.default.Children.count(r) - 1)
                                ? s.POSITION.NEXT
                                : (e === a + 2 ||
                                        (0 === e &&
                                            a ===
                                                i.default.Children.count(r) -
                                                    2)) &&
                                    4 === o.length
                                  ? s.POSITION.NEXTS
                                  : e === a - 1 ||
                                      (e === i.default.Children.count(r) - 1 &&
                                          0 === a)
                                    ? s.POSITION.PREV
                                    : (e === a - 2 ||
                                            (e ===
                                                i.default.Children.count(r) -
                                                    2 &&
                                                0 === a)) &&
                                        4 === o.length
                                      ? s.POSITION.PREVS
                                      : s.POSITION.HIDDEN;
                    }),
                    (n._cardOnClick = function (e) {
                        var t = n.props,
                            r = t.children,
                            o = t.autoplay,
                            a = n.state.current_index;
                        o && n._resetInterval(),
                            e === s.POSITION.NEXT
                                ? a === i.default.Children.count(r) - 1
                                    ? n.setState(
                                          { current_index: 0 },
                                          n.props.afterChange,
                                      )
                                    : n.setState(
                                          { current_index: a + 1 },
                                          n.props.afterChange,
                                      )
                                : e === s.POSITION.PREV &&
                                  (0 === a
                                      ? n.setState(
                                            {
                                                current_index:
                                                    i.default.Children.count(
                                                        r,
                                                    ) - 1,
                                            },
                                            n.props.afterChange,
                                        )
                                      : n.setState(
                                            { current_index: a - 1 },
                                            n.props.afterChange,
                                        ));
                    }),
                    (n.ChildComponents = function () {
                        var e = n.props,
                            t = e.alignment,
                            o = e.spread,
                            a = e.disable_box_shadow;
                        return i.default.Children.map(
                            n.props.children,
                            function (e, u) {
                                var c = n._getCardClass(u);
                                return i.default.createElement(
                                    "div",
                                    {
                                        key: u,
                                        onClick: function () {
                                            return n._cardOnClick(c);
                                        },
                                        style: r({}, l.STYLES.CARD, {
                                            opacity: (0, l.getOpacity)(c),
                                            zIndex: (0, l.getZIndex)(c),
                                            transform: (0, l.getTransform)(
                                                c,
                                                t,
                                                o || s.SPREADSTATIC,
                                            ),
                                            boxShadow: (0,
                                            n.props.disable_box_shadow === 0
                                                ? l.getBoxShadow
                                                : () => {
                                                      return "unset";
                                                  })(c, t, a),
                                            cursor: (0, l.getCursor)(c, t),
                                        }),
                                    },
                                    e,
                                );
                            },
                        );
                    }),
                    (n.state = {
                        current_index: e.disable_fade_in
                            ? e.initial_index
                            : null,
                        interval: null,
                    }),
                    n
                );
            }
            return (
                (function (e, t) {
                    if ("function" != typeof t && null !== t)
                        throw new TypeError(
                            "Super expression must either be null or a function, not " +
                                typeof t,
                        );
                    (e.prototype = Object.create(t && t.prototype, {
                        constructor: {
                            value: e,
                            enumerable: !1,
                            writable: !0,
                            configurable: !0,
                        },
                    })),
                        t &&
                            (Object.setPrototypeOf
                                ? Object.setPrototypeOf(e, t)
                                : (e.__proto__ = t));
                })(t, e),
                o(t, [
                    {
                        key: "componentDidMount",
                        value: function () {
                            var e = this,
                                t = this.props,
                                n = t.initial_index,
                                r = t.disable_keydown,
                                o = t.disable_fade_in,
                                a = t.autoplay;
                            (this._is_mounted = !0),
                                o ||
                                    setTimeout(function () {
                                        e.setState({ current_index: n });
                                    }, 0.25),
                                r ||
                                    (document.onkeydown =
                                        this._keydownEventListener),
                                a && this._autoplay();
                        },
                    },
                    {
                        key: "componentWillUnmount",
                        value: function () {
                            (this._is_mounted = !1),
                                this.props.disable_keydown ||
                                    (document.onkeydown = null);
                        },
                    },
                    {
                        key: "render",
                        value: function () {
                            return i.default.createElement(
                                "div",
                                { style: l.STYLES.CONTAINER },
                                i.default.createElement(
                                    this.ChildComponents,
                                    null,
                                ),
                            );
                        },
                    },
                ]),
                t
            );
        })(a.Component);
        (f.propTypes = {
            alignment: u.default.oneOf([
                s.ALIGNMENT.HORIZONTAL,
                s.ALIGNMENT.VERTICAL,
            ]),
            spread: u.default.array,
            initial_index: u.default.number,
            disable_keydown: u.default.bool,
            disable_box_shadow: u.default.bool,
            disable_fade_in: u.default.bool,
            autoplay: u.default.bool,
            autoplay_speed: u.default.number,
            afterChange: u.default.func,
        }),
            (f.defaultProps = {
                alignment: s.ALIGNMENT.HORIZONTAL,
                spread: s.SPREADSTATIC,
                initial_index: 0,
                disable_keydown: !1,
                disable_box_shadow: !1,
                disable_fade_in: !1,
                autoplay: !1,
                autoplay_speed: 5e3,
                afterChange: function () {},
            }),
            (t.default = f);
    },
    function (e, t) {
        e.exports = require("react");
    },
    function (e, t, n) {
        e.exports = n(4)();
    },
    function (e, t, n) {
        "use strict";
        var r = n(5);
        function o() {}
        function a() {}
        (a.resetWarningCache = o),
            (e.exports = function () {
                function e(e, t, n, o, a, i) {
                    if (i !== r) {
                        var u = new Error(
                            "Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types",
                        );
                        throw ((u.name = "Invariant Violation"), u);
                    }
                }
                function t() {
                    return e;
                }
                e.isRequired = e;
                var n = {
                    array: e,
                    bool: e,
                    func: e,
                    number: e,
                    object: e,
                    string: e,
                    symbol: e,
                    any: e,
                    arrayOf: t,
                    element: e,
                    elementType: e,
                    instanceOf: t,
                    node: e,
                    objectOf: t,
                    oneOf: t,
                    oneOfType: t,
                    shape: t,
                    exact: t,
                    checkPropTypes: a,
                    resetWarningCache: o,
                };
                return (n.PropTypes = n), n;
            });
    },
    function (e, t, n) {
        "use strict";
        e.exports = "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED";
    },
    function (e, t, n) {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }),
            (t.STYLES = void 0),
            (t.getOpacity = function (e) {
                return e === r.POSITION.HIDDEN ? 0 : 1;
            }),
            (t.getZIndex = function (e) {
                return e === r.POSITION.HIDDEN
                    ? 0
                    : e === r.POSITION.PREVS || e === r.POSITION.NEXTS
                      ? 0
                      : e === r.POSITION.CURRENT
                        ? 2
                        : 1;
            }),
            (t.getTransform = function (e, t, n) {
                if (t === r.ALIGNMENT.HORIZONTAL) {
                    if (e === r.POSITION.PREV)
                        return "translate(" + n[0] + ", -50%) scale(0.82)";
                    if (e === r.POSITION.NEXT)
                        return "translate(" + n[1] + ", -50%) scale(0.82)";
                    if (e === r.POSITION.PREVS)
                        return "translate(" + n[2] + ", -50%) scale(0.72)";
                    if (e === r.POSITION.NEXTS)
                        return "translate(" + n[3] + ", -50%) scale(0.72)";
                }
                if (t === r.ALIGNMENT.VERTICAL) {
                    if (e === r.POSITION.PREV)
                        return "translate(-50%, " + n[1] + ") scale(0.82)";
                    if (e === r.POSITION.NEXT)
                        return "translate(-50%, " + n[0] + ") scale(0.82)";
                    if (e === r.POSITION.PREVS)
                        return "translate(" + n[3] + ", -50%) scale(0.72)";
                    if (e === r.POSITION.NEXTS)
                        return "translate(" + n[2] + ", -50%) scale(0.72)";
                }
                return e === r.POSITION.HIDDEN
                    ? "translate(-50%, -50%) scale(0.5)"
                    : "translate(-50%, -50%)";
            }),
            (t.getBoxShadow = function (e, t, n) {
                if (!n && e === r.POSITION.CURRENT) {
                    if (t === r.ALIGNMENT.HORIZONTAL)
                        return "10px 0px 10px -10px rgba(0, 0, 0, .4), -10px 0px 10px -10px rgba(0, 0, 0, .4)";
                    if (t === r.ALIGNMENT.VERTICAL)
                        return "0px 10px 10px -10px rgba(0, 0, 0, .4), 0px -10px 10px -10px rgba(0, 0, 0, .4)";
                }
                return "unset";
            }),
            (t.getCursor = function (e, t) {
                return "unset";
            });
        var r = n(0);
        t.STYLES = {
            CONTAINER: {
                positive: "relative",
                width: "100%",
                height: "100%",
                margin: 0,
                padding: 0,
            },
            CARD: {
                position: "absolute",
                left: "50%",
                top: "50%",
                transition: "all 0.6s",
            },
        };
    },
]);
