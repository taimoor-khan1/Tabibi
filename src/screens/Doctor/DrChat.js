import React, {useEffect, useState, useCallback} from 'react';
import styles from '../../assets/styles';
import colors from '../../config/Colors';
import {Icon} from 'react-native-elements';
import {launchImageLibrary} from 'react-native-image-picker';
import {View, ActivityIndicator} from 'react-native';
import labels from '../../config/Labels';
import {GiftedChat, Bubble, Actions} from 'react-native-gifted-chat';
import {GreadientHeader} from '../../components';
import database from '@react-native-firebase/database';
import storage from '@react-native-firebase/storage';
import {useSelector} from 'react-redux';

const DrChat = ({navigation, route}) => {
  // Redux Store
  const {user, profile, role} = useSelector((state) => state.Auth);

  // Declare state variables'
  const {id, image, name} = route.params;
  const [messages, setMessages] = useState([]);
  const [user_id] = useState(profile?.userId.replace(/-/g, '')); // sender id own
  const [user_name] = useState(profile?.name); // sender name own
  const [user_image] = useState(profile?.avatar); // sender image own
  const [chat_user_id] = useState(id.replace(/-/g, ''));
  const [chat_id, setChat_id] = useState('');
  const [chat_user_name] = useState(name);
  const [chat_user_image] = useState(image);
  const [loadImg, setLoadImg] = useState(false);

  // Firebase listner work
  useEffect(() => {
    firebase_listner();
  }, []);

  useEffect(() => {
    const subscribe = async () => {
      await database()
        .ref('chats/' + chat_id)
        .messageRef.off('value');
      await database()
        .ref('messages/' + chat_id)
        .messageRef.off('value');
    };
    return subscribe;
  }, []);

  const renderCustomPopup = ({
    appIconSource,
    appTitle,
    timeText,
    title,
    body,
  }) => (
    <View>
      <Text>{title}</Text>
      <Text>{body}</Text>
      <Button
        title="My button"
        onPress={() => console.log('Popup button onPress!')}
      />
    </View>
  );

  const firebase_listner = async () => {
    var chat_id = '';
    if (user_id < chat_user_id) {
      setChat_id(user_id + chat_user_id);
      chat_id = user_id + chat_user_id;
      database()
        .ref('chats/' + chat_id)
        .update({
          user1_id: user_id,
          user1_name: user_name,
        });
    } else {
      setChat_id(chat_user_id + user_id);
      chat_id = chat_user_id + user_id;
      database()
        .ref('chats/' + chat_id)
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
          var chatItem = {
            [element.type == 1 ? 'text' : 'image']: element.text,
            user: {
              // name: 'Name',
              _id: element.user_id == user_id ? user_id : chat_user_id,
            },
            createdAt: new Date(element.timestamp),
            _id: parseInt(Math.random() * 100000),
          };
          chatMessages.splice(0, 0, chatItem);
          setMessages((previousMessages) =>
            GiftedChat.append(previousMessages, [chatItem]),
          );
        }
      });

    <NotificationPopup
      // ref={ref =>  = ref}
      renderPopupContent={renderCustomPopup}
      shouldChildHandleResponderStart={true}
      shouldChildHandleResponderMove={true}
    />;
  };

  const onSend = useCallback((messages = [], type) => {
    var newItem = {
      user_id: user_id,
      user_name: user_name,
      text: type == 1 ? messages[0].text : messages,
      type: type,
      timestamp: database.ServerValue.TIMESTAMP,
    };
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

    database()
      .ref('chats/' + chat_user_id + '/' + chat_id)
      .once('value', async (snapShot) => {
        console.log(
          'snapShot.val()',
          snapShot,
          snapShot.val()?.unread_count,
          chat_user_id,
          chat_id,
        );
        if (snapShot.val() === null) {
          await database()
            .ref('chats/' + chat_user_id + '/' + chat_id)
            .set({
              myInfo,
              unread_count: 0,
              timestamp: database?.ServerValue?.TIMESTAMP,
            });
        } else {
          await database()
            .ref('chats/' + chat_user_id + '/' + chat_id)
            .update({
              timestamp: database?.ServerValue?.TIMESTAMP,
              unread_count: snapShot?.val()?.unread_count + 1,
            });
        }
      });
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

  //Image picker for attachement
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

  // Uploading Image to firebase storage
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
  return (
    <View style={[styles.chatView, {backgroundColor: colors.themeWhite}]}>
      <GreadientHeader
        showLeftIcon={true}
        showRightIcon={false}
        showCenterText={route.params.name}
        showLeftText={labels.back}
        back={true}
        leftRoute={() => navigation.goBack()}
      />
      <GiftedChat
        messages={messages}
        isKeyboardInternallyHandled={true}
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
  );
};
export default DrChat;
