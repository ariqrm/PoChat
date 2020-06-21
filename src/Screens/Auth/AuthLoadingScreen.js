import React from 'react';
import {
  ActivityIndicator,
  StatusBar,
  View,
  StyleSheet,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

export default class AuthLoadingSrceen extends React.Component {
  constructor(props) {
    super(props);
    this.checkAuth();
  }
  checkAuth = () => {
    setTimeout(() => {
      AsyncStorage.getItem('@Key').then(res =>
        res
          ? this.props.navigation.navigate('ChatList')
          : this.props.navigation.navigate('Login'),
      );
    }, 1000);
  };

  render() {
    return (
      <View style={Styles.background}>
        <Image
          style={Styles.icons}
          source={require('../../Assets/pochat-2-01.png')}
        />
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

const Styles = StyleSheet.create({
  icons: {
    height: 90,
    width: 90,
    backgroundColor: '#1E90FF',
  },
  background: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1E90FF',
  },
});
