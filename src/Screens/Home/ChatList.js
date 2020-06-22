import React from 'react';
import {
  StatusBar,
  FlatList,
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import firebase from 'firebase';
import {Text, List, ListItem, Left, Right, Body, Thumbnail} from 'native-base';

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
      this.usersListener = firebase.database().ref('users');
      this.usersListener.on('value', _res => {
        const data = Object.keys(_res.val()).map(Key => {
          if (Key !== this.state.uid) {
            return _res.val()[Key];
          }
        });
        this.setState({
          dataUser: data,
        });
      });
    });
  };
  componentWillUnmount = () => {
    this.usersListener.off();
  };
  renderItem = ({item}) => {
    if (item) {
      return (
        <List>
          <ListItem
            thumbnail
            // avatar
            onLongPress={() =>
              this.props.navigation.navigate('FriendProfile', {
                ChatId: item.uid,
              })
            }
            onPress={() =>
              this.props.navigation.navigate('Chat', {ChatId: item.uid})
            }>
            <Left>
              <Thumbnail source={{uri: item.image || ''}} />
            </Left>
            <Body>
              <Text>
                <View
                  style={
                    item.status === 'online'
                      ? styles.connect
                      : styles.disconnect
                  }
                />{' '}
                {item.name}
              </Text>
              <Text note numberOfLines={1}>
                {item.lastMessage || 'Belum ada pesan sama sekali.'}
              </Text>
            </Body>
            {/* <Right>
              <Text note>3:43 pm</Text>
            </Right> */}
          </ListItem>
        </List>
      );
    }
  };
  render() {
    return (
      <View>
        <StatusBar
          // translucent
          backgroundColor="#1E90FF"
          barStyle="default"
        />
        {this.state.dataUser.length === 0 ? (
          <View />
        ) : (
          <FlatList
            data={this.state.dataUser}
            keyExtractor={(item, index) => {
              return `item${1 + index}${index}`;
            }}
            renderItem={this.renderItem}
          />
        )}
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
});
