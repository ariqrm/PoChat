import React from 'react';
// import {Text, TextInput, FlatList, View, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import firebase from 'firebase';
import {GiftedChat} from 'react-native-gifted-chat';

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
    console.warn(this.state.image);
    return (
      <GiftedChat
        text={this.state.text}
        messages={this.state.messagesList}
        onSend={this.sendMessage}
        user={{
          _id: this.state.uid,
          name: this.state.name,
          avatar: this.state.image,
        }}
        onInputTextChanged={val => this.setState({text: val})}
      />
    );
  }
}

export default Chat;
