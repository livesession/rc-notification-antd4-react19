import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _isNativeReflectConstruct from "@babel/runtime/helpers/esm/isNativeReflectConstruct";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
var _excluded = ["getContainer"];
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
import * as React from 'react';
import { Component } from 'react';
import { createRoot } from 'react-dom/client';
import classNames from 'classnames';
import { CSSMotionList } from 'rc-motion';
import createChainedFunction from "rc-util/es/createChainedFunction";
import Notice from './Notice';
import _useNotification from './useNotification';
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
    _classCallCheck(this, Notification);
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
      var notice = _objectSpread(_objectSpread({}, originNotice), {}, {
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
  _inherits(Notification, _Component);
  return _createClass(Notification, [{
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
        var onClose = createChainedFunction(_this2.remove.bind(_this2, key), notice.onClose);
        var noticeProps = _objectSpread(_objectSpread(_objectSpread({
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
        className: classNames(prefixCls, className),
        style: style
      }, /*#__PURE__*/React.createElement(CSSMotionList, {
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
            className: classNames(motionClassName, "".concat(prefixCls, "-hook-holder")),
            style: _objectSpread({}, motionStyle),
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
        return /*#__PURE__*/React.createElement(Notice, _objectSpread(_objectSpread({}, noticeProps), {}, {
          className: classNames(motionClassName, noticeProps === null || noticeProps === void 0 ? void 0 : noticeProps.className),
          style: _objectSpread(_objectSpread({}, motionStyle), noticeProps === null || noticeProps === void 0 ? void 0 : noticeProps.style)
        }));
      }));
    }
  }]);
}(Component);
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
    props = _objectWithoutProperties(_ref6, _excluded);
  var div = document.createElement('div');
  var root = createRoot(div);
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
        return _useNotification(notification);
      }
    });
  }
  // Only used for test case usage
  if (process.env.NODE_ENV === 'test' && properties.TEST_RENDER) {
    properties.TEST_RENDER(/*#__PURE__*/React.createElement(Notification, _objectSpread(_objectSpread({}, props), {}, {
      ref: ref
    })));
    return;
  }
  root.render(/*#__PURE__*/React.createElement(Notification, _objectSpread(_objectSpread({}, props), {}, {
    ref: ref
  })));
};
export default Notification;