/**
 * TABIBI Medical App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState} from 'react';
import {AppNavigator} from './src/config/Routes';
import {Provider, useSelector} from 'react-redux';
import store from './src/store';
import {MenuProvider} from 'react-native-popup-menu';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {NotificaionPopups} from './src/components';

const App = () => {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <Provider store={store}>
        <MenuProvider>
          <AppNavigator />
          <NotificaionPopups />
        </MenuProvider>
      </Provider>
    </GestureHandlerRootView>
  );
};

export default App;
