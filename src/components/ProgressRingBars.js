import React from 'react';
import {View, Text} from 'react-native';

import styles from '../assets/styles';
import Labels from '../config/Labels';
import colors from '../config/Colors';
import {ProgressCircle} from 'react-native-svg-charts';

const ProgressRingBars = ({
  availableCount = 0,
  cancelledCount = 0,
  Container = {},
  progress = [],
}) => {
  return (
    <View style={[styles.flexRow, styles.justifyCntSA, styles.alignItemCenter]}>
      <View>
        <View style={[styles.flexRow, styles.alignItemCenter]}>
          <View style={styles.circleBlue} />
          <Text style={styles.fontPoppinsSemiBoldDarkTheme18}>
            {availableCount}
          </Text>
        </View>
        <Text style={styles.fontPoppinsMediumDarkTheme12}>
          {Labels.available}
        </Text>
      </View>
      <View
        style={[
          styles.alignItems('center'),
          styles.justifyContent,
          styles.flexRow,
          Container,
        ]}>
        {progress.map((item, index) => (
          <ProgressCircle
            key={index}
            style={{
              height: `${100 - (index > 0 ? index * 30 : 0)}%`,
              width: `${100 - (index > 0 ? index * 30 : 0)}%`,
              position: 'absolute',
            }}
            progress={item.value}
            progressColor={item.color}
            strokeWidth={17}
            backgroundColor={colors.greyAA}
            cornerRadius={0}
          />
        ))}
      </View>
      <View>
        <View style={[styles.flexRow, styles.alignItemCenter]}>
          <View style={styles.circleRed} />
          <Text style={styles.fontPoppinsSemiBoldDarkTheme18}>
            {cancelledCount}
          </Text>
        </View>
        <Text style={styles.fontPoppinsMediumDarkTheme12}>
          {Labels.booked}
        </Text>
      </View>
    </View>
  );
};

export default ProgressRingBars;
