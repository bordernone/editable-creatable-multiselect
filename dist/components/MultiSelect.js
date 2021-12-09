"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MultiSelect = void 0;

require("core-js/modules/es.string.includes.js");

require("core-js/modules/es.regexp.to-string.js");

require("core-js/modules/web.dom-collections.iterator.js");

require("core-js/modules/es.string.trim.js");

require("./MultiSelect.css");

var _react = _interopRequireWildcard(require("react"));

var _ClickAway = _interopRequireDefault(require("./ClickAway"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const genericCallbackResponse = {
  list: undefined,
  addedItem: undefined,
  removedItem: undefined,
  isCreatedByUser: false,
  editedItem: undefined
};

class MultiSelect extends _react.default.Component {
  constructor(props) {
    var _this2;

    super(props);
    _this2 = this;

    _defineProperty(this, "componentDidMount", () => {
      // Check if displayField is provided, otherwise use default "name"
      if (this.props.displayField) this.setState({
        displayField: this.props.displayField
      });
    });

    _defineProperty(this, "setInputWidth", () => {
      let x = (this.state.input.length + 1) * 8;
      this.setState(() => ({
        inputFieldWidth: x
      }));
    });

    _defineProperty(this, "focusInputField", () => {
      this.inputField.current.focus();
      this.setState({
        isFocused: true
      });
    });

    _defineProperty(this, "filterSuggestions", input => {
      input = input.toLowerCase();
      const filteredSuggestions = [];
      this.props.suggestions.forEach((x, index) => {
        for (const key in x) {
          if (x[key].toString().toLowerCase().includes(input)) {
            filteredSuggestions.push(index);
            break;
          }
        }
      });
      this.setState({
        filteredSuggestions: filteredSuggestions
      });
    });

    _defineProperty(this, "onInputChange", e => {
      let _this = this;

      this.setState({
        input: e.target.value
      }, () => {
        _this.setInputWidth();

        _this.filterSuggestions(_this.state.input);
      });
    });

    _defineProperty(this, "handleSelectedItemClick", (e, index) => {
      e.stopPropagation();
      e.preventDefault();
      this.setState({
        isEditing: true,
        editingItemIndex: index
      });
    });

    _defineProperty(this, "onEditCallback", function (isEdited) {
      let editedItem = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

      if (isEdited && editedItem !== undefined) {
        let selectedItems = _this2.props.selectedItems;
        selectedItems[_this2.state.editingItemIndex] = editedItem;

        let response = _objectSpread({}, genericCallbackResponse);

        response.list = selectedItems;
        response.editedItem = editedItem;

        _this2.props.updateSelectedItems(response);
      }

      _this2.setState({
        isEditing: false,
        editingItemIndex: -1
      });
    });

    _defineProperty(this, "handleSuggestionClick", (e, index) => {
      let suggestions = this.props.suggestions;
      const itemChosen = suggestions[index]; // Add item to selected list

      let response = _objectSpread({}, genericCallbackResponse);

      response.list = [...this.props.selectedItems, itemChosen];
      response.addedItem = itemChosen;
      this.props.updateSelectedItems(response); // Update suggestions

      suggestions.splice(index, 1);
      response = _objectSpread({}, genericCallbackResponse);
      response.list = suggestions;
      response.removedItem = itemChosen;
      this.props.updateSuggestions(response);
      this.setState(prevState => ({
        input: "",
        filteredSuggestions: []
      }), () => {
        this.focusInputField();
        this.setInputWidth();
      });
    });

    _defineProperty(this, "handleDeleteSelection", (e, index) => {
      e.stopPropagation();
      e.preventDefault(); // Make a copy of item to remove,

      let selectedItems = this.props.selectedItems;
      let itemToRemove = selectedItems[index]; // delete from the selected list,

      selectedItems.splice(index, 1);

      let response = _objectSpread({}, genericCallbackResponse);

      response.list = selectedItems;
      response.removedItem = itemToRemove;
      this.props.updateSelectedItems(response);
      this.filterSuggestions(this.state.input);
      this.focusInputField();
    });

    _defineProperty(this, "clickedAway", () => {
      this.setState({
        isFocused: false
      });
    });

    _defineProperty(this, "addItemToList", e => {
      e.preventDefault();
      const enteredText = this.state.input;
      if (enteredText.trim().length === 0) return;
      const item = {
        [this.state.displayField]: enteredText
      }; // Add to selected list

      let response = _objectSpread({}, genericCallbackResponse);

      response.list = [...this.props.selectedItems, item];
      response.addedItem = item;
      response.isCreatedByUser = true;
      this.props.updateSelectedItems(response); // Update input field and reset filtered suggestions

      this.setState(() => ({
        input: '',
        filteredSuggestions: []
      }), () => {
        this.setInputWidth();
      });
    });

    _defineProperty(this, "handleKeyPressInput", e => {
      if (e.key === 'Enter') {
        this.addItemToList(e);
      }
    });

    _defineProperty(this, "renderSelectedItem", (item, index) => {
      return /*#__PURE__*/_react.default.createElement("div", {
        className: "multiselect-selected-item",
        onClick: event => {
          this.handleSelectedItemClick(event, index);
        },
        key: index
      }, item[this.state.displayField], /*#__PURE__*/_react.default.createElement("div", {
        className: "remove-btn",
        onClick: e => {
          this.handleDeleteSelection(e, index);
        }
      }));
    });

    this.inputField = /*#__PURE__*/_react.default.createRef();
    this.state = {
      input: "",
      inputFieldWidth: 1,
      filteredSuggestions: [],
      displayField: "name",
      isFocused: false,
      isEditing: false,
      editingItemIndex: -1
    };
  }

  // Update filtered suggestions when props have changed
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props !== prevProps) {
      this.filterSuggestions(this.state.input);
    }
  } // onBlur callback


  render() {
    return /*#__PURE__*/_react.default.createElement(_ClickAway.default, {
      onBlurCallback: this.clickedAway
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: this.props.disabled ? "cursor-not-allowed" : ""
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "multiselect-wrapper" + (this.props.disabled ? " multiselect-elem-disabled" : "")
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "multiselect-inner-wrapper " + (this.state.isEditing ? "multiselect-elem-disabled" : ""),
      onClick: this.focusInputField
    }, this.props.selectedItems.map(this.renderSelectedItem), /*#__PURE__*/_react.default.createElement("div", {
      className: "multiselect-input-wrapper" + (this.props.selectedItems.length === 0 ? " full-width" : "")
    }, /*#__PURE__*/_react.default.createElement("input", {
      onChange: this.onInputChange,
      style: {
        width: "".concat(this.state.inputFieldWidth, "px")
      },
      value: this.state.input,
      ref: this.inputField,
      className: this.props.selectedItems.length === 0 ? "full-width" : "",
      placeholder: this.props.selectedItems.length === 0 ? this.props.placeholder : "",
      onKeyPress: this.handleKeyPressInput
    }))), /*#__PURE__*/_react.default.createElement(MultiSelectDropdownList, {
      disabled: this.state.isEditing,
      onClick: this.focusInputField,
      suggestions: this.props.suggestions,
      filteredSuggestions: this.state.filteredSuggestions,
      displayField: this.state.displayField,
      onClickCallback: this.handleSuggestionClick,
      isVisible: this.state.isFocused,
      maxDisplayedItems: this.props.maxDisplayedItems
    }), /*#__PURE__*/_react.default.createElement(ItemEdit, {
      isEditing: this.state.isEditing,
      editingItem: this.props.selectedItems[this.state.editingItemIndex],
      editingField: this.props.displayField,
      editCallback: this.onEditCallback,
      showBelow: this.props.editFieldPosBelow
    }))));
  }

}

