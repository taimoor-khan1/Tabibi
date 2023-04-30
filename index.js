/**
 * @format
 */

import {
  AppRegistry,
  DeviceEventEmitter,
  Alert,
  LogBox,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import App from './App';
import messaging from '@react-native-firebase/messaging';
import {name as appName} from './app.json';
import {gestureHandlerRootHOC} from 'react-native-gesture-handler';
import OverlayPermissionModule from 'rn-android-overlay-permission';
import IncomingCall from 'react-native-incoming-call';
import RNVoipCall from 'react-native-voip-call/lib/RNVoipCall';
let calling;
//Overlay permission
if (Platform.OS === 'android') {
  OverlayPermissionModule.isRequestOverlayPermissionGranted((status) => {
    if (status) {
      Alert.alert(
        'Allow Screen Overlay',
        'Tabibbi app needs overlay permission for background calling',
        [
          {
            text: 'OK',
            onPress: () => OverlayPermissionModule.requestOverlayPermission(),
          },
        ],
        {cancelable: false},
      );
    }
  });
}
// FCM messaging permission
messaging().requestPermission();

const backgroundHandler = messaging()
  .getInitialNotification()
  .then(async (remoteMessage) => {
    console.warn(
      '%c Message handled in the App is closed! backgroundHandler',
      'font-weight: bold; font-size: 16px;color: #1563BD',
      remoteMessage,
    );

    if (remoteMessage && remoteMessage?.data?.type == 'cancelled') {
      console.warn('Call has been cancelled by Dr.');
      IncomingCall.dismiss();
      RNVoipCall.endAllCalls();
    }
  });

// //Firebase Background PUSH Handler ANDROID
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log(
    '%c Push notification handled in the Background! ',
    'font-weight: bold; font-size: 16px;color: #1563BD',
    remoteMessage,
  );
  if (Platform.OS === 'android') {
    let data;
    if (remoteMessage.data) {
      data = remoteMessage.data;
      await AsyncStorage.setItem('data', JSON.stringify(data));
    }
    if (data && data?.type === 'call' && data?.videoConsultationId) {
      IncomingCall.display(
        data?.videoConsultationId, // Call UUID v4
        data?.name, // Username
        data?.image, // Avatar URL
        'Incomming Call', // Info text
        30000, // Timeout for end call after 30s
      );
      // Listen to headless action events
      DeviceEventEmitter.addListener('endCall', (payload) => {
        // End call action here
        const param = {
          id: payload?.uuid?.toString(),
          status: {status: 'rejected'},
        };
        // dispatch(updateCallStatus(param, navigation));
      });
      calling = DeviceEventEmitter.addListener('answerCall', (payload) => {
        if (payload?.isHeadless) {
          // Called from killed state
          IncomingCall?.openAppFromHeadlessMode(payload.uuid);
        } else {
          // Called from background state
          IncomingCall?.backToForeground();
        }
        calling?.remove();
      });
    } else if (remoteMessage && remoteMessage?.data?.type == 'cancelled') {
      console.warn('Call has been cancelled by Dr.');
      IncomingCall.dismiss();
      RNVoipCall.endAllCalls();
    }
  }
});
messaging().onNotificationOpenedApp((remoteMessage) => {
  if (remoteMessage && remoteMessage?.data?.type == 'cancelled') {
    console.warn('Call has been cancelled by Dr.');
    RNVoipCall.endAllCalls();
  }
});
LogBox.ignoreAllLogs();
AppRegistry.registerComponent(appName, () => App);
AppRegistry.registerHeadlessTask(
  'RNFirebaseBackgroundMessage',
  () => backgroundHandler,
);
AppRegistry.registerComponent(appName, () => gestureHandlerRootHOC(App));
