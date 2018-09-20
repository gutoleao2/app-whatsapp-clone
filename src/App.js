import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import firebase from 'firebase';
import ReduxThunk from 'redux-thunk';

import Routes from './Routes';
import reducers from './reducers/index';

export default class App extends Component {

  componentWillMount() {
    // Initialize Firebase  
    var config = {
      apiKey: "x",
      authDomain: "x",
      databaseURL: "x",
      projectId: "x",
      storageBucket: "x",
      messagingSenderId: "x"
    };

    firebase.initializeApp(config);
  }

  render() {
    return(
       //** Inserir o provider aqui significa dizer que toda a aplicação irá fluir dentro deste elemento **/
      <Provider store={ createStore(reducers, {}, applyMiddleware(ReduxThunk)) } >
        <Routes />
      </Provider>
    );
  }
} 
 