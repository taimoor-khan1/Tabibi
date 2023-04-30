import React from 'react';
import {View, Image, Text} from 'react-native';
import styles from '../assets/styles';
import {assets} from '../assets/images';
import labels from '../config/Labels';
import colors from '../config/Colors';

const DrScheduleItem = ({date, time, beforeTime, name}) => {
  return (
    <View
      style={[
        styles.margin(20),
        styles.ConsuDetailItmCont1,
        styles.padding(20),
        styles.borderShadow,
      ]}>
      <View style={[styles.flexRow, styles.justifyCntSP]}>
        <View style={[styles.alignItemsFlexStart]}>
          <Text style={[styles.consulTitle, styles.fontSize(14)]}>
            {labels.videoConsultation}
          </Text>
        </View>
        <View style={[styles.alignItemsFlexend]}>
          <Text style={[styles.consulDetailVideo]}>{date}</Text>
        </View>
      </View>
      <View>
        <Text style={styles.scheduleTitle}>{name}</Text>
        <View
          style={[styles.flexRow, styles.alignItemsFlexStart, styles.mT(5)]}>
          <Image source={assets.watch} style={styles.watch} />
          <Text style={[styles.consulVideo, styles.mT(3)]}>{time}</Text>
        </View>
        <View style={[styles.flexRow, styles.alignItemsFlexStart]}>
          <Image source={assets.blueBellM} style={styles.mR(5)} />
          <Text
            style={[
              styles.consulVideo,
              styles.mT(2),
              styles.color(colors.grey),
            ]}>
            {beforeTime}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default DrScheduleItem;
