import {StyleSheet, Dimensions} from 'react-native';
export const GRAY = '#6969697a';
export const LIGHT_GRAY = '#D3D3D3';
const height = Dimensions.get('screen').height;
const width = Dimensions.get('screen').width;
export const StylesHome = StyleSheet.create({
  // Style chat room
  headStyle: {
    backgroundColor: '#1E90FF',
    height: 45,
  },
  headImage: {
    height: 40,
    width: 40,
    borderRadius: 60,
  },
  headWrapperTitle: {
    flex: 1,
    textAlign: 'left',
    marginHorizontal: 5,
  },
  headTitle: {
    flex: 1.2,
    fontSize: 16,
    color: '#fff',
    fontWeight: '700',
  },
  headStatus: {
    flex: 1,
    fontSize: 12,
    color: '#fff',
    textAlign: 'left',
  },
  headLeft: {
    flex: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headRight: {
    flex: 1,
    flexDirection: 'row',
  },
  renderSendView: {
    borderRadius: 50,
    height: Math.ceil(height / 16.5) + 5,
    width: Math.ceil(height / 16.5) + 5,
    marginVertical: 7.5,
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#33A6EA',
  },
  renderSendIcon: {
    right: -1,
    color: '#fff',
  },
  wrapperStyleDay: {
    backgroundColor: '#edfcfc',
    padding: 5,
    borderRadius: 10,
  },
  wrapperTextStyleDay: {
    color: '#828282',
  },
  renderToBottomIcon: {
    color: '#828282',
    alignItems: 'center',
    justifyContent: 'center',
  },
  renderToBottomView: {
    width: 25,
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  renderTextInput: {
    backgroundColor: '#fff',
    flex: 8,
  },
  renderChangeTextInput: {
    backgroundColor: '#f4f4f4',
    marginVertical: 5,
    borderRadius: 25,
    paddingLeft: 20,
    paddingRight: 20,
    marginLeft: 5,
    maxHeight: 160,
    overflow: 'scroll',
  },
  // Style List Chat
});
