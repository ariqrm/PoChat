import React from 'react';
import {
  Text,
  TextInput,
  FlatList,
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import firebase from 'firebase';

class ChatList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      uid: '',
      data: [],
    };
  }
  componentDidMount = () => {
    AsyncStorage.getItem('@Key').then(res => {
      this.setState({uid: res});
      firebase
        .database()
        .ref('users')
        .once('value')
        .then(_res => console.log(_res.val()));
      firebase
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
          // console.log(this.state.data);
        });
    });
  };
  render() {
    return (
      <View>
        <FlatList
          data={this.state.data}
          keyExtractor={item => {
            return item.uid;
          }}
          renderItem={post => {
            const item = post.item;
            if (item.uid !== this.state.uid) {
              return (
                <View style={styles.card}>
                  <View style={styles.cardContent}>
                    <Image
                      style={styles.cardImage}
                      source={{uri: item.image}}
                    />
                  </View>
                  <Text
                    style={styles.cardTitle}
                    onPress={() =>
                      this.props.navigation.navigate('Chat', {ChatId: item.uid})
                    }>
                    {item.name}
                  </Text>
                  <Text style={styles.cardChat}>{item.status}</Text>
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
  card: {
    flex: 1,
    backgroundColor: 'transparent',
    margin: 10,
    // padding: 10,
    height: 60,
    borderBottomWidth: 0.2,
    // backgroundColor: 'red',
  },
  cardContent: {
    top: '0.00%',
    left: '0.00%',
    // width: '16.47%',
    // height: '100.00%',
    // position: 'absolute',
    width: 50,
    height: 50,
    // backgroundColor: 'green',
  },
  cardImage: {
    top: '0.00%',
    left: '0.00%',
    width: 50,
    height: 50,
    backgroundColor: 'transparent',
    // position: 'absolute',
    borderRadius: 60,
    borderColor: 'transparent',
    // height: 40,
    // width: 40,
    // backgroundColor: 'blue',
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
    // backgroundColor: 'yellow',
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
    // backgroundColor: 'purple',
  },
  cardTime: {
    top: '63.64%',
    left: '85.03%',
    backgroundColor: 'transparent',
    color: 'rgba(22,31,61,1)',
    // position: 'absolute',
    opacity: 0.4,
    width: 50,
    height: 50,
    fontSize: 10,
    fontFamily: 'montserrat-regular',
    textAlign: 'right',
    // backgroundColor: 'white',
  },
});
