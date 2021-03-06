import React from 'react';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {Root, Icon} from 'native-base';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import Login from './src/Screens/Auth/Login';
import Register from './src/Screens/Auth/Register';
import Home from './src/Screens/Home/Home';
import Profile from './src/Screens/Home/Profile';
import Chat from './src/Screens/Home/Chat';
import ChatList from './src/Screens/Home/ChatList';
import FriendProfile from './src/Screens/Home/FriendProfile';
import AuthLoadingSrceen from './src/Screens/Auth/AuthLoadingScreen';
import firebase from 'firebase';
import {firebaseConfig} from './src/Configs/firebase';

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

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

const MainHome = createBottomTabNavigator({
  ChatList: {
    screen: ChatList,
    navigationOptions: {
      tabBarLabel: 'Chat',
      tabBarIcon: () => {
        return <Icon name="comment" type="EvilIcons" size={30} />;
      },
      tabBarOptions: {
        activeTintColor: '#1E90FF',
        inactiveTintColor: 'gray',
        style: {
          backgroundColor: 'white',
        },
        showIcon: true,
      },
    },
  },
  Home: {
    screen: Home,
    navigationOptions: {
      tabBarLabel: 'Map',
      tabBarIcon: () => {
        return <Icon name="location" type="EvilIcons" size={30} />;
      },
      tabBarOptions: {
        activeTintColor: '#1E90FF',
        inactiveTintColor: 'gray',
        style: {
          backgroundColor: 'white',
        },
        showIcon: true,
      },
    },
  },
  Profile: {
    screen: Profile,
    navigationOptions: {
      tabBarLabel: 'Profile',
      tabBarIcon: () => {
        return <Icon name="user" type="EvilIcons" size={30} />;
      },
      tabBarOptions: {
        activeTintColor: '#1E90FF',
        inactiveTintColor: 'gray',
        style: {
          backgroundColor: 'white',
        },
        showIcon: true,
      },
    },
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
    FriendProfile: {
      screen: FriendProfile,
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

export default () => (
  <Root>
    <App />
  </Root>
);
