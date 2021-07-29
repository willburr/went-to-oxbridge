import * as React from "react";
import "./App.css";

type IState = {
    alumni: {
       name: string;
       university: string;
    }[]
}

class App extends React.Component<object, IState> {
    constructor(props: {}) {
        super(props);
        this.state = {
            alumni: []
        };
        chrome.tabs.query({active: true, currentWindow: true}, tabs => {
            // @ts-ignore
            chrome.tabs.sendMessage(tabs[0].id, {type: "requestSeenAlumni"}, response => {
                this.setState({...this.state, alumni: response})
            });
        });
    }

    render() {
        const { alumni } = this.state;
        return (
            <div className="App">
                <ul>
                    {alumni.map(alumnus => (<ul>{alumnus}</ul>))}
                </ul>
            </div>
        );
    }
}

export default App;
