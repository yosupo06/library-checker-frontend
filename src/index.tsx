import ReactDOM from 'react-dom';
import React from 'react';
import App from 'App';

ReactDOM.render(<App />, document.getElementById('root'));
ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById("root")
);
