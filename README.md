# Editable Creatable Multiselect Dropdown For React

A simple multi-select dropdown for react that allows adding custom items to the list and editing existing items.

    npm install editable-creatable-multiselect

## Demo
See demo at https://moh77.csb.app/

![Alt Text](https://raw.githubusercontent.com/bordernone/editable-creatable-multiselect/master/src/untracked-npm/misc/demo.gif)

## Example Code
```javascript
import MultiSelect from "editable-creatable-multiselect";
import {useState} from "react";

function App() {
    const [suggestions, setSuggestions] = useState([{name: 'Microsoft'}, {name: 'Apple'}, {name: 'Google'}, {name: 'JetBrains'}, {name: 'Airbnb'}, {name: 'Amazon'}, {name: 'Tesla'}, {name: 'NVIDIA'}, {name: 'Samsung'}, {name: 'Netflix'}, {name: 'Palantir'}]);
    const [selectedList, setSelectedList] = useState([]);

    return (
        <div className="App">
            <MultiSelect
                suggestions={suggestions}
                selectedItems={selectedList}
                updateSuggestions={(newList, addedItem, removedItem) => {
                    setSuggestions(newList);
                    console.log(addedItem, removedItem);
                }}
                updateSelectedItems={(newList, addedItem, removedItem, isCreatedByUser) => {
                    setSelectedList(newList);
                    console.log(addedItem, removedItem, isCreatedByUser);
                }}
                displayField={"name"}
                maxDisplayedItems={5}/>
        </div>
    );
}

export default App;
```

## Props Description
| Props                	| Description                                                                                                                                                                          	|
|---------------------	|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------	|
| suggestions         	| a list of objects that are displayed in dropdown. eg: `[{name:"Google"}, {name:"Microsoft"}]`                                                                                          	|
| selectedItems       	| list that contains selected items. Can be empty initially. This list will be used subsequently to show what items are selected                                                       	|
| updateSuggestions   	| a callback function. Triggers if user selects item from the dropdown OR an item is deleted from the selected items.                                                                  	|
| updateSelectedItems 	| a callback function. Triggers if user clicks a selectedItem OR an item is chosen from the dropdown OR an item is deleted from the selected items OR a new item is added to the list. 	|
| displayField      	| Object key that you want to be displayed in the dropdown list and selected items. Default: `"name"`. Eg: if suggestions list is `[{name:"Google"}, {name:"Microsoft"}]`, we can set `displayField={"name"}` |
| maxDisplayedItems     | Maximum number of items that can appear in the list                                                                                                                                    |

## Callbacks

```
updateSuggestions={(newList, addedItem, removedItem) => {
    // Handle callback here
}}
```
### updateSuggestions
| Parameters  	| Desc                                                                                                                                                                                    	|
|-------------	|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------	|
| newList     	| List of items currently in the dropdown list. Note: Item being edited is not in the list. Removed items from user's selection are automatically added to dropdown, hence newList contains removed items. 	|
| addedItem   	| If user removed an item from their selection, it is added to dropdown, hence addedItem contains item that was added to suggestion as a result of it being removed from user selection   	|
| removedItem 	| Contains item removed from dropdown list. If user chooses an item from the dropdown, it's removed from the dropdown list. Note this is different than removedItem in updateSelectedItems callback.          	|


```
updateSelectedItems={(newList, addedItem, removedItem, isCreatedByUser) => {
    // Handle callback here
}}
```
### updateSelectedItems
| Parameters  	| Desc                                                                                                                                                                                    	|
|-------------	|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------	|
| newList     	| List of items currently selected by user. Note: Item being edited is not in the list.                                                                                                  	|
| addedItem   	| New item that is added to user's selection. Can be added from dropdown list or can be added manually by user (if added by user, isCreatedByUser flag is set true.                         |
| removedItem 	| Contains removed item from user's selection. Note: Item being edited is temporarily removed from user's selection. It'd appear here.                                                   	|
| isCreatedByUser 	| Boolean. This is set true whenever a new item is added to the list. Otherwise, false.                                                   	|


![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)