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
        }
        chrome.runtime.sendMessage({
            type: 'fetchAlumni'
        }, alumni => {
            this.setState({...this.state, alumni: alumni})
        })
    }

    render() {
        const { alumni } = this.state;
        return (
            <div className="App">
                <ul>
                    {alumni.map(alumnus => (<ul>{alumnus.name}</ul>))}
                </ul>
            </div>
        );
    }
}

export default App;
