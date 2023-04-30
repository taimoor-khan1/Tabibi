import React from 'react';
import styles from '../assets/styles';
import labels from '../config/Labels';
import colors from '../config/Colors';
import {assets} from '../assets/images';
import {Text, Image, TouchableOpacity} from 'react-native';

const PatientItem = ({
  image = false,
  title,
  onBtnPress = () => {},
  show = true,
  status = false,
}) => {
  return (
    <>
      <TouchableOpacity
        activeOpacity={show ? 0.7 : 1}
        style={[styles.mV(10), styles.patientItmCont, styles.borderShadow]}
        onPress={() => {
          show ? onBtnPress() : null;
        }}>
        <Image
          source={image ? {uri: image} : assets.avatar}
          style={[styles.patientImg]}
          borderRadius={35}
        />
        <Text
          style={[styles.textMedium, styles.color(colors.black), styles.mT(30)]}
          numberOfLines={1}
          ellipsizeMode="tail">
          {title}
        </Text>
        {show ? (
          <Text
            style={[styles.viewDetail, styles.mT(10)]}
            numberOfLines={2}
            ellipsizeMode="tail">
            {labels.viewDetail}
          </Text>
        ) : (
          <Text
            style={[
              styles.viewDetail,
              styles.mT(10),
              {textTransform: 'capitalize'},
            ]}
            numberOfLines={2}
            ellipsizeMode="tail">
            {status}
          </Text>
        )}
      </TouchableOpacity>
    </>
  );
};

export default PatientItem;
