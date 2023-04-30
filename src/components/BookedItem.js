import React from 'react';
import styles from '../assets/styles';
import colors from '../config/Colors';
import {assets} from '../assets/images';
import {View, Text, Image, TouchableOpacity, I18nManager} from 'react-native';

const BookedItem = ({title, time, onPress = () => {}}) => {
  return (
    <>
      <TouchableOpacity
        activeOpacity={0.7}
        style={[styles.mV(10), styles.bookedItemCont, styles.borderShadow]}
        onPress={() => onPress()}>
        <View style={styles.flexRow}>
          <Image
            source={assets.avatar}
            style={styles.bookImg}
            borderRadius={20}
          />
          <View style={styles.flex(1)}>
            <Text
              style={[
                styles.textMedium,
                styles.color(colors.black),
                styles.mT(5),
              ]}
              numberOfLines={2}
              ellipsizeMode="tail">
              {title}
            </Text>
            <Text
              style={[styles.textLightBlack, styles.mT(5)]}
              numberOfLines={2}>
              {time}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </>
  );
};

export default BookedItem;
