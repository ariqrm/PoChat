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
// import Icon from 'react-native-vector-icons';
import LinearGradient from 'react-native-linear-gradient';
import Orientation from 'react-native-orientation';

class Login extends Component {
  constructor(props) {
    super(props);
    const height = Dimensions.get('screen').height;
    const width = Dimensions.get('screen').width;
    this.state = {
      isLoading: false,
      isFocused: false,
      phone: '',
      password: '',
      email: '',
      height,
      width,
    };
    Orientation.lockToPortrait();
  }
  componentWillUnmount() {
    Orientation.unlockAllOrientations();
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
    const reqemail = /^(?=.*[a-z])(?=.*[@])[0-9a-zA-Z!@#\$%\^\&*\)\(+=._-]{3,}$/;
    const checkemail = data.email == data.email.match(reqemail);
    console.warn(checkemail, 'mail');
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
    } else if (data.password.length < 3) {
      this.setState({isLoading: false});
      Toast.show({
        text: 'Wrong Password!',
        textStyle: {fontWeight: 'bold'},
        type: 'warning',
        buttonText: 'X',
        duration: 5000,
      });
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
              this.props.navigation.navigate('ChatList');
            } else {
              this.props.navigation.navigate('Login');
            }
          });
        })
        .catch(err => console.warn(err));
    }
  };
  handleSignUp = () => {
    return this.props.navigation.navigate('Register');
  };

  render() {
    const {isFocused, isLoading, height} = this.state;
    this.handleAuth();
    return (
      <View>
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
              placeholder="password"
              selectionColor={GRAY}
              underlineColorAndroid={isFocused ? GRAY : LIGHT_GRAY}
              onFocus={this.handleFocus}
              onBlur={this.handleBlur}
              value={this.state.password}
              secureTextEntry={true}
              onChangeText={this.handleChange('password')}
              style={Styles.inputAuth}
              ref={r => (this.password = r)}
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
          </View>
          <View style={Styles.footView}>
            <Text style={Styles.buttonsText} onPress={this.handleSignUp}>
              Sign Up for free
            </Text>
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default Login;
