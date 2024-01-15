import React, {Component} from 'react';
import BottomTabNavigator from './components/BottomTabNavigator';
import Login from './screens/Login';
import {createSwitchNavigator, createAppContainer} from 'react-navigation';

export default class App extends Component{
    render() {
      return <AppContainer/>
    }
}

const AppSwitchNavigator = createSwitchNavigator(
  {
    Login: {
      screen: Login
    },
    BottomTab: {
      screen: BottomTabNavigator
    },
    initialRouteName: "Login"
  }
);

const AppContainer = createAppContainer(AppSwitchNavigator)