import './MultiSelect.css';
import React from "react";
import ClickAwayContainer from './ClickAway';

export class MultiSelect extends React.Component {
    constructor(props) {
        super(props);

        this.inputField = React.createRef();

        this.state = {
            input: "",
            inputFieldWidth: 1,
            filteredSuggestions: [],
            displayField:"name",
            isFocused:false,
        };
    }

    componentDidMount = () => {
        // Check if displayField is provided, otherwise use default "name"
        if (this.props.displayField) this.setState({displayField:this.props.displayField});
    }

    // Input width updater
    setInputWidth = () => {
        let x = (this.state.input.length + 1) * 8;
        this.setState(() => ({
            inputFieldWidth: x
        }))
    }

    // Focus on input field
    focusInputField = () => {
        this.inputField.current.focus();
        this.setState({isFocused:true})
    }

    // Filter suggestions based on user's input
    filterSuggestions = (input) => {
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
        })
    }

    // Update input when changed and call the filter suggestions
    onInputChange = (e) => {
        let _this = this;
        this.setState({
            input: e.target.value
        }, () => {
            _this.setInputWidth();
            _this.filterSuggestions(_this.state.input);
        })
    }

    // When a selected item is click. We trigger the edit mode.
    handleSelectedItemClick = (e, index) => {
        e.stopPropagation();
        e.preventDefault();

        // Remove from selectedList
        let selectedItems = this.props.selectedItems;
        let itemToRemove = selectedItems[index];
        selectedItems.splice(index, 1);

        // callback(newList, addedItem, removedItem, isCreated) Note: isCreated = if the item was created or chosen from suggested items
        this.props.updateSelectedItems(selectedItems, undefined, itemToRemove, false);

        // Put the item to input field
        this.setState({input: itemToRemove[this.state.displayField]}, () => {
            this.focusInputField();
            this.setInputWidth();
        });
    }

    // When a suggested item is chosen. 'index' is the index of item in the suggestions list
    handleSuggestionClick = (e, index) => {
        let suggestions = this.props.suggestions;

        const itemChosen = suggestions[index];
        suggestions.splice(index, 1);

        // Add item to selected list // callback(newList, addedItem, removedItem, isCreated) Note: isCreated = if the item was created or chosen from suggested items
        this.props.updateSelectedItems([...this.props.selectedItems, itemChosen], itemChosen, undefined, false);

        // Update suggestions
        this.props.updateSuggestions(suggestions, undefined, itemChosen);

        this.setState((prevState) => ({
            input: "",
            filteredSuggestions: []
        }), () => {
            this.focusInputField();
            this.setInputWidth();
        });
    }

    // Delete item from selected list
    handleDeleteSelection = (e, index) => {
        e.stopPropagation();
        e.preventDefault();

        // Make a copy of item to remove,
        let selectedItems = this.props.selectedItems;
        let itemToRemove = selectedItems[index];

        // delete from the selected list,
        selectedItems.splice(index, 1);
        // callback(newList, addedItem, removedItem, isCreated) Note: isCreated = if the item was created or chosen from suggested items
        this.props.updateSelectedItems(selectedItems, undefined, itemToRemove, false);

        // add removed item to suggestions list
        let suggestions = this.props.suggestions;
        this.props.updateSuggestions([...suggestions, itemToRemove], itemToRemove, undefined);

        this.filterSuggestions(this.state.input);
        this.focusInputField();
    }

    // Update filtered suggestions when props have changed
    componentDidUpdate(prevProps, prevState, snapshot) {
        if ((this.props !== prevProps)) {
            this.filterSuggestions(this.state.input);
        }
    }

    // onBlur callback
    clickedAway = () => {
        this.setState({isFocused:false});
    }

    // Add new item to the list "Create"
    addItemToList = (e) => {
        e.preventDefault();
        const enteredText = this.state.input;
        if (enteredText.trim().length === 0)return;
        const item = {
            [this.state.displayField]: enteredText.split(',')[0]
        };

        // Add to seleted list // callback(newList, addedItem, removedItem, isCreated) Note: isCreated = if the item was created or chosen from suggested items
        this.props.updateSelectedItems([...this.props.selectedItems, item], item, undefined, true);

        // Update input field and reset filtered suggestions
        this.setState(() => ({
            input: '', filteredSuggestions: []
        }), () => {
            this.setInputWidth();
        })
    }

    // Check if entered is pressed when typing, if so, add new item to the list.
    handleKeyPressInput = (e) => {
        if (e.key === 'Enter'){
            this.addItemToList(e);
        }
    }

    // Display selected items
    renderSelectedItem = (item, index) => {
        return (<div className={"multiselect-selected-item"}
                     onClick={(event) => { this.handleSelectedItemClick(event, index)}}
                     key={index}>
                            {item[this.state.displayField]}
                            <div className={"remove-btn"}
                                 onClick={(e) => {this.handleDeleteSelection(e, index)}}
                                 />
                </div>)
    }

    render() {
        return (
            <ClickAwayContainer onBlurCallback={this.clickedAway}>
                <div className={"multiselect-wrapper"} onClick={this.focusInputField}>
                    <div className={"multiselect-inner-wrapper"}>
                        {this.props.selectedItems.map(this.renderSelectedItem)}
                        <div className={"multiselect-input-wrapper"}>
                            <input onChange={this.onInputChange} style={{width: `${this.state.inputFieldWidth}px`}}
                                   value={this.state.input} ref={this.inputField} onKeyPress={this.handleKeyPressInput}/>
                        </div>
                    </div>


                    <MultiSelectDropdownList
                        suggestions={this.props.suggestions}
                        filteredSuggestions={this.state.filteredSuggestions}
                        displayField={this.state.displayField}
                        onClickCallback={this.handleSuggestionClick}
                        isVisible={this.state.isFocused}
                        maxDisplayedItems={this.props.maxDisplayedItems}
                    />
                </div>
            </ClickAwayContainer>
        )
    }
}

const MultiSelectDropdownList = (props) => {
    const {suggestions, filteredSuggestions, displayField, onClickCallback, isVisible, maxDisplayedItems} = props;

    // Display suggested items
    const getItemsToDisplay = () => {
        let totalItemsToDisplay = maxDisplayedItems;
        if (!maxDisplayedItems) totalItemsToDisplay = suggestions.length;
        
        let itemsToDisplayIndices = [];
        if (filteredSuggestions.length === 0) {
            // Display all items
            let least = Math.min(totalItemsToDisplay, suggestions.length);
            for (let i = 0; i < least; i++) itemsToDisplayIndices.push(i);
        } else if (filteredSuggestions.length > totalItemsToDisplay){
            // slice the array
            itemsToDisplayIndices = filteredSuggestions.slice(0, totalItemsToDisplay);
        } else {
            itemsToDisplayIndices = filteredSuggestions;
        }
        return itemsToDisplayIndices;
    }

    // Display suggested items
    const renderSuggestedItem = (itemIndex, index) => {
            return (<div key={index}
                         onClick={(e) => {onClickCallback(e, itemIndex)}}>
                {suggestions[itemIndex][displayField]}
            </div>)
    }

    return (
        <div className={"multiselect-dropdown-wrapper"}>
            <div className={"dropdown-content " + (isVisible? "show":"")}>
                {getItemsToDisplay().map(renderSuggestedItem)}
            </div>
        </div>
    )
}