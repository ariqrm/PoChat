import React, {Component} from 'react';
import {Container, Header, Content, Tab, Tabs} from 'native-base';
import Tab1 from './Home';
import Tab2 from './ChatList';
import Tab3 from './Profile';
import {StyleSheet} from 'react-native';
export default class TabMenu extends Component {
  render() {
    return (
      <Container>
        <Header hasTabs />
        <Tabs>
          <Tab heading="Map">
            <Tab1 />
          </Tab>
          <Tab heading="Chat">
            <Tab2 />
          </Tab>
          <Tab heading="Profile">
            <Tab3 />
          </Tab>
        </Tabs>
      </Container>
    );
  }
}

const Styles = StyleSheet.create({
  TabsConten: {
    borderBottomColor: 'transparent',
    borderBottomWidth: 0,
  },
});
