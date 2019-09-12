import {StyleSheet} from 'react-native';
export const GRAY = '#6969697a';
export const LIGHT_GRAY = '#D3D3D3';

export const Styles = StyleSheet.create({
  inputAuth: {
    backgroundColor: '#ffffffa0',
    borderRadius: 10,
    // backgroundColor: 'transparent',
    // position: 'absolute',
    // borderColor: 'transparent',
    paddingLeft: 6,
    width: '100%',
    height: 60,
    // marginBottom: 10,
    // marginTop: 10,
  },
  root: {
    backgroundColor: 'transparent',
  },
  rootView: {
    // backgroundColor: '#f0f0ff00',
    // backgroundColor: 'transparent',
    marginLeft: '8%',
    marginRight: '8%',
    // marginBottom: 100,
    height: 600,
  },
  welcomeText: {
    backgroundColor: 'transparent',
    // position: 'absolute',
    // borderColor: 'transparent',
    // backgroundColor: '#f0f0ff00',
    color: '#fff',
    textShadowColor: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'Airbnb Cereal App',
    marginTop: 30,
    marginBottom: 50,
    fontSize: 34,
  },
  buttons: {
    left: '78%',
    top: 30,
    // width: '100%',
    width: 50,
    height: 50,
    paddingTop: 4,
    backgroundColor: '#ffffffa0',
    borderRadius: 110,
  },
  buttonsText: {
    position: 'absolute',
    bottom: '10%',
    fontSize: 17,
    fontWeight: 'bold',
    color: 'grey',
  },
  Image: {
    position: 'absolute',
    width: '180%',
    height: '100%',
    top: '-10%',
    // zIndex: 999,
    // elevation: 559,
    left: '-10%',
  },
  icons: {
    top: 30,
    position: 'absolute',
    backgroundColor: '#1E90FF',
  },
});
