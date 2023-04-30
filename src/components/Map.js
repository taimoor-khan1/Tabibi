import React, {useState, useEffect} from 'react';
import {View, Platform, PermissionsAndroid} from 'react-native';
import styles from '../assets/styles';
import labels from '../config/Labels';
import Toast from 'react-native-simple-toast';
import {ButtonSmall, MapMarker} from '../components';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import AsyncStorage from '@react-native-community/async-storage';
import Geolocation from '@react-native-community/geolocation';

const LATITUDE_DELTA = 0.0119;
const LONGITUDE_DELTA = 0.1;

const Map = ({list}) => {
  // Declare state variables'
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [locations, setLocations] = useState([]);
  const [region, setRegion] = useState({
    latitude: 24.7136,
    longitude: 46.6753,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });
  // Request Permission
  useEffect(() => {
    requestPermission();
    getLocationList();
  }, []);
  const getLocationList = () => {
    const listLoc = list.map((item) => {
      return {
        locations: item?.location,
        name: item?.fullName,
        avatar: item?.avatar,
      };
    });
    setLocations(listLoc);
  };
  // Fuction for permission
  const requestPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      var authorized = 'granted';
      if (authorized === granted) {
        Toast.show('Permission Granted');
        getInitialState();
        await geoLocation();
      } else {
        // Toast.show('Permission Denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };
  // Funtion for Initial state
  const getInitialState = () => {
    return {
      region: {
        latitude: latitude,
        longitude: longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
    };
  };
  // Function for Geo Location
  const geoLocation = async () => {
    var position = await AsyncStorage.getItem('position');
    if (position == null) {
      Geolocation.getCurrentPosition(
        async (position) => {
          await AsyncStorage.removeItem('position');
          await AsyncStorage.setItem('position', JSON.stringify(position));
          setLatitude(parseFloat(position.coords.latitude));
          setLongitude(parseFloat(position.coords.longitude));
        },
        (error) => console.log(error),
        {enableHighAccuracy: false, timeout: 200000, maximumAge: 1000},
      );
    } else {
      setLatitude(JSON.parse(position).coords.latitude);
      setLongitude(JSON.parse(position).coords.longitude);
    }
  };
  // Function for Region Change
  const onRegionChange = (region) => {
    setRegion({region});
  };
  return (
    <>
      <View style={[styles.mV(15), styles.MapCont, styles.borderShadow]}>
        <View style={styles.mapCurved}>
          <MapView.Animated
            style={styles.mapViewS}
            provider={Platform.OS == 'android' && PROVIDER_GOOGLE}
            region={region}
            showsUserLocation={true}
            showsCompass={true}
            showsScale={true}
            showsBuildings={true}
            zoomTapEnabled={true}>
            {locations.map((item, index) => {
              return item?.locations?.map((a, b) => {
                return (
                  <MapView.Marker key={b + index} coordinate={a}>
                    <MapMarker
                      name={item.name}
                      subtext={`${a.city} ${a.address}`}
                      image={item.avatar}
                    />
                  </MapView.Marker>
                );
              });
            })}
          </MapView.Animated>
        </View>
        {/* <View style={styles.MapBtn}>
          <ButtonSmall title={labels.seemore} />
        </View> */}
      </View>
    </>
  );
};
export default Map;
