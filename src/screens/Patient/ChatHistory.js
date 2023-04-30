import React, {useEffect, useRef, useState, useCallback} from 'react';
import styles from '../../assets/styles';
import colors from '../../config/Colors';
import {assets} from '../../assets/images';
import labels from '../../config/Labels';
import {View, Text, Image, ScrollView} from 'react-native';
import {GreadientHeader, ChatItem} from '../../components';
import database from '@react-native-firebase/database';
import {useSelector} from 'react-redux';

const ChatHistory = ({navigation}) => {
  // Redux Store
  const {profile} = useSelector((state) => state.Auth);

  // Declare state variables'
  const [user_id, setUser_id] = useState(profile?.userId?.replace(/-/g, ''));
  const [inbox, setInbox] = useState([]);
  const [isloading, setIsLoading] = useState(false);

  //Functions

  //Call Firebase Listner
  useEffect(() => {
    firebase_listner();
  }, []);

  //Firebase Listner for Chat History
  const firebase_listner = async () => {
    var inboxArray = [];
    await database()
      .ref('chatLists/' + user_id)
      .on('child_added', async (snapshot) => {
        inboxArray.push(snapshot.val());
        inboxArray = Object.values(
          inboxArray.reduce(
            (acc, cur) => Object.assign(acc, {[cur.timestamp]: cur}),
            {},
          ),
        );
        setInbox(inboxArray);
      });
  };
  return (
    <>
      <View style={[styles.flex(1), styles.backgroundColor(colors.themeWhite)]}>
        <GreadientHeader
          showLeftIcon={true}
          showRightIcon={false}
          showCenterText={labels.chat}
          showLeftText={labels.back}
          back={true}
          leftRoute={() => navigation.goBack()}
        />
        <Image source={assets.bottom_image} style={styles.bottomImg} />
        <View style={styles.height(40)} />
        <ScrollView>
          <View style={styles.mH(20)}>
            {inbox.length > 0 ? (
              inbox
                .sort((item1, item2) => item1.timestamp < item2.timestamp)
                .map((item, index) => {
                  return (
                    <ChatItem
                      image={item?.image}
                      name={item?.name}
                      text={item?.message}
                      time={item?.timestamp}
                      onItemPress={() =>
                        navigation.navigate('Chat', {
                          name: item?.name,
                          image: item?.image,
                          id: item?.user_id,
                        })
                      }
                    />
                  );
                })
            ) : (
              <Text style={[styles.error, styles.errorHeight]}>
                {isloading ? 'Please wait . . .' : labels.emptyInbox}
              </Text>
            )}
          </View>
        </ScrollView>
      </View>
    </>
  );
};

export default ChatHistory;
