import React from 'react';
import BasicLayout from "./components/BasicLayout";
import {AuthProvider} from "./service/AuthContext";

const App = () => {

    return (
        <AuthProvider>
            <BasicLayout/>
        </AuthProvider>
    );

};
window.addEventListener('beforeunload', function () {
    localStorage.removeItem('isLoggedIn');
});


export default App;
