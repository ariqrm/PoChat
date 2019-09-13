import React, {Component} from 'react';
import {
  Container,
  Header,
  Left,
  Body,
  Right,
  Title,
  Button,
  Icon,
} from 'native-base';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import firebase from 'firebase';

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uid: '',
      data: [],
    };
  }
  componentDidMount = async () => {
    AsyncStorage.getItem('@Key').then(res => {
      this.setState({uid: res});
      firebase
        .database()
        .ref('users')
        .once('value')
        .then(_res => {
          const data = _res.val()[res];
          // if (data.uid === res) {
          this.setState({
            data: data,
          });
          // }
          // console.log(this.state.data);
        });
    });
  };

  SignOut = async () => {
    await AsyncStorage.clear().then(() =>
      this.props.navigation.navigate('Login'),
    );
  };
  render() {
    const data = this.state.data;
    return (
      <Container>
        <View style={style.body}>
          <Image
            source={{
              uri:
                'https://i.pinimg.com/originals/13/d6/81/13d681b20058a2d6261432a1b69cd781.jpg',
            }}
            style={{width: '100%', height: '100%'}}
          />
          <View style={style.content}>
            <Image
              source={{
                uri: data.image,
              }}
              style={{width: '100%', height: '100%', borderRadius: 90}}
            />
            <Text> . </Text>
            <Text style={style.buttonsText}>Username</Text>
            <Text>{data.name}</Text>
            <Text style={style.buttonsText}>Email</Text>
            <Text>{data.email}</Text>
            <Text style={style.buttonsText}>Phone</Text>
            <Text>{data.phone}</Text>
          </View>
        </View>
        <Button style={style.buttons} transparent light onPress={this.SignOut}>
          <Text style={style.buttonsText}>Sign Out</Text>
        </Button>
      </Container>
    );
  }
}

const style = StyleSheet.create({
  body: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '30%',
    backgroundColor: '#5f27cd',
    position: 'relative',
  },
  content: {
    // justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    width: 150,
    height: 150,
    right: '30%',
    bottom: -70,
    backgroundColor: '#a8a8a8bb',
    borderColor: '#a8a8a8bb',
    borderWidth: 5,
    borderRadius: 90,
  },
  buttons: {
    elevation: 500,
    marginTop: 10,
    marginLeft: 10,
    maxWidth: 80,
    // textAlign: 'center',
  },
  buttonsText: {
    fontSize: 17,
    fontWeight: 'bold',
  },
});

export default Profile;
