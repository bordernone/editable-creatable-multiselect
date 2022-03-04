# Editable Creatable Multiselect Dropdown For React

A simple multi-select dropdown for react that allows adding custom items to the list and editing existing items.

    npm install editable-creatable-multiselect

## Demo
See demo at https://moh77.csb.app/

## Example Code
```javascript
import MultiSelect from "editable-creatable-multiselect";
import {useState} from "react";

function App() {
    const [suggestions, setSuggestions] = useState([{name: 'Microsoft', id:1}, {name: 'Apple', id:2}, {name: 'Google', id:3}, {name: 'JetBrains', id:4}, {name: 'Airbnb', id:5}, {name: 'Amazon', id:6}, {name: 'Tesla', id:7}, {name: 'NVIDIA', id:8}, {name: 'Samsung', id:9}, {name: 'Netflix', id:10}, {name: 'Palantir', id:11}]);
    const [selectedList, setSelectedList] = useState([]);

    return (
        <div className="App">
            <MultiSelect
                suggestions={suggestions}
                selectedItems={selectedList}
                updateSuggestions={(response) => {
                    console.log("suggestion: ")
                    console.log(response);
                    setSuggestions(response.list);
                }}
                updateSelectedItems={(response) => {
                    console.log("selection: ")
                    console.log(response);
                    // let's add removed items to the suggestion
                    if (response.removedItem){
                        setSuggestions([...suggestions, response.removedItem]);
                    }
                    setSelectedList(response.list);
                }}
                displayField={"name"}
                maxDisplayedItems={5}
                disabled={false}
                editFieldPosBelow={true}
                autoAddOnBlur={false}
                placeholder={"Type the name of the desired company or choose one."}/>
        </div>
    );
}

export default App;

```

## Props Description
| Props                	 | Description                                                                                                                                                                          	                      |
|------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| suggestions         	  | a list of objects that are displayed in dropdown. eg: `[{name:"Google"}, {name:"Microsoft"}]`                                                                                          	                    |
| selectedItems       	  | list that contains selected items. Can be empty initially. This list will be used subsequently to show what items are selected                                                       	                      |
| updateSuggestions   	  | a callback function. Triggers if user selects item from the dropdown OR an item is deleted from the selected items.                                                                  	                      |
| updateSelectedItems 	  | a callback function. Triggers if user clicks a selectedItem OR an item is chosen from the dropdown OR an item is deleted from the selected items OR a new item is added to the list. 	                      |
| displayField      	    | Object key that you want to be displayed in the dropdown list and selected items. Default: `"name"`. Eg: if suggestions list is `[{name:"Google"}, {name:"Microsoft"}]`, we can set `displayField={"name"}` |
| maxDisplayedItems      | Maximum number of items that can appear in the list.  [Optional]                                                                                                                                            |
| placeholder            | Placeholder for the input field.  [Optional]                                                                                                                                                                |
| disabled               | Boolean. Whether the component is disabled or enabled. [Optional]                                                                                                                                           |
| editFieldPosBelow      | Boolean. Whether the edit box should appear downwards or upwards. Default: false. [Optional]                                                                                                                |
| autoAddOnBlur          | Boolean. When the input loses focus, should text in input box automatically be added to the list? Default: false. [Optional]                                                                                |

## Callbacks

### updateSuggestions

```
updateSuggestions={(responseObject) => {
    // Handle callback here
}}
```

#### responseObject properties
| Parameters  	 | Desc                                                                                                                                                                                    	                     |
|---------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| list     	    | List of items currently in the dropdown list.  	                                                                                                                                                              |
| removedItem 	 | Contains item removed from dropdown list. If user chooses an item from the dropdown, it's removed from the dropdown list. Note this is different than removedItem in updateSelectedItems callback.          	 |

---

### updateSelectedItems

```
updateSelectedItems={(responseObject) => {
    // Handle callback here
}}
```
#### responseObject properties
| Parameters  	     | Desc                                                                                                                                                                                    	 |
|-------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| list     	        | List of items currently selected by user.                                                                                                   	                                             |
| addedItem   	     | New item that is added to user's selection. Can be added from dropdown list or can be added manually by user (if added by user, isCreatedByUser flag is set true.                         |
| removedItem 	     | Contains item that has been deleted by user.                                                 	                                                                                            |
| isCreatedByUser 	 | Boolean. This is set true whenever a new item is added to the list. Otherwise, false.                                                   	                                                 |
| editedItem        | Item that has been edited by the user. If not edited, it's undefined.                                                                                                                     |


![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)