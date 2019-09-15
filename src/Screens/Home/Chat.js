import React, {Fragment} from 'react';
// import {Text, TextInput, FlatList, View, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import firebase from 'firebase';
import {GiftedChat} from 'react-native-gifted-chat';
import {Header, Left, Body, Right, Button, Icon, Title} from 'native-base';
import {Image} from 'react-native';

class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      phone: '',
      name: '',
      uid: '',
      image: '',
      status: '',
      text: '',
      messagesList: [],
      FriendsInfo: {},
    };
  }
  componentDidMount = async () => {
    const chatId = this.props.navigation.state.params.ChatId;
    this.setState({
      uid: await AsyncStorage.getItem('@Key'),
      name: await AsyncStorage.getItem('name'),
      image: await AsyncStorage.getItem('image'),
    });
    await firebase
      .database()
      .ref('messages')
      .child(this.state.uid)
      .child(chatId)
      .on('child_added', value => {
        this.setState(previousState => {
          return {
            messagesList: GiftedChat.append(
              previousState.messagesList,
              value.val(),
            ),
          };
        });
        // console.warn(value.val(), 'mmsdsj');
      });
    await firebase
      .database()
      .ref('users')
      .once('value')
      .then(_res => {
        const data = _res.val()[chatId];
        this.setState({
          FriendsInfo: data,
        });
      });
    await firebase
      .database()
      .ref('users')
      .on('value')
      .then(_res => {
        const data = _res.val()[chatId];
        this.setState({
          FriendsInfo: data,
        });
      });
  };
  sendMessage = () => {
    if (this.state.text.length > 0) {
      const chatId = this.props.navigation.state.params.ChatId;
      let msgId = firebase
        .database()
        .ref('messages')
        .child(this.state.uid)
        .child(chatId)
        .push().key;
      let updates = {};
      let message = {
        _id: msgId,
        text: this.state.text,
        createdAt: firebase.database.ServerValue.TIMESTAMP,
        user: {
          _id: this.state.uid,
          name: this.state.name,
          avatar: this.state.image,
        },
      };
      updates[
        'messages/' + this.state.uid + '/' + chatId + '/' + msgId
      ] = message;
      updates[
        'messages/' + chatId + '/' + this.state.uid + '/' + msgId
      ] = message;
      firebase
        .database()
        .ref()
        .update(updates);
      this.setState({
        text: '',
      });
    }
  };
  render() {
    const data = this.state;
    return (
      <Fragment>
        <Header style={{backgroundColor: '#1E90FF'}}>
          <Left>
            <Button
              transparent
              onPress={() => this.props.navigation.navigate('ChatList')}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Left>
            <Image
              style={{height: 40, width: 40, borderRadius: 60}}
              source={{uri: data.FriendsInfo.image}}
            />
          </Left>
          <Body>
            <Title>{data.FriendsInfo.name || 'wait'}</Title>
          </Body>
          <Right>
            {/* <Button transparent>
              <Icon name="ios-videocam" />
            </Button>
            <Button transparent>
              <Icon name="call" />
            </Button> */}
            <Button
              transparent
              onPress={() =>
                this.props.navigation.navigate('FriendProfile', {
                  ChatId: data.FriendsInfo.uid,
                })
              }>
              <Icon name="more" />
            </Button>
          </Right>
        </Header>
        <GiftedChat
          text={data.text}
          messages={data.messagesList}
          onSend={this.sendMessage}
          user={{
            _id: data.uid,
            name: data.name,
            avatar: data.image,
          }}
          onInputTextChanged={val => this.setState({text: val})}
        />
      </Fragment>
    );
  }
}

export default Chat;
