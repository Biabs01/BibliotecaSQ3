import React, {Component} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TransactionsScreen from './screens/Transactions';
import SearchScreen from './screens/Search';
import { render } from 'react-dom';

const Tab = createBottomTabNavigator();

export default function App() {
    return(
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen name='Transação' component={TransactionsScreen}/>
          <Tab.Screen name='Pesquisa' component={SearchScreen}/>
        </Tab.Navigator>
      </NavigationContainer>
    )
}

