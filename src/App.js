import MultiSelect from "./lib/index";
import './App.css';
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
                placeholder={"Type the name of the desired company or choose one."}/>
        </div>
    );
}

export default App;
