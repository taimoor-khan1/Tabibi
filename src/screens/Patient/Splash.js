import React, {useEffect, useRef, useState} from 'react';
import {
  Image,
  StatusBar,
  View,
  PermissionsAndroid,
  DeviceEventEmitter,
  Platform,
  AppState,
} from 'react-native';
import styles from '../../assets/styles';
import {assets} from '../../assets/images';
import colors from '../../config/Colors';
import config from '../../config';
import AsyncStorage from '@react-native-community/async-storage';
import messaging from '@react-native-firebase/messaging';
import {useDispatch} from 'react-redux';
import {CheckUserSession} from '../../store/actions';
import {changeStack, navigate} from '../../config/NavigationService';
import {useLayoutEffect} from 'react';
// import Geolocation from '@react-native-community/geolocation';
import Geolocation from 'react-native-geolocation-service';
import IncomingCall from 'react-native-incoming-call';
import RNVoipCall, {RNVoipPushKit} from 'react-native-voip-call';
import {
  callAccepted,
  updateCallStatus,
} from '../../store/actions/CallingActions';

import {REJECT} from '../../store/constants';

let calling;

const Splash = ({navigation}) => {
  const timerStart = useRef(null);
  const [inComingCall, setInComingCall] = useState('');
  // const [callstart, setCallstart] = useState(false);

  const dispatch = useDispatch();
  // console.log(config.api.version);
  // Fuction for permission
  const requestPermission = async () => {
    if (Platform.OS === 'ios') {
      try {
        const auth = await Geolocation.requestAuthorization("whenInUse");
      

  
        if (auth === 'granted') {
          // getInitialState();
          await geoLocation();
        }
      } catch (err) {
        console.warn(err);
      }
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        var authorized = 'granted';
        if (authorized === granted) {
          await geoLocation();
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };
  // Function for Geo Location
  const geoLocation = async () => {
    var position = await AsyncStorage.getItem('position');
   
    if (position ==null) {
      Geolocation.getCurrentPosition(
        async (position) => {
          await AsyncStorage.setItem('position', JSON.stringify(position));
        },
        (error) => console.log("error when get location======>",error),
        {
          enableHighAccuracy: true,
          timeout: 200000,
          maximumAge: 10000,
          showLocationDialog: true,
        },
      );
    } 
    // else {
    // }
  };

  //Firebase Forground PUSH Handler
  useEffect(() => {
  
    requestPermission();
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      console.log(
        '%c Push notification handled in the Foreground! ',
        'font-weight: bold; font-size: 16px;color: #1563BD',
        remoteMessage,
      );
      if (remoteMessage?.data?.type === 'rejected') {
        dispatch({type: REJECT, payload: 'rejected'});
        setTimeout(() => {
          dispatch({type: REJECT, payload: null});
        }, 5000);
      } else if (remoteMessage?.data?.type == 'cancelled') {
        console.log(remoteMessage?.data, 'Call has been cancelled by Dr.');
        // RNVoipCall.endCall(remoteMessage?.data?.sessionId)
        RNVoipCall.endAllCalls();
      } else {
        dispatch({type: REJECT, payload: null});
      }
      //FOR ANDROID CALLING
      if (Platform.OS === 'android') {
        let data;
        if (remoteMessage.data) {
          data = remoteMessage.data;
          console.log(data, 'Notify');
          if (data && data.type === 'call' && data.videoConsultationId) {
            IncomingCall.display(
              data.videoConsultationId, // Call UUID v4
              data.name, // Username
              data.image, // Avatar URL5
              'Incomming Call', // Info text
              30000, // Timeout for end call after 20s
            );

            // setTimeout(() => {
            // }, 1000);
            // Listen to headless action events
            DeviceEventEmitter.addListener('endCall', (payload) => {
              console.log(payload, 'End Call');
              // End call action here
              const param = {
                id: payload.uuid.toString(),
                status: 'rejected',
              };
              dispatch(updateCallStatus(param, navigation));
            });
            calling = DeviceEventEmitter.addListener(
              'answerCall',
              (payload) => {
                if (payload.isHeadless) {
                  // Called from killed state
                  IncomingCall.openAppFromHeadlessMode(payload.uuid);
                } else {
                  // Called from background state
                  IncomingCall.backToForeground();
                }
                // console.log(payload, 'working1 asldkalsdkasldk');
                // const param = {videoConsultationId: payload.uuid.toString()};
                dispatch(callAccepted(payload.uuid, navigation, false, data));
                calling.remove();
              },
            );
          }
          if (data && data?.type == 'cancelled') {
            console.log('Call has been cancelled by Dr.');
            IncomingCall.dismiss();
          }
        }
      }

      //FOR OTHER FCM NOTIFICATIONS
      if (remoteMessage.data && remoteMessage.data.type != 'call') {
        let notification = remoteMessage?.notification;
        let data = remoteMessage?.data;
        global.rootModalHandler(true, notification, navigation, data);
      }
    });
    return () => unsubscribe;
  }, []);

  //Ios Calling from VIOP pushkit
  useEffect(() => {
    var callstart = true

    if (Platform.OS === 'ios') {
      let options = {
        appName: 'Tabibbi', // Required
        // imageName: 'logo', //string (optional) in ios Resource Folder
        ringtoneSound: '', //string (optional) If provided, it will be played when incoming calls received
        includesCallsInRecents: false, // boolean (optional) If provided, calls will be shown in the recent calls
        supportsVideo: true, //boolean (optional) If provided, whether or not the application supports video calling (Default: true)
      };
      // Initlize Call Kit IOS is Required
      RNVoipCall.initializeCall(options)
        .then((e) => {
          console.log(e, ' Inititalize Options');
          //Success Call Back
        })
        .catch((e) => console.log(e));
      //On Remote Push notification Recived in Forground
      var _id = '';
      var userData = {};
      RNVoipPushKit.RemotePushKitNotificationReceived((notification) => {
        callstart = true

        console.log('===RemotePushKIt', notification);
        console.log('AppState', AppState.currentState);
        _id = notification.videoConsultationId;
        userData = notification;
        let callOptions = {
          callerId: notification.videoConsultationId, // Important uuid must in this format
          ios: {
            name: notification.name, // caller Name
            hasVideo: true,
          },
          android: {
            ringtuneSound: true, // defualt true
            ringtune: 'ringtune', // add file inside Project_folder/android/app/res/raw
            duration: 20000, // defualt 30000
            vibration: true, // defualt is true
            channel_name: 'call1asd', //
            notificationId: 1121,
            notificationTitle: 'Incomming Call',
            notificationBody: 'Some One is Calling...',
            answerActionTitle: 'Answer',
            declineActionTitle: 'Decline',
          },
        };
        // RNVoipCall.displayIncomingCall(callOptions)
        //   .then((data) => {
        //     console.log(JSON.stringify(data) , 'Displayyyyy');
        //     if (data && data?.type == 'cancelled') {
        //       console.log('Call has been cancelled by Dr.');
        //       RNVoipCall.endAllCalls();
        //     }
        //   })
        //   .catch((e) => console.log(e, 'displayIncomingCall ERR'));
      });

      // RNVoipCall.addEventListener(
      //   'didDisplayIncomingCall',
      //   (UpComingCallData) => {
      //     const {
      //       // error,
      //       callUUID,
      //       handle,
      //       localizedCallerName,
      //       hasVideo,
      //       fromPushKit,
      //       payload,
      //     } = UpComingCallData;
      //     setInComingCall(UpComingCallData)
      //     console.log('IncomingCall payload ----', UpComingCallData);
      //   },
      // );

   

      RNVoipCall.onEndCall((data) => {
  
        const param = {
          // id: data?.callerId?.toString(),
          id: _id,
          status: 'rejected',
        };
        if (callstart) {
          console.log(data, ' Paramssss');
          dispatch(updateCallStatus(param, navigation));
          console.log('CALLER END=========', data);
        }
      });
      RNVoipCall.onCallAnswer((data) => {
        callstart = false
        console.log('CALLER ACCEPT', data, '_id', _id);
        if (data.callerId) {
          dispatch(callAccepted(_id, navigation, false, userData));
        }
       


      });

    }
  }, []);

  // SPLASH Timeout
  useLayoutEffect(() => {
    (async function session() {
      setTimeout(async () => {
        const intro = await AsyncStorage.getItem('intro');
        const user = await AsyncStorage.getItem('user_detail');
        dispatch(CheckUserSession());
        if (user) {
          changeStack('DrawerStack');
        } else {
          config.api.version === 'DOCTOR'
            ? navigation.reset({
                index: 0,
                routes: [{name: 'DrLogin'}],
              })
            : JSON.parse(intro)
            ? changeStack('DrawerStack')
            : navigation.reset({
                index: 0,
                routes: [{name: 'IntroSlides'}],
              });
        }
      }, 3000);
    })();
  }, [navigation]);

  return (
    <View style={[styles.container, styles.splash_logo]}>
      <StatusBar backgroundColor={colors.themeColor} />
      <Image source={assets.splash_bg} style={styles.position} />
      <Image source={assets.splash_logo} style={styles.splash_logo} />
    </View>
  );
};

export default Splash;
