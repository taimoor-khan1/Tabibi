import React, {useEffect, useState} from 'react';
import {View, Image, Text, TouchableOpacity, ScrollView} from 'react-native';
import styles from '../assets/styles';
import {assets} from '../assets/images';

const LovedOnesItem = ({
  data,
  isSelected = false,
  from = false,
  onItemPress = () => {},
}) => {
  const [lovedOnes, setLovedOnes] = useState(data);
  useEffect(() => {
    setLovedOnes(data);
  }, [data]);
  return (
    <>
      <ScrollView
        style={[styles.mT(15)]}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        bounce={false}>
        {lovedOnes.map((item, index) => {
          return (
            <TouchableOpacity
              activeOpacity={1}
              style={[styles.selectionCont]}
              onPress={() => {
                onItemPress(item.id);
              }}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  onItemPress(item.id);
                }}
                style={[styles.selectCont, styles.borderShadow]}>
                <View style={[styles.flexRow]}>
                  <Image
                    source={
                      isSelected === item.id
                        ? assets.checkedBox
                        : assets.checkbox
                    }
                    style={styles.mR(5)}
                  />
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={[
                      styles.selectTitle,
                      styles.flex(1),
                    ]}>{`${item.firstName} ${item.lastName}`}</Text>
                </View>
              </TouchableOpacity>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </>
  );
};
export default LovedOnesItem;
