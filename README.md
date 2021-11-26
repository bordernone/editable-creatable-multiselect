# Editable Creatable Multiselect Dropdown For React

A simple multi-select dropdown for react that allows adding custom items to the list and editing existing items.

    npm install editable-creatable-multiselect

## Example Code
```javascript
function App() {
    const [suggestions, setSuggestions] = useState([{name: 'First Suggestion'}, {name: 'Second Suggestion'}]);
    const [selectedList, setSelectedList] = useState([]);

    return (
        <div className="App">
            <MultiSelect
                suggestions={suggestions}
                selectedItems={selectedList}
                updateSuggestions={(newList, added, removed) => {
                    setSuggestions(newList)
                }}
                updateSelectedItems={(newList, added, removed, isCreated) => {
                    setSelectedList(newList)
                }}/>
        </div>
    );
}
```

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)