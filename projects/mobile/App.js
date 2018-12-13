import React from 'react';
import { StyleSheet, View, WebView } from 'react-native';

export default class App extends React.Component {
  render() {
    return (
      <WebView
        source={{uri: 'http://castaway.xesf.net'}}
      />
    );
  }
}
