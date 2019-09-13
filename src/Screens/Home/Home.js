import React from 'react';
import {
  Text,
  TextInput,
  FlatList,
  View,
  PermissionsAndroid,
  TouchableOpacity,
  Permission,
  StyleSheet,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import geolocation from '@react-native-community/geolocation';
import firebase from 'firebase';

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
      uid: '',
      mapRegion: null,
      lastLat: null,
      lastLong: null,
      data: [],
    };
  }
  componentWillUnmount() {
    geolocation.stopObserving();
  }
  componentDidMount = async () => {
    // await PermissionsAndroid.request(
    //   PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    //   {
    //     title: 'Cool Photo App Camera Permission',
    //     message:
    //       'Cool Photo App needs access to your camera ' +
    //       'so you can take awesome pictures.',
    //     buttonNeutral: 'Ask Me Later',
    //     buttonNegative: 'Cancel',
    //     buttonPositive: 'OK',
    //   },
    // );
    AsyncStorage.getItem('@Key').then(res => {
      this.setState({uid: res});
    });
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    // console.warn(granted);
    if (granted) {
      geolocation.watchPosition(
        position => {
          let region = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: 0.00922 * 1.5,
            longitudeDelta: 0.00421 * 1.5,
          };
          let LatLng = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          // console.warn(LatLng);
          firebase
            .database()
            .ref('users/' + this.state.uid + '/location')
            .update(LatLng);
          this.onRegionChange(region, region.latitude, region.longitude);
          this.nearby();
        },
        error => console.warn('eeror', error),
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
          distanceFilter: 1,
        },
      );
      // console.warn('You can use the ACCESS_FINE_LOCATION');
    } else {
      console.warn('ACCESS_FINE_LOCATION permission denied');
    }
  };
  onRegionChange(region, lastLat, lastLong) {
    this.setState({
      mapRegion: region,
      // // If there are no new values set the current ones
      lastLat: lastLat || this.state.lastLat,
      lastLong: lastLong || this.state.lastLong,
    });
  }
  async nearby() {
    await firebase
      .database()
      .ref('users')
      .once('value')
      .then(_res => {
        const data = Object.keys(_res.val()).map(Key => {
          return _res.val()[Key];
        });
        this.setState({
          data: data,
        });
      });
  }
  Chat = Chatid => {
    if (Chatid !== this.state.uid) {
      this.props.navigation.navigate('Chat', {
        ChatId: Chatid,
      });
    }
  };
  SignOut = async () => {
    await AsyncStorage.clear().then(() =>
      this.props.navigation.navigate('Login'),
    );
  };
  render() {
    // console.warn('map', this.state.data);
    return (
      <View style={styles.container}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          showsUserLocation={true}
          followUserLocation={true}
          zoomControlEnabled={true}
          showsCompass={true}
          minZoomLevel={0} // default => 0
          maxZoomLevel={20}
          region={this.state.mapRegion}>
          {this.state.data.map(item => (
            <Marker
              key={item.location}
              title={item.name || 's'}
              description={item.status || 's'}
              onCalloutPress={() => this.Chat(item.uid)}
              coordinate={
                item.location || {
                  latitude: 20,
                  longitude: 20,
                }
              }>
              <View>
                <Image
                  source={{
                    uri: item.image,
                  }}
                  style={{width: 40, height: 40, borderRadius: 55}}
                />
              </View>
            </Marker>
          ))}
        </MapView>
      </View>
    );
  }
}

export default Home;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // ...StyleSheet.absoluteFillObject,
    // height: 400,
    // width: 400,
    // justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    // ...StyleSheet.absoluteFillObject,
    height: '100%',
    width: '100%',
  },
});
