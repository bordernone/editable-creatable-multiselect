"use strict";

require("core-js/modules/web.dom-collections.iterator.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class ClickAwayContainer extends _react.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "onBlur", event => {
      if (this.refContainer && !this.refContainer.current.contains(event.target)) {
        this.props.onBlurCallback();
      }
    });

    this.refContainer = /*#__PURE__*/_react.default.createRef();
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.onBlur);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.onBlur);
  }

  render() {
    return /*#__PURE__*/_react.default.createElement("div", {
      ref: this.refContainer
    }, this.props.children);
  }

}

exports.default = ClickAwayContainer;
ClickAwayContainer.propTypes = {
  children: _propTypes.default.element.isRequired,
  onBlurCallback: _propTypes.default.func.isRequired
};