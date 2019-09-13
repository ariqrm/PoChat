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

class FriendProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uid: '',
      data: [],
    };
  }
  componentDidMount = async () => {
    const chatId = this.props.navigation.state.params.ChatId;
    await firebase
      .database()
      .ref('users')
      .once('value')
      .then(_res => {
        const data = _res.val()[chatId];
        this.setState({
          data: data,
          uid: chatId,
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
        <Header style={{backgroundColor: '#1E90FF'}}>
          <Left>
            <Button
              transparent
              onPress={() =>
                this.props.navigation.navigate('Chat', {ChatId: this.state.uid})
              }>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Right>
            <Button
              transparent
              onPress={() => this.props.navigation.navigate('Home')}>
              <Icon name="ios-pin" />
            </Button>
          </Right>
        </Header>
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
    elevation: 500,
    marginTop: 10,
    marginLeft: 10,
    maxWidth: 80,
  },
  buttonsText: {
    fontSize: 17,
    fontWeight: 'bold',
  },
});

export default FriendProfile;
