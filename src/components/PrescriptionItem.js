import React from 'react';
import {View, Text} from 'react-native';
import styles from '../assets/styles';
import labels from '../config/Labels';

const PrescriptionItem = ({navigation, description, title, duration}) => {
  return (
    <>
      <View style={[styles.flex(1)]}>
        <Text
          style={[styles.consulDetailTitle, styles.fontSize(13)]}
          numberOfLines={1}
          ellipsizeMode="tail">
          {title}
        </Text>
        <Text style={[styles.consulDetailVideo]}>
          {labels.dosage + description}
        </Text>
        <Text style={[styles.consulDetailVideo]}>
          {labels.duration + duration}
        </Text>
      </View>
    </>
  );
};

export default PrescriptionItem;
