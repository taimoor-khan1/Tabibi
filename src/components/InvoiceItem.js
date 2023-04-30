import React from 'react';
import {View, Text} from 'react-native';
import styles from '../assets/styles';

const InvoiceItem = ({title1, subText1, title2, subText2}) => {
  return (
    <>
      <View style={[styles.flex(1)]}>
        <View style={[styles.flexRow, styles.justifyCntSP]}>
          <View style={[styles.flex(0.5), styles.alignItemsFlexStart]}>
            <Text
              style={[styles.consulDetailTitle, styles.fontSize(13)]}
              numberOfLines={1}
              ellipsizeMode="tail">
              {title1}
            </Text>
            <Text style={[styles.consulDetailVideo]}>{subText1}</Text>
          </View>
          <View style={[styles.flex(0.5), styles.alignItemsFlexend]}>
            <Text
              style={[styles.consulDetailTitle, styles.fontSize(13)]}
              numberOfLines={1}
              ellipsizeMode="tail">
              {title2}
            </Text>
            <Text style={[styles.consulDetailVideo]}>{subText2}</Text>
          </View>
        </View>
      </View>
    </>
  );
};

export default InvoiceItem;
