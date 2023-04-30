import React, {useState, useEffect, useCallback, useRef} from 'react';
import {Icon} from 'react-native-elements';
import {
  Image,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  Platform,
} from 'react-native';
import {assets} from '../../assets/images';
import labels from '../../config/Labels';
import colors from '../../config/Colors';
import {OTSession, OTPublisher, OTSubscriber, OT} from 'opentok-react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import Modal from 'react-native-modalbox';
import styles from '../../assets/styles';
import Snackbar from 'react-native-snackbar';
import IdleTimerManager from 'react-native-idle-timer';
import {GiftedChat, Bubble, Actions} from 'react-native-gifted-chat';
import database from '@react-native-firebase/database';
import storage from '@react-native-firebase/storage';
import Toast from 'react-native-simple-toast';
import {useDispatch, useSelector} from 'react-redux';
import {startCall, updateCallStatus, callEnd} from '../../store/actions';
import fonts from '../../assets/fonts';
import uuid from 'react-native-uuid';
import DrAddPrescriptionModal from './DrAddPresciptionModal';
// const uuid = require('uuid/v4');

var seconds = 0,
  minutes = 0,
  t;
let interval;
const DrCall = ({navigation, route}) => {
  //Redux Store
  const dispatch = useDispatch();
  const {Auth, Patient} = useSelector((state) => state);
  const {profile} = Auth;
  const {reject} = Patient;
  
  // Declare state variables'

  //OPENTOK STATES
  const [patientDetail] = useState(route?.params?.patientDetail);
  const [sessionId] = useState(route?.params?.session?.sessionId);
  const [token] = useState(route?.params?.session?.token);
  const [apiKey] = useState('47339541');
  const [videoConsultationId] = useState(
    route.params?.session?.videoConsultationId,
  );
  const [publisherId, setPublisherId] = useState(uuid.v4());
  const [cameraPosition, setCameraPosition] = useState('front');
  const [localPublishAudio, setLocalPublishAudio] = useState(true);
  const [localPublishVideo, setLocalPublishVideo] = useState(true);
  const [CallStart, setCallStart] = useState(false);
  const [streamProperties, setStreamProperties] = useState({});
  const [publisherProperties, setPublisherProperties] = useState({
    publishAudio:localPublishAudio,

    cameraPosition: cameraPosition,
  });
  const [loading, setLoading] = useState(false); //initail Loading
  //CHAT STATES
  const [image, setImage] = useState('Chat');
  const [active, setActive] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [time, setTime] = useState('');
  const [missCall, setMisscall] = useState(false);
  const [messages, setMessages] = useState([]); //all messages
  const [user_id] = useState(profile?.userId.replace(/-/g, '')); // sender id own
  const [user_type, setUser_type] = useState('123');
  const [user_name] = useState(profile?.name); // sender name own
  const [user_image] = useState(profile?.avatar); // sender image own
  const [chat_user_id] = useState(patientDetail?.id.replace(/-/g, '')); //  reciver id
  const [chat_user_name, setChat_user_name] = useState(
    `${patientDetail?.firstName} ${patientDetail?.lastName}`,
  ); // reciver name
  const [chat_user_image, setChat_user_image] = useState(patientDetail?.avatar); // reciver image
  const [chat_id, setChat_id] = useState('');
  const [chatBadge, setChatBadge] = useState(0);
  const [chatActive, setChatActive] = useState(false);
  const [loadImg, setLoadImg] = useState(false);
  var storeID;
  console.log(CallStart, '================> Call start');
  const timerStart= useRef(null)

  // Declare input reference field
  const refChatModal = useRef();
  const refPrescriptionModal = useRef();
  //****************************************API/FUNCTIONS**************************

  // OpenTok Session Events handlers
  const sessionEventHandlers = {
    streamCreated: (event) => {
      console.log(event, 'sessionEventHandlers streamCreated doctor start');
      setCallStart(true);

      setActive(true);
      setLoading(false);
      setChatActive(true);
      setChatBadge(0);
      Snackbar.show({
        text: 'Call Connected',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: colors.green1,
        fontFamily: fonts.PoppinsMedium,
        textColor: colors.dim,
        numberOfLines: 1,
      });
      interval = setInterval(() => timer(), 1000);
    },
    sessionConnected: (event) => {
      console.log(event, 'sessionEventHandlers sessionConnected');
      setCallStart(false);
    },
    streamDestroyed: (event) => {
      //user ne call end kerdi
      setCallStart(false);
      Snackbar.show({
        text: 'Call Ended',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: colors.red,
        fontFamily: fonts.PoppinsMedium,
        textColor: colors.dim,
        numberOfLines: 1,
      });
      console.log(event, 'sessionEventHandlers streamDestroyed');
      // dropCall();
      navigation.goBack();
    },
    sessionDisconnected: (event) => {
      console.log(event, 'sessionEventHandlers sessionDisconnected');
      setCallStart(false);

      if (active === true) {
        Snackbar.show({
          text: 'Session Ended',
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: colors.red,
          fontFamily: fonts.PoppinsMedium,
          textColor: colors.dim,
          numberOfLines: 1,
        });
        IdleTimerManager.setIdleTimerDisabled(false);
        // dropCall();
      }

      // goBack();
    },
    error: (error) => {
      console.log(
        `There was an error with the session: ${JSON.stringify(error)}`,
      );
    },
  };

  // OpenTok Publisher Events handlers // Dr Start the call
  const publisherEventHandlers = {
    streamCreated: (event) => {
      console.log(event, 'publisherEventHandlers streamCreated doctor screen ');

      setLoading(false);
      const payload = {
        providerId: profile?.userId,
        providerName: profile?.name,
        deviceTokenType: patientDetail?.deviceTokenType,
        deviceToken: patientDetail?.voipToken,
        avatar: profile?.avatar ? profile?.avatar : assets.url,
        videoConsultationId: videoConsultationId,
      };
      // console.log(payload);
      dispatch(startCall(payload));
    },
    streamDestroyed: (event) => {
      setCallStart(false);

      Snackbar.show({
        text: 'Call Ended',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: colors.red,
        fontFamily: fonts.PoppinsMedium,
        textColor: colors.dim,
        numberOfLines: 1,
      });

      // navigation.goBack();

      console.log(event, 'publisherEventHandlers streamDestroyed');
    },
    error: (error) => {
      console.log(`There was an error with the subscriber: ${error}`);
    },
  };

  // OpenTok Subscriber Events handlers
  const subscriberEventHandlers = {
    error: (error) => {
      console.log(`There was an error with the subscriber: ${error}`);
    },
  };
  //    Audio ON/OFF
  const toggleAudio = () => {
    let publishAudio = localPublishAudio;
    setPublisherProperties((prev) => {
      return {
        ...prev,
        publishAudio: !publishAudio,
      };
    });
    setLocalPublishAudio(!publishAudio);
  };

  //    Video ON/OFF
  const toggleVideo = () => {
    let publishVideo = localPublishVideo;
    setPublisherProperties((prev) => {
      return {
        ...prev,
        publishVideo: !publishVideo,
      };
    });
    setLocalPublishVideo(!publishVideo);
  };

  //Camera change function Front/Back
  const changeCameraPosition = () => {
    if (cameraPosition === 'front') {
      setCameraPosition('back');
      setPublisherProperties({
        cameraPosition: cameraPosition,
        publishAudio:localPublishAudio,

      });
    } else {
      setCameraPosition('front');
      setPublisherProperties({
        cameraPosition: cameraPosition,
        publishAudio:localPublishAudio,

      });
    }
    OT.changeCameraPosition(publisherId, cameraPosition);
  };

  //Call drop function
  const dropCall = () => {
    setActive(false);
    const param = {
      id: videoConsultationId,
      status: 'cancelled',
    };
    dispatch(updateCallStatus(param, navigation));
    navigation.goBack();
    // dispatch(callEnd(videoConsultationId, time, navigation)).then((res) => {
    //   if (res.status === 200) {
    //     navigation.reset({
    //       index: 0,
    //       routes: [
    //         {
    //           name: 'DrInvoice',
    //           params: {
    //             data: res?.data,
    //             invoiceId: res?.data?.id,
    //             from: true,
    //           },
    //         },
    //       ],
    //     });
    //   } else {
    Snackbar.show({
      text: 'Ended', //res?.msg,
      duration: Snackbar.LENGTH_LONG,
      backgroundColor: colors.darkTheme,
      fontFamily: fonts.PoppinsMedium,
      textColor: colors.dim,
      numberOfLines: 1,
      action: {
        text: 'back Home',
        textColor: colors.dim,
        onPress: () => {
          Snackbar.dismiss();
          navigation.reset({
            index: 0,
            routes: [{name: 'DrawerStack'}],
          });
        },
      },
    });
    // }
    // });
  };
  // Call timer duration function
  const timer = () => {
    seconds++;
    if (seconds >= 60) {
      seconds = 0;
      minutes++;
    }
    var tt =
      (minutes ? (minutes > 9 ? minutes : '0' + minutes) : '00') +
      ':' +
      (seconds > 9 ? seconds : '0' + seconds);
    setTime(tt);
  };

  //****************************************MESSAGE FUNCTIONS**************************
  useEffect(() => {
    if (reject === 'rejected') {
      navigation.goBack();
    }
  }, [reject]);

  useEffect(() => {
    timerStart.current = setTimeout(() => {
      console.log('back hy brooo');
      navigation.goBack();
    }, 30000);
  }, []);

  useEffect(() => {
    if (CallStart === true) {
        clearTimeout(timerStart.current);
    }
  }, [CallStart]);

  useEffect(() => {
    setLoading(true);

    IdleTimerManager.setIdleTimerDisabled(true);
    firebase_listner();
    interval = setInterval(() => timer(), 1000);
    return () => _unmount();
  }, []);

  const _unmount = async () => {
    IdleTimerManager.setIdleTimerDisabled(false);
    clearInterval(interval);
    (seconds = 0), (minutes = 0), (hours = 0), t;
    await database()
      .ref('messages/' + chat_id)
      .off('value');
  };

  // Firebase Chatting function Message listner
  const firebase_listner = async () => {
    var chat_id = '';
    if (user_id < chat_user_id) {
      setChat_id(user_id + chat_user_id);
      chat_id = user_id + chat_user_id;
      database()
        .ref('chats/' + (user_id + chat_user_id))
        .update({
          user1_id: user_id,
          user1_name: user_name,
        });
    } else {
      setChat_id(chat_user_id + user_id);
      chat_id = chat_user_id + user_id;
      database()
        .ref('chats/' + (chat_user_id + user_id))
        .update({
          user2_id: user_id,
          user2_name: user_name,
        });
    }
    var chatMessages = [];
    await database()
      .ref('messages/' + chat_id)
      .orderByChild('timestamp')
      .on('child_added', async (snapshot) => {
        if (snapshot.val()) {
          const element = snapshot.val();
          storeID = element?.user_id;

          var chatItem = {
            [element.type == 1 ? 'text' : 'image']: element.text,
            user: {
              // name: user_name,
              _id: element.user_id == user_id ? user_id : chat_user_id,
            },
            createdAt: new Date(element.timestamp),
            _id: parseInt(Math.random() * 100000),
          };
          chatMessages.splice(0, 0, chatItem);
          // console.log('chat items=====================', chatItem?.user?._id);
          setUser_type(chatItem?.user?._id);

          setMessages((previousMessages) =>
            GiftedChat.append(previousMessages, [chatItem]),
          );
          if (image === 'Chat') {
            setChatBadge(chatBadge + 1);
          } else {
            setChatBadge(0);
          }
        }
      });

    setChatActive(true);
  };
  //  Firebase Chatting ON SEND fucntion
  const onSend = useCallback((messages = [], type) => {
    var newItem = {
      user_id: user_id,
      user_name: user_name,
      text: type == 1 ? messages[0].text : messages,
      type: type,
      timestamp: database.ServerValue.TIMESTAMP,
    };
    // setuser_type(parseInt(type));
    // console.log('user type================================?', user_type);
    database()
      .ref('messages/' + chat_id)
      .push(newItem);
    var myInfo = {
      user_id: chat_user_id,
      name: chat_user_name,
      image: chat_user_image,
      message: messages[0].text,
      timestamp: database.ServerValue.TIMESTAMP,
    };
    database()
      .ref('chatLists/' + user_id + '/' + chat_user_id)
      .update(myInfo);

    var doctorInfo = {
      user_id: user_id,
      name: user_name,
      image: user_image,
      message: messages[0].text,
      timestamp: database.ServerValue.TIMESTAMP,
    };

    database()
      .ref('chatLists/' + chat_user_id + '/' + user_id)
      .update(doctorInfo);
  });
  // Image send render action
  const renderActions = (props) => {
    // console.log(props);
    return (
      <Actions
        {...props}
        options={{
          'Choose Image From Library': () => {
            choosePhoto();
          },
          Cancel: () => {
            console.log('Cancel');
          },
        }}
        optionTintColor="#222B45"
        icon={() => (
          <>
            {loadImg ? (
              <ActivityIndicator size="small" color={colors.themeColor} />
            ) : (
              <Icon name={'attachment'} size={28} color={colors.themeColor} />
            )}
          </>
        )}
        onSend={(args) => console.log(args)}
      />
    );
  };
  // selection for sending picture
  const choosePhoto = (type) => {
    const options = {
      mediaType: 'photo',
      maxWidth: 500,
      maxHeight: 500,
      quality: 0.8,
      includeBase64: true,
    };
    launchImageLibrary(options, (response) => {
      console.log('Response =============> ', response);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        // console.log(response);
        uploadImageToStorage(response.uri, response.fileName);
      }
    });
  };
  //   Uploading Image to firebase storage
  const uploadImageToStorage = (path, name) => {
    setLoadImg(true);
    let reference = storage().ref(name);
    let task = reference.putFile(path);
    task
      .then(async (e) => {
        console.log('Image uploaded to the bucket!', e);
        const url = await reference.getDownloadURL().catch((error) => {
          console.log(error);
        });
        onSend(url, 2);
        setLoadImg(false);
      })
      .catch((e) => {
        status = 'Something went wrong';
        console.log('uploading image error => ', e);
        setLoadImg(false);
      });
  };
  //UI screen to show

  return (
    <>
      <StatusBar backgroundColor={colors.black} />
      <View style={styles.callView}>
        {loading == true && (
          <>
            <Image
              source={assets.bgOverlay}
              style={[styles.loadingGif]}
              resizeMode={'cover'}
            />
            <Image
              source={
                patientDetail?.avatar
                  ? {uri: patientDetail?.avatar}
                  : {uri: assets.url}
              }
              borderRadius={100}
              style={[styles.callAvatar]}
            />
            <Text style={styles.callingText}>
              {patientDetail?.firstName + ' ' + patientDetail?.lastName}
            </Text>
            <Text style={styles.callingText1}>Calling . . .</Text>
          </>
        )}
        <OTSession
          apiKey={apiKey}
          sessionId={sessionId}
          token={token}
          options={
            Platform.OS === 'android' && {
              androidOnTop: 'publisher',
              useTextureViews: true,
              androidZOrder: 'onTop', // Android only - valid options are 'mediaOverlay' or 'onTop'
            }
          }
          eventHandlers={sessionEventHandlers}>
          <OTPublisher
            // publisherId={publisherId}
            properties={publisherProperties}
            eventHandlers={publisherEventHandlers}
            style={active ? styles.subscriberView : styles.publisherStyle}
            onTop
          />

          <OTSubscriber
            style={styles.publisherStyle}
            eventHandlers={subscriberEventHandlers}
            streamProperties={streamProperties}
          />
        </OTSession>
      </View>
      <View style={styles.buttonView2}>
        <View style={styles.flex(1)}>
          <TouchableOpacity
            style={styles.chat}
            activeOpacity={0.5}
            onPress={() => {
              setChatBadge(0);
              refPrescriptionModal.current.open();
            }}>
            <Image source={assets.prescribe} style={styles.alignSelf} />
          </TouchableOpacity>
        </View>
        <View style={styles.flex(1)}>
          <TouchableOpacity
            // onPress={() => {
            //   active ? dropCall() : navigation.goBack();
            // }}
            onPress={() => {
              dropCall();
              // navigation.goBack();
            }}>
            <Image source={assets.dropCall} style={styles.alignSelf} />
          </TouchableOpacity>
        </View>
        <View style={styles.flex(1)}>
          <View>
            {user_type !== user_id ? (
              <View>
                {chatBadge !== 0 ? (
                  <View style={styles.chatBadge}>
                    <Text style={styles.badgeCount}></Text>
                  </View>
                ) : null}
              </View>
            ) : null}

            <TouchableOpacity
              style={[styles.chat]}
              activeOpacity={0.5}
              onPress={() => {
                setChatBadge(0);
                setImage('check');
                refChatModal.current.open();
              }}
              onPressIn={() => {
                setChatBadge(0);
                setImage('Chat');
                refChatModal.current.close();
              }}>
              <Image source={assets.chatBlue} style={styles.alignSelf} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={styles.buttonView}>
        <View style={styles.flex(1)}>
          <TouchableOpacity onPress={() => changeCameraPosition()}>
            <Image source={assets.cam} style={styles.alignSelf} />
          </TouchableOpacity>
        </View>
        <View style={styles.flex(1)}>
          <TouchableOpacity onPress={() => toggleVideo()}>
            <Image
              source={localPublishVideo ? assets.videoOn : assets.videoOff}
              style={styles.alignSelf}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.flex(1)}>
          <TouchableOpacity onPress={() => toggleAudio()}>
            <Image
              source={localPublishAudio ? assets.micOn : assets.mic}
              style={styles.alignSelf}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* CHAT MODAL */}
      <Modal
        ref={refChatModal}
        position={'center'}
        swipeToClose={true}
        backdropOpacity={0.8}
        backButtonClose={true}
        entry={'top'}
        style={styles.ChatModalCall}
        onClosed={() => setImage('Chat')}>
        <View style={styles.chatView}>
          <Text style={styles.chatText}>{labels.chat}</Text>
          <GiftedChat
            messages={messages}
            isKeyboardInternallyHandled={false}
            onSend={(messages) => onSend(messages, 1)}
            user={{
              _id: user_id,
              avatar: chat_user_image,
              name: chat_user_name,
            }}
            isAnimated
            scrollToBottom={false}
            renderAvatar={null}
            textInputStyle={{color: colors.black}}
            timeTextStyle={{
              left: {color: colors.grey},
              right: {color: colors.white},
            }}
            renderActions={renderActions}
            renderBubble={(props) => {
              const color = props.currentMessage.read
                ? colors.themeColor
                : colors.white;
              return (
                <Bubble
                  {...props}
                  wrapperStyle={{left: {backgroundColor: color}}}
                />
              );
            }}
          />
        </View>
      </Modal>

      {/* Prescription MODAL */}
      <Modal
        ref={refPrescriptionModal}
        position={'center'}
        swipeToClose={false}
        backdropOpacity={0.8}
        backButtonClose={false}
        entry={'top'}
        style={[styles.PrescriptionModalCall]}>
        <DrAddPrescriptionModal
          onCloseModal={() => refPrescriptionModal.current.close()}
          consutationId={videoConsultationId}
        />
      </Modal>
    </>
  );
};

export default DrCall;
