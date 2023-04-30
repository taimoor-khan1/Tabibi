import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from 'react-native';
import styles from '../assets/styles';
import colors from '../config/Colors';
import LinearGradient from 'react-native-linear-gradient';
import {assets} from '../assets/images';

const SearchTabber = ({
  selectedIndex,
  setSelectedIndex,
  tab1,
  tab2,
  onTabPress = () => {},
}) => {
  return (
    <View style={[styles.flexRow, styles.mT(20)]}>
      <TouchableOpacity
        onPress={() => {
          setSelectedIndex(0);
        }}
        style={[
          styles.flex(1),
          styles.searchTabberUnSelectedView,
          selectedIndex === 0 && styles.searchTabberSelectedView,
        ]}>
        <Text
          style={[
            styles.activeTabTextStyle2,
            styles.padding(15),
            selectedIndex === 0
              ? styles.color(colors.black)
              : styles.color(colors.grey),
          ]}
          numberOfLines={2}>
          {tab1}
        </Text>
        {selectedIndex === 0 && (
          <Image
            source={assets.dropDown}
            style={styles.searchTabberDropDownImage}
          />
        )}
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          setSelectedIndex(1);
        }}
        style={[
          styles.flex(1),
          styles.searchTabberUnSelectedView,
          selectedIndex === 1 && styles.searchTabberSelectedView,
        ]}>
        <Text
          style={[
            styles.activeTabTextStyle2,
            styles.padding(15),
            selectedIndex === 1
              ? styles.color(colors.black)
              : styles.color(colors.grey),
          ]}
          numberOfLines={2}>
          {tab2}
        </Text>
        {selectedIndex === 1 && (
          <Image
            source={assets.dropDown}
            style={styles.searchTabberDropDownImage}
          />
        )}
      </TouchableOpacity>
    </View>
  );
};
export default SearchTabber;
