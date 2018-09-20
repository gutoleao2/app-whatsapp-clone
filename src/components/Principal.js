import * as React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { TabViewAnimated, TabBar, SceneMap } from 'react-native-tab-view';
import TabBarMenu from './TabBarMenu';
import Contatos from './Contatos';
import Conversas from './Conversas';

const initialLayout = {
  height: 0,
  width: Dimensions.get('window').width,
};

export default class Principal extends React.Component {
  state = {
    index: 0,
    routes: [
      { key: 'conversas', title: 'Conversas' },
      { key: 'contatos', title: 'Contatos' },
    ],
  };

  _handleIndexChange = index => this.setState({ index });

  _renderHeader = props => <TabBarMenu {...props} />;

  _renderScene = SceneMap({
    conversas: Conversas,
    contatos: Contatos,
  });

  render() {
    return (
      <TabViewAnimated
        navigationState={this.state}
        renderScene={this._renderScene}
        renderHeader={this._renderHeader}
        onIndexChange={this._handleIndexChange}
        initialLayout={initialLayout}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});