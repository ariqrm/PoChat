import React, {Component} from 'react';
import {Text, Content} from 'native-base';
import {TextInput, Alert, TouchableOpacity, View, Image} from 'react-native';
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
      image:
        'https://pm1.narvii.com/5889/5bd9ba909654893ab36d24c16f21912678f2b253_hq.jpg',
      full_name: '',
      status: 'offline',
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
    this.setState({isLoading: true});
    const data = this.state;
    if (data.email.length < 10) {
      this.setState({isLoading: false});
      Alert.alert('Error', 'Wrong email');
    } else if (data.password.length < 3) {
      this.setState({isLoading: false});
      Alert.alert('Error', 'Wrong password');
    } else if (data.phone.length < 3) {
      this.setState({isLoading: false});
      Alert.alert('Error', 'Wrong phone');
    } else if (data.name.length < 3) {
      this.setState({isLoading: false});
      Alert.alert('Error', 'Wrong Username');
    } else if (data.full_name.length < 3) {
      this.setState({isLoading: false});
      Alert.alert('Error', 'Wrong full name');
    } else {
      this.setState({isLoading: false});
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
              image: data.image,
              status: data.status,
              phone: data.phone,
              email: data.email,
            });
          AsyncStorage.setItem('@Key', res.user.uid);
          AsyncStorage.setItem('name', data.name);
          AsyncStorage.setItem('image', data.image);
          this.props.navigation.navigate('Home');
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
          <TouchableOpacity
            onPress={this.handleSignIn}
            style={Styles.buttonsText}>
            <Text>Sign In</Text>
          </TouchableOpacity>
        </View>
      </Content>
    );
  }
}

export default Register;
