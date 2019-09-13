import React, {Component} from 'react';
import {Container, Button} from 'native-base';
import {Icon} from 'react-native-elements';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import firebase from 'firebase';

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
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
          this.setState({
            data: data,
          });
        });
    });
  };

  SignOut = async () => {
    this.setState({isLoading: true});
    await firebase
      .database()
      .ref('users/' + this.state.uid)
      .update({
        status: 'offline',
      })
      .then(async () => {
        await AsyncStorage.clear().then(() =>
          this.props.navigation.navigate('Login'),
        );
      });
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
            style={style.bgImage}
          />
          <View style={style.content}>
            <Image
              source={{
                uri: data.image,
              }}
              style={style.userImage}
            />
            <Text> . </Text>
            <Text style={style.buttonsText}>Username</Text>
            <Text style={style.Text}>{data.name}</Text>
            <Text style={style.buttonsText}>Email</Text>
            <Text style={style.Text}>{data.email}</Text>
            <Text style={style.buttonsText}>Phone</Text>
            <Text style={style.Text}>{data.phone}</Text>
          </View>
        </View>
        <Button style={style.buttons} onPress={this.SignOut}>
          <Icon name="logout" type="antdesign" size={30} color="#4a4a4aff" />
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
    right: 3,
    top: 3,
    width: 50,
    height: 50,
    paddingTop: 4,
    paddingLeft: 8,
    position: 'absolute',
    backgroundColor: '#a8a8a8bb',
    borderRadius: 50,
  },
  buttonsText: {
    color: '#4a4a4aff',
    padding: 3,
    fontSize: 25,
    fontWeight: 'bold',
  },
  Text: {
    color: '#595959',
    padding: 3,
    fontSize: 15,
  },
  bgImage: {
    width: '100%',
    height: '100%',
  },
  userImage: {
    width: '100%',
    height: '100%',
    borderRadius: 90,
  },
});

export default Profile;
