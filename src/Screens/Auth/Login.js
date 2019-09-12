import React, {Component} from 'react';
import {View, Text, Content} from 'native-base';
import {TextInput, Alert, TouchableOpacity, Image} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {Styles, GRAY, LIGHT_GRAY} from './Styles';
import {Icon} from 'react-native-elements';
import firebase from 'firebase';
// import Icon from 'react-native-vector-icons';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isFocused: false,
      phone: '',
      password: '',
      email: '',
    };
  }
  handleChange = key => val => {
    this.setState({[key]: val});
  };
  handleAuth = async () => {
    await AsyncStorage.getItem('@Key').then(res => {
      if (res) {
        this.props.navigation.navigate('Home');
      }
    });
  };
  handleFocus = event => {
    this.setState({
      isFocused: true,
    });
    if (this.props.onFocus) {
      this.props.onFocus(event);
    }
  };
  handleBlur = event => {
    this.setState({
      isFocused: false,
    });
    if (this.props.onBlur) {
      this.props.onBlur(event);
    }
  };

  handleSubmit = () => {
    const data = this.state;
    this.setState({isLoading: true});
    if (data.email.length < 10) {
      this.setState({isLoading: false});
      Alert.alert('Error', 'Wrong Email');
    } else if (data.password.length < 3) {
      this.setState({isLoading: false});
      Alert.alert('Error', 'Wrong Userpassword');
    } else {
      // save user Data
      firebase
        .auth()
        .signInWithEmailAndPassword(data.email, data.password)
        .then(res => {
          console.log('aya', res);
          firebase
            .database()
            .ref('users/' + res.user.uid)
            .update({status: 'online'});
          AsyncStorage.setItem('@Key', res.user.uid);
          AsyncStorage.setItem('name', res.user.displayName);
          AsyncStorage.setItem('image', res.user.photoURL);
          AsyncStorage.getItem('@Key', (_err, _res) => {
            if (_res) {
              this.setState({isLoading: false});
              this.props.navigation.navigate('Home');
            } else {
              this.props.navigation.navigate('Login');
            }
          });
        })
        .catch(err => console.log(err));
    }
  };
  handleSignUp = () => {
    return this.props.navigation.navigate('Register');
  };

  render() {
    const {isFocused, isLoading} = this.state;
    this.handleAuth();
    return (
      <Content style={Styles.root}>
        <Image
          style={Styles.Image}
          source={require('../../Assets/topImg.png')}
        />
        <View style={Styles.rootView}>
          <Icon
            name={'pinterest'}
            style={Styles.icons}
            type="font-awesome"
            size={90}
            color="#fff"
          />
          <Text style={Styles.welcomeText} transparent>
            Sign In
          </Text>
          <TextInput
            placeholder="Email"
            selectionColor={GRAY}
            underlineColorAndroid={isFocused ? GRAY : LIGHT_GRAY}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            value={this.state.email}
            onChangeText={this.handleChange('email')}
            style={Styles.inputAuth}
          />
          <TextInput
            placeholder="password"
            selectionColor={GRAY}
            underlineColorAndroid={isFocused ? GRAY : LIGHT_GRAY}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            value={this.state.password}
            onChangeText={this.handleChange('password')}
            style={Styles.inputAuth}
          />
          <TouchableOpacity onPress={this.handleSubmit} style={Styles.buttons}>
            <Icon
              name={isLoading ? 'spinner' : 'arrow-right'}
              style={Styles.buttons}
              type="evilicon"
              size={50}
              color="#517fa4"
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={this.handleSignUp}
            style={Styles.buttonsText}>
            <Text>Sign Up for free</Text>
            {/* <Icon
              name={isLoading ? 'spinner' : 'arrow-right'}
              style={Styles.buttons}
              type="evilicon"
              size={50}
              color="#517fa4"
            /> */}
          </TouchableOpacity>
        </View>
      </Content>
    );
  }
}

export default Login;
