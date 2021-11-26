import MultiSelect from "./lib/index";
import './App.css';
import {useState} from "react";

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
                }}
                displayField={"name"}/>
        </div>
    );
}

export default App;
