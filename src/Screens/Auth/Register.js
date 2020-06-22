import React, {Component} from 'react';
import {View, Text, Toast, Spinner} from 'native-base';
import {
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {Styles, GRAY, LIGHT_GRAY} from './Styles';
import {Icon} from 'react-native-elements';
import firebase from 'firebase';
import LinearGradient from 'react-native-linear-gradient';
import Orientation from 'react-native-orientation';

class Register extends Component {
  constructor(props) {
    super(props);
    const height = Dimensions.get('screen').height;
    const width = Dimensions.get('screen').width;
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
      height,
      width,
    };
  }
  componentDidMount() {
    Orientation.lockToPortrait();
  }
  componentWillUnmount() {
    Orientation.unlockAllOrientations();
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
    const {isFocused, isLoading, height} = this.state;
    return (
      <View style={Styles.root}>
        <View style={{top: -((height / 100) * 20)}}>
          <LinearGradient
            colors={['#a1ffd1', '#5998ff']}
            style={Styles.ball3}
          />
          <LinearGradient
            colors={['#a1ffd1', '#5998ff']}
            style={Styles.ball4}
          />
          <LinearGradient
            colors={['#a1ffd1', '#5998ff']}
            style={Styles.ball2}
          />
          <LinearGradient
            colors={['#f5f7ff', '#85b3ff', '#0394fc']}
            style={Styles.ball1}>
            <Image
              style={Styles.icons}
              source={require('../../Assets/pochat-2-01.png')}
            />
          </LinearGradient>
        </View>
        <ScrollView>
          <View style={Styles.headView} />
          <View style={Styles.contentView}>
            <TextInput
              placeholder="Email"
              selectionColor={GRAY}
              underlineColorAndroid={isFocused ? GRAY : LIGHT_GRAY}
              onFocus={this.handleFocus}
              onBlur={this.handleBlur}
              value={this.state.email}
              onChangeText={this.handleChange('email')}
              style={Styles.inputAuth}
              onSubmitEditing={() => this.password.focus()}
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
              ref={r => (this.password = r)}
              onSubmitEditing={() => this.phone.focus()}
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
              ref={r => (this.phone = r)}
              onSubmitEditing={() => this.name.focus()}
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
              ref={r => (this.name = r)}
              onSubmitEditing={() => this.fullName.focus()}
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
              ref={r => (this.fullName = r)}
            />
            <TouchableOpacity
              onPress={this.handleSubmit}
              style={Styles.buttons}>
              {isLoading ? (
                <Spinner color="#517fa4" />
              ) : (
                <Icon
                  name={'arrow-right'}
                  style={Styles.buttons}
                  type="evilicon"
                  size={50}
                  color="#517fa4"
                />
              )}
            </TouchableOpacity>
            <Text style={Styles.buttonsText} onPress={this.handleSignIn}>
              Sign In
            </Text>
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default Register;
