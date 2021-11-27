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
    const [suggestions, setSuggestions] = useState([{name: 'First Suggestion'}, {name: 'Second Suggestion'}]);
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
            />
        </div>
    );
}

export default App;
```

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)