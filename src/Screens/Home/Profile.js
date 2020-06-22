import React, {Component} from 'react';
import {Container, Button} from 'native-base';
import {Icon} from 'react-native-elements';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  StatusBar,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import firebase from 'firebase';
import LinearGradient from 'react-native-linear-gradient';

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: null,
      Profile: {
        name: '',
        email: '',
        phone: '',
      },
      editProfile: {},
      isFocused: false,
      isLoading: false,
      uid: '',
      data: [],
    };
  }
  componentDidMount = async () => {
    AsyncStorage.getItem('@Key').then(res => {
      this.setState({uid: res});
      this.profileUser = firebase.database().ref('users');
      this.profileUser.on('value', _res => {
        const data = _res.val()[res];
        this.setState({
          data: data,
          Profile: {
            name: data.name,
            email: data.email,
            phone: data.phone,
          },
        });
      });
    });
  };
  componentWillUnmount = () => {
    this.profileUser.off();
  };
  handleFocus = () => {
    this.setState({
      isFocused: true,
    });
  };
  handleBlur = () => {
    this.setState({
      isFocused: false,
    });
    firebase
      .database()
      .ref('users/' + this.state.uid)
      .update(this.state.Profile);
  };
  handleChange = key => val => {
    this.setState({
      ...this.state,
      Profile: {[key]: val},
    });
  };
  handleFoto = e => {
    if (e.target.files[0]) {
      const image = e.target.files[0];
      this.setState({
        image: image,
      });
    }
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
        <ScrollView>
          <View style={style.body}>
            <Image
              source={{
                uri:
                  'https://i.pinimg.com/originals/13/d6/81/13d681b20058a2d6261432a1b69cd781.jpg',
              }}
              style={style.bgImage}
            />
          </View>
          <View style={style.content}>
            <Image
              source={{
                uri: data.image,
              }}
              style={style.userImage}
            />
          </View>
          <View style={style.infoUser}>
            <Text style={style.buttonsText}>Username</Text>
            {/* {console.warn(this.state.isFocused)} */}
            <TextInput
              placeholder={data.name}
              // underlineColorAndroid={this.state.isFocused === true ? 'green' : 'red'}
              onFocus={this.handleFocus}
              onBlur={this.handleBlur}
              value={this.state.Profile.name || data.name}
              onChangeText={this.handleChange('name')}
              style={style.Text}
            />
            <Text style={style.buttonsText}>Email</Text>
            <Text style={style.Text}>{data.email}</Text>
            <Text style={style.buttonsText}>Phone</Text>
            <TextInput
              placeholder={data.phone}
              onFocus={this.handleFocus}
              onBlur={this.handleBlur}
              value={this.state.Profile.phone || data.phone}
              onChangeText={this.handleChange('phone')}
              style={style.Text}
            />
            <LinearGradient
              colors={['#a1ffd1', '#5998ff']}
              style={style.logoutButton}>
              <Text style={style.logoutText}>logout</Text>
            </LinearGradient>
          </View>
          {/* <Button style={style.buttons} onPress={this.SignOut}>
            <Icon name="logout" type="antdesign" size={30} color="#4a4a4aff" />
          </Button> */}
        </ScrollView>
      </Container>
    );
  }
}

const style = StyleSheet.create({
  infoUser: {
    padding: 20,
    top: -45,
    zIndex: 500,
    position: 'relative',
    backgroundColor: '#fff',
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
  },
  body: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 200,
    zIndex: -10,
    backgroundColor: '#5f27cd',
    position: 'relative',
  },
  content: {
    alignItems: 'center',
    position: 'absolute',
    width: 150,
    height: 150,
    right: 10,
    top: 80,
    backgroundColor: '#a8a8a8bb',
    borderColor: '#a8a8a8bb',
    borderWidth: 5,
    borderRadius: 90,
    zIndex: 1000,
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
    fontSize: 20,
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
  logoutButton: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    borderRadius: 50,
    height: 30,
    width: 70,
    top: 10,
  },
  logoutText: {
    fontWeight: '700',
    color: '#fff',
  },
});

export default Profile;
