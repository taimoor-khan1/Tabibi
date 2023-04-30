import React from 'react';
import styles from '../assets/styles';
import {View, Text, Image, TouchableOpacity, Platform} from 'react-native';
import {assets} from '../assets/images';

const ChatItem = ({
  navigation,
  image,
  name,
  text,
  time,
  onItemPress = () => {},
}) => {
  const timeSince = (timeStamp) => {
    var now = new Date(),
      secondsPast = (now.getTime() - timeStamp) / 1000;
    if (secondsPast < 60) {
      return parseInt(secondsPast) + ' secs ago';
    }
    if (secondsPast < 3600) {
      return parseInt(secondsPast / 60) + ' mins ago';
    }
    if (secondsPast <= 86400) {
      return parseInt(secondsPast / 3600) + ' hours ago';
    }
    if (secondsPast > 86400) {
      timeStamp = new Date(timeStamp);
      var day = timeStamp.getDate();
      var month = timeStamp
        .toDateString()
        .match(/ [a-zA-Z]*/)[0]
        .replace(' ', '');
      var year =
        timeStamp.getFullYear() == now.getFullYear()
          ? ''
          : ' ' + timeStamp.getFullYear();
      return day + ' ' + month + year;
    }
  };
  return (
    <>
      <TouchableOpacity
        onPress={() => onItemPress()}
        activeOpacity={0.7}
        style={[styles.chatCont, styles.borderShadow]}>
        <View style={[styles.rowCont, styles.flex(1)]}>
          <View style={[styles.alignItems('flex-start')]}>
            <Image
              source={image ? {uri: image} : assets.avatar}
              style={styles.chatHimg}
              borderRadius={Platform.OS === 'ios' ? 50 : 50}
            />
          </View>
          <View style={[styles.flex(0.75)]}>
            <Text
              style={[styles.textSemiBold]}
              numberOfLines={2}
              ellipsizeMode="tail">
              {name}
            </Text>
            <Text
              style={[styles.textLight]}
              numberOfLines={1}
              ellipsizeMode={'tail'}>
              {text}
            </Text>
          </View>
          <View style={[styles.flex(0.3), styles.alignItems('flex-end')]}>
            <Text
              style={[styles.textLightBlack, styles.fontSize(11)]}
              numberOfLines={2}
              ellipsizeMode={'tail'}>
              {timeSince(time)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </>
  );
};
export default ChatItem;
