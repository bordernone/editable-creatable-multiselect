import MultiSelect from "./lib/index";
import './App.css';
import {useState} from "react";

function App() {
    const [suggestions, setSuggestions] = useState([{name: 'Microsoft'}, {name: 'Apple'}, {name: 'Google'}, {name: 'JetBrains'}, {name: 'Airbnb'}, {name: 'Amazon'}, {name: 'Tesla'}, {name: 'NVIDIA'}, {name: 'Samsung'}, {name: 'Netflix'}, {name: 'Palantir'}]);
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
                displayField={"name"}
                maxDisplayedItems={5}/>
        </div>
    );
}

export default App;
