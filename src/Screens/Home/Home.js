import React from 'react';
import {
  Text,
  TextInput,
  FlatList,
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
// import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';

class Home extends React.Component {
  // static navigationOptions = {
  //   title: 'Home',
  //   headerStyle: {
  //     backgroundColor: '#f4511e',
  //   },
  //   headerTintColor: '#fff',
  //   headerTitleStyle: {
  //     fontWeight: 'bold',
  //   },
  // };
  constructor(props) {
    super(props);
    this.state = {
      phone: '',
    };
  }
  componentDidMount = () => {
    AsyncStorage.getItem('@Key').then(res => {
      this.setState({phone: res});
    });
  };
  SignOut = async () => {
    await AsyncStorage.clear().then(() =>
      this.props.navigation.navigate('Login'),
    );
  };
  render() {
    return (
      <View>
        {/* <Text>{this.state.phone}</Text>
        <TouchableOpacity onPress={this.SignOut}>
          <Text>Sign Out</Text>
        </TouchableOpacity> */}
        {/* <View style={styles.container}>
          <MapView
            provider={PROVIDER_GOOGLE} // remove if not using Google Maps
            style={styles.map}
            region={{
              latitude: -7.78825,
              longitude: 117.4324,
              latitudeDelta: 10.015,
              longitudeDelta: 10.0121,
            }}
          />
        </View> */}
      </View>
    );
  }
}

export default Home;
const styles = StyleSheet.create({
  container: {
    // ...StyleSheet.absoluteFillObject,
    // height: 400,
    // width: 400,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    // ...StyleSheet.absoluteFillObject,
    height: '100%',
    width: '100%',
  },
});