exports.MultiSelect = MultiSelect;

const MultiSelectDropdownList = props => {
  const {
    suggestions,
    filteredSuggestions,
    displayField,
    onClickCallback,
    isVisible,
    maxDisplayedItems,
    disabled
  } = props; // Display suggested items

  const getItemsToDisplay = () => {
    let totalItemsToDisplay = maxDisplayedItems;
    if (!maxDisplayedItems) totalItemsToDisplay = suggestions.length;
    let itemsToDisplayIndices = [];

    if (filteredSuggestions.length === 0) {
      // Display all items
      let least = Math.min(totalItemsToDisplay, suggestions.length);

      for (let i = 0; i < least; i++) itemsToDisplayIndices.push(i);
    } else if (filteredSuggestions.length > totalItemsToDisplay) {
      // slice the array
      itemsToDisplayIndices = filteredSuggestions.slice(0, totalItemsToDisplay);
    } else {
      itemsToDisplayIndices = filteredSuggestions;
    }

    return itemsToDisplayIndices;
  }; // Display suggested items


  const renderSuggestedItem = (itemIndex, index) => {
    if (suggestions[itemIndex] !== undefined) {
      return /*#__PURE__*/_react.default.createElement("div", {
        key: index,
        onClick: e => {
          onClickCallback(e, itemIndex);
        }
      }, suggestions[itemIndex][displayField]);
    }
  };

  return /*#__PURE__*/_react.default.createElement("div", {
    className: "multiselect-dropdown-wrapper " + (disabled ? "multiselect-elem-disabled" : "")
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "dropdown-content " + (isVisible && !disabled ? "show" : "")
  }, getItemsToDisplay().map(renderSuggestedItem)));
};

const ItemEdit = props => {
  const {
    isEditing,
    editCallback,
    editingItem,
    editingField,
    showBelow
  } = props;
  const [inputText, setInputText] = (0, _react.useState)("");

  const confirm = () => {
    let item = editingItem;
    item[editingField] = inputText;
    editCallback(true, item);
  };

  const discard = () => {
    editCallback(false);
  };

  const onInputChange = e => {
    setInputText(e.target.value);
  };

  const handleKeyPressInput = e => {
    if (e.key === 'Enter') {
      confirm();
    }
  };

  (0, _react.useEffect)(() => {
    if (editingItem !== undefined) {
      setInputText(editingItem[editingField]);
    }
  }, [editingItem, editingField]);
  return /*#__PURE__*/_react.default.createElement(_ClickAway.default, {
    onBlurCallback: () => {
      if (isEditing) {
        discard();
      }
    }
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "multiselect-edit-wrapper" + (isEditing ? " visible" : "") + (!showBelow ? " multiselect-absolute-top-above" : " multiselect-absolute-top-below")
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "edit-popup-wrapper"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "edit-input-field"
  }, /*#__PURE__*/_react.default.createElement("input", {
    value: inputText,
    onChange: onInputChange,
    onKeyPress: handleKeyPressInput
  })), /*#__PURE__*/_react.default.createElement("div", {
    className: "edit-action-buttons"
  }, /*#__PURE__*/_react.default.createElement("button", {
    className: "edit-confirm-button",
    onClick: confirm
  }, "\u2713"), /*#__PURE__*/_react.default.createElement("button", {
    className: "edit-discard-button",
    onClick: discard
  }, "\u2716")))));
};