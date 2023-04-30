import React, {useEffect, useRef, useState} from 'react';
import {View, Image, Text} from 'react-native';
import styles from '../../assets/styles';
import {assets} from '../../assets/images';
import labels from '../../config/Labels';
import colors from '../../config/Colors';
import {Card} from 'react-native-shadow-cards';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import Medical from './Medical';
import Surgical from './Surgical';
import {GreadientHeader} from '../../components';

const History = ({navigation}) => {
  // Declare state variables'
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {key: 'first', title: labels.Surgical},
    {key: 'second', title: labels.Medical},
  ]);
  // Declare input reference field

  //Fuctions
  const renderScene = SceneMap({
    first: () => <Medical navigation={navigation} />,
    second: () => <Surgical navigation={navigation} />,
  });

  const renderLabel = ({route, focused}) => {
    return (
      <Text style={focused ? styles.activeTab1 : styles.inActiveTab1}>
        {route.title}
      </Text>
    );
  };
  return (
    <>
      <View style={[styles.flex(1), styles.backgroundColor(colors.themeWhite)]}>
        <GreadientHeader
          showLeftIcon={true}
          showCenterText={labels.history}
          showLeftText={labels.back}
          back={true}
          leftRoute={() => [navigation.goBack()]}
        />
        <Image source={assets.bottom_image} style={styles.bottomImg} />
        <View style={styles.height(20)} />
        <TabView
          renderTabBar={(props) => (
            <View style={[styles.tabbarView]}>
              <Card
                style={[styles.height(45)]}
                elevation={5}
                cornerRadius={50}>
                <TabBar
                  {...props}
                  renderLabel={renderLabel}
                  indicatorStyle={[styles.indicatorStyle]}
                  style={styles.tabbar}
                />
              </Card>
            </View>
          )}
          navigationState={{index, routes, navigation}}
          renderScene={renderScene}
          onIndexChange={setIndex}
        />
      </View>
    </>
  );
};

export default History;
