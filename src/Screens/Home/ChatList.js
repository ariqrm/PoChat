import React from 'react';
import {
  Text,
  StatusBar,
  FlatList,
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import firebase from 'firebase';
import {Toast} from 'native-base';

class ChatList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      uid: '',
      dataUser: [],
      dataMessages: [],
    };
  }
  componentDidMount = () => {
    AsyncStorage.getItem('@Key').then(res => {
      this.setState({uid: res});
      firebase
        .database()
        .ref('users')
        .on('value', _res => {
          const data = Object.keys(_res.val()).map(Key => {
            return _res.val()[Key];
          });
          this.setState({
            dataUser: data,
          });
        });
      firebase
        .database()
        .ref('messages/' + res)
        .on('value', _res => {
          const data = Object.keys(_res.val());
          this.setState({
            dataMessages: data,
          });
        });
    });
  };
  render() {
    const messages = this.state.dataMessages;
    return (
      <View>
        <StatusBar
          // translucent
          backgroundColor="#1E90FF"
          barStyle="default"
        />
        <FlatList
          key={messages.length}
          data={this.state.dataUser}
          keyExtractor={item => {
            return item.uid;
          }}
          renderItem={post => {
            const item = post.item;
            console.log(post, messages);
            if (messages.includes(item.uid)) {
              return (
                <View
                  style={
                    item.uid === this.state.uid
                      ? {display: 'none'}
                      : styles.card
                  }>
                  <View style={styles.cardContent}>
                    <Image
                      style={styles.cardImage}
                      source={{uri: item.image}}
                    />
                  </View>
                  <Text
                    style={styles.cardTitle}
                    onLongPress={() =>
                      this.props.navigation.navigate('FriendProfile', {
                        ChatId: item.uid,
                      })
                    }
                    onPress={() =>
                      this.props.navigation.navigate('Chat', {ChatId: item.uid})
                    }>
                    {item.name}
                  </Text>
                  <Text style={styles.cardChat}>
                    <View
                      style={
                        item.status === 'online'
                          ? styles.connect
                          : styles.disconnect
                      }
                    />{' '}
                    {item.status}
                  </Text>
                </View>
              );
            }
          }}
        />
      </View>
    );
  }
}

export default ChatList;

const styles = StyleSheet.create({
  connect: {
    height: 7,
    width: 7,
    backgroundColor: 'green',
    borderRadius: 10,
    margin: 1,
  },
  disconnect: {
    height: 7,
    width: 7,
    backgroundColor: 'red',
    borderRadius: 10,
    margin: 1,
  },
  card: {
    flex: 1,
    backgroundColor: 'transparent',
    margin: 10,
    height: 60,
    borderBottomWidth: 0.2,
  },
  cardContent: {
    top: '0.00%',
    left: '0.00%',
    width: 50,
    height: 50,
  },
  cardImage: {
    top: '0.00%',
    left: '0.00%',
    width: 50,
    height: 50,
    backgroundColor: 'transparent',
    borderRadius: 60,
    borderColor: 'transparent',
  },
  cardTitle: {
    top: '12.73%',
    left: '19.76%',
    backgroundColor: 'transparent',
    color: 'rgba(22,31,61,1)',
    position: 'absolute',
    width: '50%',
    height: 50,
    opacity: 8,
    fontSize: 15,
    fontFamily: 'montserrat-medium',
  },
  cardChat: {
    top: '52.73%',
    left: '19.76%',
    backgroundColor: 'transparent',
    color: 'rgba(22,31,61,1)',
    position: 'absolute',
    width: 50,
    height: 50,
    opacity: 0.65,
    fontSize: 13,
    fontFamily: 'montserrat-regular',
  },
  cardTime: {
    top: '63.64%',
    left: '85.03%',
    backgroundColor: 'transparent',
    color: 'rgba(22,31,61,1)',
    opacity: 0.4,
    width: 50,
    height: 50,
    fontSize: 10,
    fontFamily: 'montserrat-regular',
    textAlign: 'right',
  },
});
