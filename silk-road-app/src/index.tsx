import React from 'react';
import ReactDOM from 'react-dom';
// import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {Map, View} from "ol";
import {SilkRoadManager} from "./models/SilkRoadManager";


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

const ReactDOMCaller = (map?: Map, view?: View) => {
    const silkRoadManager = new SilkRoadManager(
        map,
        view
    );
    ReactDOM.render(
        <React.StrictMode>
            <App silkRoadManager={silkRoadManager} />
        </React.StrictMode>,
        document.getElementById('react-container')
    );
}

// @ts-ignore
if (window.Oskari) {
// @ts-ignore
    window.ReactDOMCaller = ReactDOMCaller;
} else {
    ReactDOMCaller(undefined,undefined);
}
