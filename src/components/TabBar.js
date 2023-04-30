import React, {useState, useRef} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  FlatList,
  I18nManager,
} from 'react-native';
import styles from '../assets/styles';
import colors from '../config/Colors';
import LinearGradient from 'react-native-linear-gradient';

const TabBarr = ({index = 0, handelSelection = () => {}, Tab = []}) => {
  const [selectedIndex, setSelectedIndex] = useState(index);
  const scrollRef = useRef();

  return (
    <View style={[styles.pB(5)]}>
      <FlatList
        ref={scrollRef}
        data={Tab}
        horizontal
        style={{alignSelf: 'flex-start'}}
        showsHorizontalScrollIndicator={false}
        renderItem={({item, index}) => (
          <View style={index === 0 && [styles.mL(20)]}>
            <View style={[styles.moreListBorder, styles.mT(20), styles.mH(5)]}>
              <View style={styles.flexRow}>
                <LinearGradient
                  colors={
                    selectedIndex == index
                      ? I18nManager.isRTL
                        ? [colors.btngr3, colors.btngr2, colors.btngr1]
                        : [colors.btngr1, colors.btngr2, colors.btngr3]
                      : [colors.taber, colors.taber, colors.taber]
                  }
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={[
                    styles.flex(1),
                    selectedIndex == index
                      ? styles.activeTabStyle
                      : styles.inActiveTabStyle,
                  ]}>
                  <TouchableOpacity
                    onPress={() => {
                      scrollRef?.current?.scrollToIndex({
                        animated: true,
                        index: index,
                      }),
                        handelSelection(index),
                        setSelectedIndex(index);
                    }}>
                    <Text
                      style={[
                        styles.activeTabTextStyle2,
                        selectedIndex === index
                          ? {color: colors.white}
                          : {color: colors.text},
                      ]}
                      numberOfLines={2}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                </LinearGradient>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default TabBarr;
