import React from 'react';
import {ActivityIndicator, StatusBar, View, StyleSheet} from 'react-native';
import {Icon} from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';
import firebase from 'firebase';

export default class AuthLoadingSrceen extends React.Component {
  constructor(props) {
    super(props);
    this.checkAuth();
  }
  checkAuth = () => {
    setTimeout(() => {
      AsyncStorage.getItem('@Key').then(res =>
        res
          ? this.props.navigation.navigate('Home')
          : this.props.navigation.navigate('Login'),
      );
    }, 1000);
  };
  componentDidMount = () => {
    // Your web app's Firebase configuration
    var firebaseConfig = {
      apiKey: 'AIzaSyA61It_m7h7vcRfWk944kjPtpKFT3AdNHM',
      authDomain: 'chatpo-841a9.firebaseapp.com',
      databaseURL: 'https://chatpo-841a9.firebaseio.com',
      projectId: 'chatpo-841a9',
      storageBucket: '',
      messagingSenderId: '196648436557',
      appId: '1:196648436557:web:ffa49d821d8e3a2bc9ed04',
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
  };

  render() {
    return (
      <View style={Styles.background}>
        <Icon
          name={'pinterest'}
          style={Styles.icons}
          type="font-awesome"
          size={90}
          color="#fff"
        />
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

const Styles = StyleSheet.create({
  icons: {
    backgroundColor: '#1E90FF',
  },
  background: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1E90FF',
  },
});
