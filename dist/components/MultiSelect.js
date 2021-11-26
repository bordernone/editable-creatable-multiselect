"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MultiSelect = void 0;

require("core-js/modules/es.string.includes.js");

require("core-js/modules/es.regexp.to-string.js");

require("core-js/modules/web.dom-collections.iterator.js");

require("core-js/modules/es.string.trim.js");

require("core-js/modules/es.regexp.exec.js");

require("core-js/modules/es.string.split.js");

require("./MultiSelect.css");

var _close = _interopRequireDefault(require("../assets/close.png"));

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class MultiSelect extends _react.default.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "setInputWidth", () => {
      let x = (this.state.input.length + 1) * 8;
      this.setState(() => ({
        inputFieldWidth: x
      }));
    });

    _defineProperty(this, "focusInputField", () => {
      this.inputField.current.focus();
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
      e.preventDefault(); // Remove from selectedList

      let selectedItems = this.props.selectedItems;
      let itemToRemove = selectedItems[index];
      selectedItems.splice(index, 1); // callback(newList, addedItem, removedItem, isCreated) Note: isCreated = if the item was created or chosen from suggested items

      this.props.updateSelectedItems(selectedItems, undefined, itemToRemove, false); // Put the item to input field

      this.setState({
        input: itemToRemove.name
      }, () => {
        this.focusInputField();
        this.setInputWidth();
      });
    });

    _defineProperty(this, "handleSuggestionClick", (e, index) => {
      let suggestions = this.props.suggestions;
      const itemChosen = suggestions[index];
      suggestions.splice(index, 1); // Add item to selected list // callback(newList, addedItem, removedItem, isCreated) Note: isCreated = if the item was created or chosen from suggested items

      this.props.updateSelectedItems([...this.props.selectedItems, itemChosen], itemChosen, undefined, false); // Update suggestions

      this.props.updateSuggestions(suggestions, undefined, itemChosen);
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

      selectedItems.splice(index, 1); // callback(newList, addedItem, removedItem, isCreated) Note: isCreated = if the item was created or chosen from suggested items

      this.props.updateSelectedItems(selectedItems, undefined, itemToRemove, false); // add removed item to suggestions list

      let suggestions = this.props.suggestions;
      this.props.updateSuggestions([...suggestions, itemToRemove], itemToRemove, undefined);
      this.filterSuggestions(this.state.input);
      this.focusInputField();
    });

    _defineProperty(this, "addItemToList", e => {
      e.preventDefault();
      const enteredText = this.state.input;
      if (enteredText.trim().length === 0) return;
      const item = {
        name: enteredText.split(',')[0],
        value: ''
      }; // Add to seleted list // callback(newList, addedItem, removedItem, isCreated) Note: isCreated = if the item was created or chosen from suggested items

      this.props.updateSelectedItems([...this.props.selectedItems, item], item, undefined, true); // Update input field and reset filtered suggestions

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
      }, item.name, /*#__PURE__*/_react.default.createElement("img", {
        src: _close.default,
        alt: "Remove",
        onClick: e => {
          this.handleDeleteSelection(e, index);
        }
      }));
    });

    _defineProperty(this, "renderSuggestedItem", (item, index) => {
      // Check if filetered suggestion is empty, if yes, show all items
      if (this.state.filteredSuggestions.indexOf(index) > -1 || this.state.filteredSuggestions.length === 0) {
        return /*#__PURE__*/_react.default.createElement("div", {
          key: index,
          onClick: e => {
            this.handleSuggestionClick(e, index);
          }
        }, item.name);
      }
    });

    this.inputField = /*#__PURE__*/_react.default.createRef();
    this.state = {
      input: "",
      inputFieldWidth: 1,
      filteredSuggestions: [],
      suggestionsCache: []
    };
  } // Input width updater


  // Update filtered suggestions when props have changed
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props !== prevProps) {
      this.filterSuggestions(this.state.input);
    }
  } // Add new item to the list "Create"


  render() {
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "multiselect-wrapper",
      onClick: this.focusInputField
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "multiselect-inner-wrapper"
    }, this.props.selectedItems.map(this.renderSelectedItem), /*#__PURE__*/_react.default.createElement("div", {
      className: "multiselect-input-wrapper"
    }, /*#__PURE__*/_react.default.createElement("input", {
      onChange: this.onInputChange,
      style: {
        width: "".concat(this.state.inputFieldWidth, "px")
      },
      value: this.state.input,
      ref: this.inputField,
      onKeyPress: this.handleKeyPressInput
    }))), /*#__PURE__*/_react.default.createElement("div", {
      className: "multiselect-dropdown-wrapper"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "dropdown-content show"
    }, this.props.suggestions.map(this.renderSuggestedItem))));
  }

}

exports.MultiSelect = MultiSelect;