import React from 'react';
import BasicLayout from "./components/BasicLayout";

const App = () => {

    return (
        <BasicLayout/>
    );

};
window.addEventListener('beforeunload', function () {
    localStorage.removeItem('isLoggedIn');
});


export default App;
