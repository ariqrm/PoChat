import React from 'react';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {createMaterialTopTabNavigator} from 'react-navigation-tabs';
import Login from './src/Screens/Auth/Login';
import Register from './src/Screens/Auth/Register';
import Home from './src/Screens/Home/Home';
import Profile from './src/Screens/Home/Profile';
import Chat from './src/Screens/Home/Chat';
import ChatList from './src/Screens/Home/ChatList';
import AuthLoadingSrceen from './src/Screens/Auth/AuthLoadingScreen';

const MainAuth = createSwitchNavigator({
  Login: {
    screen: Login,
    title: 'Login',
  },
  Register: {
    screen: Register,
    title: 'Register',
  },
});

const MainHome = createMaterialTopTabNavigator({
  Home: {
    screen: Home,
    title: 'Home',
  },
  ChatList: {
    screen: ChatList,
    title: 'Chat',
  },
  Profile: {
    screen: Profile,
    title: 'Profile',
  },
});

const AuthStack = createStackNavigator(
  {
    Login: MainAuth,
  },
  {
    headerMode: 'none',
  },
);

const HomeStack = createStackNavigator(
  {
    App: MainHome,
    Chat: {
      screen: Chat,
    },
  },
  {
    headerMode: 'none',
  },
);

const App = createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: AuthLoadingSrceen,
      AuthStack,
      HomeStack,
    },
    {
      initialRouteName: 'AuthLoading',
    },
  ),
);

export default App;
