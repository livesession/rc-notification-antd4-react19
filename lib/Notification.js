"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _isNativeReflectConstruct2 = _interopRequireDefault(require("@babel/runtime/helpers/isNativeReflectConstruct"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _react = _interopRequireWildcard(require("react"));
var React = _react;
var _client = require("react-dom/client");
var _classnames = _interopRequireDefault(require("classnames"));
var _rcMotion = require("rc-motion");
var _createChainedFunction = _interopRequireDefault(require("rc-util/lib/createChainedFunction"));
var _Notice = _interopRequireDefault(require("./Notice"));
var _useNotification2 = _interopRequireDefault(require("./useNotification"));
var _excluded = ["getContainer"];
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _callSuper(t, o, e) { return o = (0, _getPrototypeOf2.default)(o), (0, _possibleConstructorReturn2.default)(t, (0, _isNativeReflectConstruct2.default)() ? Reflect.construct(o, e || [], (0, _getPrototypeOf2.default)(t).constructor) : o.apply(t, e)); }
var seed = 0;
var now = Date.now();
function getUuid() {
  var id = seed;
  seed += 1;
  return "rcNotification_".concat(now, "_").concat(id);
}
var Notification = /*#__PURE__*/function (_Component) {
  function Notification() {
    var _this;
    (0, _classCallCheck2.default)(this, Notification);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _callSuper(this, Notification, [].concat(args));
    _this.state = {
      notices: []
    };
    _this.hookRefs = new Map();
    _this.add = function (originNotice, holderCallback) {
      var key = originNotice.key || getUuid();
      var notice = (0, _objectSpread2.default)((0, _objectSpread2.default)({}, originNotice), {}, {
        key: key
      });
      var maxCount = _this.props.maxCount;
      _this.setState(function (previousState) {
        var notices = previousState.notices;
        var noticeIndex = notices.map(function (v) {
          return v.notice.key;
        }).indexOf(key);
        var updatedNotices = notices.concat();
        if (noticeIndex !== -1) {
          updatedNotices.splice(noticeIndex, 1, {
            notice: notice,
            holderCallback: holderCallback
          });
        } else {
          if (maxCount && notices.length >= maxCount) {
            // XXX, use key of first item to update new added (let React to move exsiting
            // instead of remove and mount). Same key was used before for both a) external
            // manual control and b) internal react 'key' prop , which is not that good.
            // eslint-disable-next-line no-param-reassign
            // zombieJ: Not know why use `updateKey`. This makes Notice infinite loop in jest.
            // Change to `updateMark` for compare instead.
            // https://github.com/react-component/notification/commit/32299e6be396f94040bfa82517eea940db947ece
            notice.key = updatedNotices[0].notice.key;
            notice.updateMark = getUuid();
            updatedNotices.shift();
          }
          updatedNotices.push({
            notice: notice,
            holderCallback: holderCallback
          });
        }
        return {
          notices: updatedNotices
        };
      });
    };
    _this.remove = function (key) {
      _this.setState(function (_ref) {
        var notices = _ref.notices;
        return {
          notices: notices.filter(function (_ref2) {
            var notice = _ref2.notice;
            return notice.key !== key;
          })
        };
      });
    };
    _this.noticePropsMap = {};
    return _this;
  }
  (0, _inherits2.default)(Notification, _Component);
  return (0, _createClass2.default)(Notification, [{
    key: "getTransitionName",
    value: function getTransitionName() {
      var _this$props = this.props,
        prefixCls = _this$props.prefixCls,
        animation = _this$props.animation;
      var transitionName = this.props.transitionName;
      if (!transitionName && animation) {
        transitionName = "".concat(prefixCls, "-").concat(animation);
      }
      return transitionName;
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;
      var notices = this.state.notices;
      var _this$props2 = this.props,
        prefixCls = _this$props2.prefixCls,
        className = _this$props2.className,
        closeIcon = _this$props2.closeIcon,
        style = _this$props2.style;
      var noticeKeys = [];
      notices.forEach(function (_ref3, index) {
        var notice = _ref3.notice,
          holderCallback = _ref3.holderCallback;
        var updateMark = index === notices.length - 1 ? notice.updateMark : undefined;
        var key = notice.key;
        var onClose = (0, _createChainedFunction.default)(_this2.remove.bind(_this2, key), notice.onClose);
        var noticeProps = (0, _objectSpread2.default)((0, _objectSpread2.default)((0, _objectSpread2.default)({
          prefixCls: prefixCls,
          closeIcon: closeIcon
        }, notice), notice.props), {}, {
          key: key,
          updateMark: updateMark,
          onClose: onClose,
          onClick: notice.onClick,
          children: notice.content
        });
        // Give to motion
        noticeKeys.push(key);
        _this2.noticePropsMap[key] = {
          props: noticeProps,
          holderCallback: holderCallback
        };
      });
      return /*#__PURE__*/React.createElement("div", {
        className: (0, _classnames.default)(prefixCls, className),
        style: style
      }, /*#__PURE__*/React.createElement(_rcMotion.CSSMotionList, {
        keys: noticeKeys,
        motionName: this.getTransitionName(),
        onVisibleChanged: function onVisibleChanged(changedVisible, _ref4) {
          var key = _ref4.key;
          if (!changedVisible) {
            delete _this2.noticePropsMap[key];
          }
        }
      }, function (_ref5) {
        var key = _ref5.key,
          motionClassName = _ref5.className,
          motionStyle = _ref5.style;
        var _this2$noticePropsMap = _this2.noticePropsMap[key],
          noticeProps = _this2$noticePropsMap.props,
          holderCallback = _this2$noticePropsMap.holderCallback;
        if (holderCallback) {
          return /*#__PURE__*/React.createElement("div", {
            key: key,
            className: (0, _classnames.default)(motionClassName, "".concat(prefixCls, "-hook-holder")),
            style: (0, _objectSpread2.default)({}, motionStyle),
            ref: function ref(div) {
              if (typeof key === 'undefined') {
                return;
              }
              if (div) {
                _this2.hookRefs.set(key, div);
                holderCallback(div, noticeProps);
              } else {
                _this2.hookRefs.delete(key);
              }
            }
          });
        }
        return /*#__PURE__*/React.createElement(_Notice.default, (0, _objectSpread2.default)((0, _objectSpread2.default)({}, noticeProps), {}, {
          className: (0, _classnames.default)(motionClassName, noticeProps === null || noticeProps === void 0 ? void 0 : noticeProps.className),
          style: (0, _objectSpread2.default)((0, _objectSpread2.default)({}, motionStyle), noticeProps === null || noticeProps === void 0 ? void 0 : noticeProps.style)
        }));
      }));
    }
  }]);
}(_react.Component);
Notification.newInstance = void 0;
Notification.defaultProps = {
  prefixCls: 'rc-notification',
  animation: 'fade',
  style: {
    top: 65,
    left: '50%'
  }
};
Notification.newInstance = function newNotificationInstance(properties, callback) {
  var _ref6 = properties || {},
    getContainer = _ref6.getContainer,
    props = (0, _objectWithoutProperties2.default)(_ref6, _excluded);
  var div = document.createElement('div');
  var root = (0, _client.createRoot)(div);
  if (getContainer) {
    var _root = getContainer();
    _root.appendChild(div);
  } else {
    document.body.appendChild(div);
  }
  var called = false;
  function ref(notification) {
    if (called) {
      return;
    }
    called = true;
    callback({
      notice: function notice(noticeProps) {
        notification.add(noticeProps);
      },
      removeNotice: function removeNotice(key) {
        notification.remove(key);
      },
      component: notification,
      destroy: function destroy() {
        root.unmount();
        if (div.parentNode) {
          div.parentNode.removeChild(div);
        }
      },
      // Hooks
      useNotification: function useNotification() {
        return (0, _useNotification2.default)(notification);
      }
    });
  }
  // Only used for test case usage
  if (process.env.NODE_ENV === 'test' && properties.TEST_RENDER) {
    properties.TEST_RENDER(/*#__PURE__*/React.createElement(Notification, (0, _objectSpread2.default)((0, _objectSpread2.default)({}, props), {}, {
      ref: ref
    })));
    return;
  }
  root.render(/*#__PURE__*/React.createElement(Notification, (0, _objectSpread2.default)((0, _objectSpread2.default)({}, props), {}, {
    ref: ref
  })));
};
var _default = exports.default = Notification;