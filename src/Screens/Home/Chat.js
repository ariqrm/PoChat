import React, {Fragment} from 'react';
// import {Text, TextInput, FlatList, View, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import firebase from 'firebase';
import {GiftedChat, Send, Bubble, Day} from 'react-native-gifted-chat';
import {
  Header,
  Left,
  Body,
  Right,
  Button,
  Icon,
  Text,
  View,
  Subtitle,
} from 'native-base';
import {Image, Dimensions, TextInput} from 'react-native';
import {StylesHome} from './StylesHome';

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
    this.fblistener = await firebase
      .database()
      .ref('messages')
      .child(this.state.uid)
      .child(chatId);
    this.fblistener.on('child_added', value => {
      this.setState(previousState => {
        return {
          messagesList: GiftedChat.append(
            previousState.messagesList,
            value.val(),
          ),
        };
      });
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
  };
  componentWillUnmount = () => {
    this.fblistener.off();
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
      firebase
        .database()
        .ref(`users/${chatId}`)
        .update({
          lastMessage: this.state.text,
        });
      this.setState({
        text: '',
      });
    }
  };
  renderSend = props => {
    return (
      <Send {...props} onSend={this.sendMessage}>
        <View style={StylesHome.renderSendView}>
          <Icon name="send" style={StylesHome.renderSendIcon} />
        </View>
      </Send>
    );
  };
  renderDay = props => {
    return (
      <Day
        {...props}
        wrapperStyle={StylesHome.wrapperStyleDay}
        textStyle={StylesHome.wrapperTextStyleDay}
      />
    );
  };
  renderBubble = props => {
    return (
      <Bubble
        {...props}
        textStyle={{
          right: {
            color: 'white',
          },
          left: {
            color: '#595959',
          },
        }}
        containerStyle={{
          right: {
            paddingBottom: 6.5,
          },
          left: {
            paddingBottom: 6.5,
          },
        }}
        bottomContainerStyle={
          {
            //   right: {backgroundColor: 'red'},
          }
        }
        wrapperStyle={{
          left: {
            backgroundColor: '#e8e8e8',
          },
          right: {
            backgroundColor: '#33A6EA',
          },
        }}
      />
    );
  };
  renderToBottom = props => {
    return (
      <View style={StylesHome.renderToBottomView}>
        <Icon name="ios-arrow-down" style={StylesHome.renderToBottomIcon} />
      </View>
    );
  };
  renderTextInput = props => {
    return (
      <View style={StylesHome.renderTextInput}>
        <TextInput
          {...props}
          placeholder={'Pesan'}
          multiline={true}
          onSend={this.sendMessage}
          value={this.state.text}
          onChangeText={val =>
            this.setState({
              text: val,
            })
          }
          style={StylesHome.renderChangeTextInput}
        />
      </View>
    );
  };
  render() {
    const data = this.state;
    return (
      <Fragment>
        <Header style={StylesHome.headStyle}>
          <Left style={StylesHome.headLeft}>
            <Button
              transparent
              onPress={() => this.props.navigation.navigate('ChatList')}>
              <Icon name="arrow-back" />
            </Button>
            <Image
              style={StylesHome.headImage}
              source={{uri: data.FriendsInfo.image}}
            />
            <View style={StylesHome.headWrapperTitle}>
              <Text
                numberOfLines={1}
                lineBreakMode={'tail'}
                style={StylesHome.headTitle}>
                {data.FriendsInfo.name || ''}
              </Text>
              <Text style={StylesHome.headStatus}>
                {data.FriendsInfo.status || ''}
              </Text>
            </View>
          </Left>
          <Right style={StylesHome.headRight}>
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
          }}
          onInputTextChanged={val => this.setState({text: val})}
          renderSend={this.renderSend}
          renderBubble={this.renderBubble}
          alwaysShowSend={true}
          alignTop={true}
          scrollToBottom={true}
          scrollToBottomComponent={this.renderToBottom}
          renderAvatar={null}
          renderDay={this.renderDay}
          renderComposer={this.renderTextInput}
        />
      </Fragment>
    );
  }
}

export default Chat;
