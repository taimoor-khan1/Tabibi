import React, {useEffect, useRef, useState} from 'react';
import {View, ScrollView, FlatList} from 'react-native';
import styles from '../../assets/styles';
import {HistoryItem, NoRecordComponent} from '../../components';

export default Surgical = ({navigation, route}) => {
  // Declare state variables'

  // Declare input reference field

  //Fuctions
  const ListArr = [
    // {
    //   title: 'You have consulted with Dr.John Watson for skin problem',
    //   date: '08 May 2021',
    // },
    // {
    //   title: 'You have consulted with Dr.John Watson for skin problem',
    //   date: '08 May 2021',
    // },
    // {
    //   title: 'You have consulted with Dr.John Watson for skin problem',
    //   date: '08 May 2021',
    // },
  ];
  return (
    <>
      <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
        <View style={styles.height(20)} />
        <FlatList
          scrollEnabled={true}
          data={ListArr}
          showsVerticalScrollIndicator={false}
          style={styles.flex(1)}
          ListEmptyComponent={
            <View style={styles.mT(150)}>
              <NoRecordComponent />
            </View>
          }
          renderItem={({item, index}) => (
            <>
              <HistoryItem
                onPress={() =>
                  navigation.navigate('Profile', {
                    data: item,
                  })
                }
                title={item.title}
                date={item.date}
              />
            </>
          )}
        />
      </ScrollView>
    </>
  );
};
