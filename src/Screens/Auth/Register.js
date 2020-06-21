import React, {Component} from 'react';
import {Text, Content} from 'native-base';
import {TextInput, Alert, TouchableOpacity, View, Image} from 'react-native';
import {Toast, Button} from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import {Styles, GRAY, LIGHT_GRAY} from './Styles';
import {Icon} from 'react-native-elements';
import firebase from 'firebase';

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isFocused: false,
      email: '',
      password: '',
      phone: '',
      name: '',
      image: 'https://img.icons8.com/clouds/2x/user.png',
      full_name: '',
      status: 'online',
      showToast: false,
    };
  }
  handleChange = key => val => {
    this.setState({[key]: val});
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
    const reqemail = /^(?=.*[a-z])(?=.*[@])[0-9a-zA-Z!@#\$%\^\&*\)\(+=._-]{3,}$/;
    const checkemail = data.email == data.email.match(reqemail);
    // const reqpassword = /^(?=.*\d)(?=.*[a-z])(?=.*[!@#\$%\^\&*\)\(+=._-])[0-9a-zA-Z!@#\$%\^\&*\)\(+=._-]{5,}$/;
    // const checkpassword = data.password == data.password.match(reqpassword);
    this.setState({isLoading: true});
    if (!checkemail) {
      this.setState({isLoading: false});
      Toast.show({
        text: 'Email not valid!',
        textStyle: {fontWeight: 'bold'},
        type: 'warning',
        buttonText: 'X',
        duration: 5000,
      });
    } else if (data.password.length < 5) {
      this.setState({isLoading: false});
      Toast.show({
        text: 'password must be 5 character or more!',
        textStyle: {fontWeight: 'bold'},
        type: 'warning',
        buttonText: 'X',
        duration: 5000,
      });
    } else if (data.phone.length < 11) {
      this.setState({isLoading: false});
      Toast.show({
        text: 'wrong phone!',
        textStyle: {fontWeight: 'bold'},
        type: 'warning',
        buttonText: 'X',
        duration: 5000,
      });
    } else if (data.name.length < 3) {
      this.setState({isLoading: false});
      Toast.show({
        text: 'wrong name!',
        textStyle: {fontWeight: 'bold'},
        type: 'warning',
        buttonText: 'X',
        duration: 5000,
      });
    } else if (data.full_name.length < 3) {
      this.setState({isLoading: false});
      Toast.show({
        text: 'wrong full name!',
        textStyle: {fontWeight: 'bold'},
        type: 'warning',
        buttonText: 'X',
        duration: 5000,
      });
    } else {
      // save user Data
      firebase
        .auth()
        .createUserWithEmailAndPassword(data.email, data.password)
        .then(res => {
          firebase.auth().currentUser.updateProfile({
            displayName: data.name,
            photoURL: data.image,
          });
          firebase
            .database()
            .ref('users/' + res.user.uid)
            .set({
              uid: res.user.uid,
              name: data.name,
              full_name: data.full_name,
              image: data.image,
              status: data.status,
              phone: data.phone,
              email: data.email,
            });
          AsyncStorage.setItem('@Key', res.user.uid);
          AsyncStorage.setItem('name', data.name);
          AsyncStorage.setItem('image', data.image);
          this.props.navigation.navigate('ChatList');
          // console.log(res);
        })
        .catch(err => console.log(err));
    }
  };
  handleSignIn = () => {
    return this.props.navigation.navigate('Login');
  };
  render() {
    const {isFocused, isLoading} = this.state;
    return (
      <Content style={Styles.root}>
        <Image
          style={Styles.Image}
          source={require('../../Assets/topImg.png')}
        />
        <View style={Styles.rootView}>
          <Text style={Styles.welcomeText}>Sign Up</Text>
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
            placeholder="Password"
            selectionColor={GRAY}
            underlineColorAndroid={isFocused ? GRAY : LIGHT_GRAY}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            value={this.state.password}
            secureTextEntry={true}
            onChangeText={this.handleChange('password')}
            style={Styles.inputAuth}
          />
          <TextInput
            placeholder="Phone Number"
            selectionColor={GRAY}
            underlineColorAndroid={isFocused ? GRAY : LIGHT_GRAY}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            value={this.state.phone}
            keyboardType="number-pad"
            onChangeText={this.handleChange('phone')}
            style={Styles.inputAuth}
          />
          <TextInput
            placeholder="Name"
            selectionColor={GRAY}
            underlineColorAndroid={isFocused ? GRAY : LIGHT_GRAY}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            value={this.state.name}
            onChangeText={this.handleChange('name')}
            style={Styles.inputAuth}
          />
          <TextInput
            placeholder="Full name"
            selectionColor={GRAY}
            underlineColorAndroid={isFocused ? GRAY : LIGHT_GRAY}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            value={this.state.full_name}
            onChangeText={this.handleChange('full_name')}
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
          <Text style={Styles.buttonsText} onPress={this.handleSignIn}>
            Sign In
          </Text>
        </View>
      </Content>
    );
  }
}

export default Register;
