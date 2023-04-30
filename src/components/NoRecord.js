import React from 'react';
import {View, Text} from 'react-native';
import styles from '../assets/styles';
import labels from '../config/Labels';

const NoRecordComponent = ({loading = false, title = false}) => {
  return (
    <View style={[styles.flex(1), styles.justifyContent, styles.alignItems]}>
      {loading ? (
        <Text style={styles.noRecord}>{title}</Text>
      ) : (
        <Text style={styles.noRecord}>{labels.noData}</Text>
      )}
    </View>
  );
};

export default NoRecordComponent;
