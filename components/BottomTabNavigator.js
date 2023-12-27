import React, {Component} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TransactionsScreen from '../screens/Transactions';
import SearchScreen from '../screens/Search';
import { render } from 'react-dom';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

export default class BottomTabNavigator extends Component {
    render(){
        return(
        <NavigationContainer>
            <Tab.Navigator
               screenOptions={({route}) => ({
                tabBarIcon: ({focused, color, size}) => {
                    let iconName;
                    if(route.name === 'Transação'){
                        iconName = 'book';
                    } else if (route.name === 'Pesquisa'){
                        iconName = 'search';
                    }

                    return(
                        <Ionicons
                            name={iconName}
                            size={size}
                            color={color}
                        />
                    );
                }
               })}
               tabBarOptions={{
                activeTintColor: "#FFFFFF",
                inactiveTintColor: '#000000',
                style: {
                    height: 130,
                    borderTopWidth: 0,
                    backgroundColor: '#5653d4'
                },
                labelStyle: {
                    fontSize: 20
                },
                labelPosition: 'beside-icon',
                tabStyle: {
                    marginTop: 25,
                    marginLeft: 10,
                    marginRight: 10,
                    borderRadius: 30,
                    borderWidth: 2,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#5653d4'
                }
               }}
            >
            <Tab.Screen name='Transação' component={TransactionsScreen}/>
            <Tab.Screen name='Pesquisa' component={SearchScreen}/>
            </Tab.Navigator>
        </NavigationContainer>
        )
    }
}
