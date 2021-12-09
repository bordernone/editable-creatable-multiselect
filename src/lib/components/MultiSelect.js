import './MultiSelect.css';
import React, {useEffect, useState} from "react";
import ClickAwayContainer from './ClickAway';

const genericCallbackResponse = {
    list:undefined,
    addedItem:undefined,
    removedItem:undefined,
    isCreatedByUser:false,
    editedItem:undefined
}

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
            isEditing:false,
            editingItemIndex:-1
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

        this.setState({isEditing:true, editingItemIndex:index});
    }

    onEditCallback = (isEdited, editedItem=undefined) => {
        if (isEdited && editedItem !== undefined){
            let selectedItems = this.props.selectedItems;

            selectedItems[this.state.editingItemIndex] = editedItem;

            let response = {...genericCallbackResponse};
            response.list = selectedItems;
            response.editedItem = editedItem;
            this.props.updateSelectedItems(response);
        }
        this.setState({isEditing:false, editingItemIndex:-1});
    }

    // When a suggested item is chosen. 'index' is the index of item in the suggestions list
    handleSuggestionClick = (e, index) => {
        let suggestions = this.props.suggestions;

        const itemChosen = suggestions[index];

        // Add item to selected list
        let response = {...genericCallbackResponse};
        response.list = [...this.props.selectedItems, itemChosen];
        response.addedItem = itemChosen;
        this.props.updateSelectedItems(response);

        // Update suggestions
        suggestions.splice(index, 1);
        response = {...genericCallbackResponse};
        response.list = suggestions;
        response.removedItem = itemChosen;
        this.props.updateSuggestions(response);

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

        let response = {...genericCallbackResponse};
        response.list = selectedItems;
        response.removedItem = itemToRemove;
        this.props.updateSelectedItems(response);

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
            [this.state.displayField]: enteredText
        };

        // Add to selected list
        let response = {...genericCallbackResponse};
        response.list = [...this.props.selectedItems, item];
        response.addedItem = item;
        response.isCreatedByUser = true;
        this.props.updateSelectedItems(response);

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
            <ClickAwayContainer onBlurCallback={this.clickedAway} >
                <div className={(this.props.disabled? "cursor-not-allowed":"")}>
                    <div className={"multiselect-wrapper" + (this.props.disabled? " multiselect-elem-disabled":"")}>
                        <div className={"multiselect-inner-wrapper " + (this.state.isEditing? "multiselect-elem-disabled":"")} onClick={this.focusInputField}>
                            {this.props.selectedItems.map(this.renderSelectedItem)}
                            <div className={"multiselect-input-wrapper" + ((this.props.selectedItems.length === 0)? " full-width" : "")}>
                                <input onChange={this.onInputChange}
                                       style={{width: `${this.state.inputFieldWidth}px`}}
                                       value={this.state.input}
                                       ref={this.inputField}
                                       className={(this.props.selectedItems.length === 0)? "full-width" : ""}
                                       placeholder={(this.props.selectedItems.length === 0)? this.props.placeholder : ""}
                                       onKeyPress={this.handleKeyPressInput}/>
                            </div>
                        </div>


                        <MultiSelectDropdownList
                            disabled={this.state.isEditing}
                            onClick={this.focusInputField}
                            suggestions={this.props.suggestions}
                            filteredSuggestions={this.state.filteredSuggestions}
                            displayField={this.state.displayField}
                            onClickCallback={this.handleSuggestionClick}
                            isVisible={this.state.isFocused}
                            maxDisplayedItems={this.props.maxDisplayedItems}
                        />

                        <ItemEdit
                            isEditing={this.state.isEditing}
                            editingItem={this.props.selectedItems[this.state.editingItemIndex]}
                            editingField={this.props.displayField}
                            editCallback={this.onEditCallback}
                            showBelow={this.props.editFieldPosBelow}
                        />
                    </div>
                </div>
            </ClickAwayContainer>
        )
    }
}

const MultiSelectDropdownList = (props) => {
    const {suggestions, filteredSuggestions, displayField, onClickCallback, isVisible, maxDisplayedItems, disabled} = props;

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
        <div className={"multiselect-dropdown-wrapper " + (disabled? "multiselect-elem-disabled":"")}>
            <div className={"dropdown-content " + (isVisible && !disabled? "show":"")}>
                {getItemsToDisplay().map(renderSuggestedItem)}
            </div>
        </div>
    )
}

const ItemEdit = (props) => {
    const {isEditing, editCallback, editingItem, editingField, showBelow} = props;
    const [inputText, setInputText] = useState("");

    const confirm = () => {
        let item = editingItem;
        item[editingField] = inputText;
        editCallback(true, item);
    }

    const discard = () => {
        editCallback(false);
    }

    const onInputChange = (e) => {
        setInputText(e.target.value);
    }

    const handleKeyPressInput = (e) => {
        if (e.key === 'Enter'){
            confirm();
        }
    }

    useEffect(() => {
        if (editingItem !== undefined){
            setInputText(editingItem[editingField]);
        }
    }, [editingItem, editingField])

    return (
        <ClickAwayContainer onBlurCallback={()=>{if (isEditing){discard()}}} >
            <div className={"multiselect-edit-wrapper" + (isEditing? " visible":"") + (!showBelow? " multiselect-absolute-top-above":" multiselect-absolute-top-below")}>
                <div className={"edit-popup-wrapper"}>
                    <div className={"edit-input-field"}>
                        <input value={inputText} onChange={onInputChange} onKeyPress={handleKeyPressInput}/>
                    </div>
                    <div className={"edit-action-buttons"}>
                        <button className={"edit-confirm-button"} onClick={confirm}>&#10003;</button>
                        <button className={"edit-discard-button"} onClick={discard}>&#10006;</button>
                    </div>
                </div>
            </div>
        </ClickAwayContainer>
    )
}