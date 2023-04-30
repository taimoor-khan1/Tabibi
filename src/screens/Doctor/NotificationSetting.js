import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Image,
  Text,
  ScrollView,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import styles from '../../assets/styles';
import {assets} from '../../assets/images';
import labels from '../../config/Labels';
import colors from '../../config/Colors';
import fonts from '../../assets/fonts';
import {
  GreadientHeader,
  NotificationItem,
  NoRecordComponent,
  ButtonGradient,
  ButtonWhite,
  ButtonSmall,
} from '../../components';
import {Icon, Input} from 'react-native-elements';
import Snackbar from 'react-native-snackbar';
import ReactNativePickerModule from 'react-native-picker-module';
import {
  createNotifcation,
  getNotificationSettings,
  deleteNotifcation,
  updateNotifcation,
} from '../../store/actions';
import {useDispatch, useSelector} from 'react-redux';
import TabBarr from '../../components/TabBar';
import AddBtn from '../../components/AddBtn';
import ReactNativeModal from 'react-native-modal';

const NotificationSetting = ({navigation, route}) => {
  //Redux STORE
  const dispatch = useDispatch();
  const {notificationSetting} = useSelector((state) => state.Doctor);

  // Declare input reference field
  const refPicker = useRef();

  // Declare state variables'
  const [slot, setSlot] = useState('');
  const [slotValue, setSlotValue] = useState('');
  const [timeData] = useState([
    {time: '1 hour', value: 1},
    {time: '2 hour', value: 2},
    {time: '3 hour', value: 3},
    {time: '4 hour', value: 4},
    {time: '5 hour', value: 5},
    {time: '6 hour', value: 6},
    {time: '7 hour', value: 7},
    {time: '8 hour', value: 8},
    {time: '9 hour', value: 9},
    {time: '10 hour', value: 10},
    {time: '11 hour', value: 11},
    {time: '12 hour', value: 12},
    {time: '13 hour', value: 13},
    {time: '14 hour', value: 14},
    {time: '15 hour', value: 15},
    {time: '16 hour', value: 16},
    {time: '17 hour', value: 17},
    {time: '18 hour', value: 18},
    {time: '19 hour', value: 19},
    {time: '20 hour', value: 20},
    {time: '21 hour', value: 21},
    {time: '22 hour', value: 22},
    {time: '23 hour', value: 23},
    {time: '24 hour', value: 24},
    {time: '2 Days', value: 25},
    {time: '3 Days', value: 26},
    {time: '4 Days', value: 27},
    {time: '5 Days', value: 28},
    {time: '6 Days', value: 29},
    {time: '1 week', value: 30},
    {time: '2 weeks', value: 31},
  ]);
  const [status, setStatus] = useState('pre-appointment');
  const [deletePopup, setDeleletePopup] = useState(false);
  const [deleteId, setDeleteId] = useState('');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [onAddPopup, setOnAppPopup] = useState(false);
  const [onUpdatePopup, setUpdatePopup] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(
    route?.params?.index ? route?.params?.index : 0,
  );
  const [TabsList] = useState([
    {name: labels.PreAppointment},
    {name: labels.Post},
    {name: labels.FollowUp},
  ]);

  // GET My Notification
  useEffect(() => {
    dispatch(getNotificationSettings());
  }, []);

  //Render for No item
  function noItem() {
    return (
      <View style={styles.mT(150)}>
        <NoRecordComponent title="No notification found" loading={true} />
      </View>
    );
  }
  //Funtion for Create new notification
  const createNotif = () => {
    const validation = `${
      !title.trim()
        ? labels.validationNotificationTitle
        : !desc.trim()
        ? labels.validationNotificationDes
        : true
    }`;
    if (validation === 'true') {
      const data = {
        title: title,
        description: desc,
        type: status,
      };
      slotValue && slotValue ? (data['time'] = slotValue) : '',
        dispatch(createNotifcation(data, true)).then((res) => {
          if (res === 200) {
            setOnAppPopup(false);
            dispatch(getNotificationSettings());
            setTitle('');
            setSlotValue('');
            setDesc('');
          }
        });
    } else {
      Snackbar.show({
        text: validation,
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: colors.themeColor,
        fontFamily: fonts.PoppinsMedium,
        textColor: colors.dim,
      });
    }
  };
  //Funtion for Delete Notification
  const onDelete = (id) => {
    setDeleletePopup(false);
    dispatch(deleteNotifcation({id}, true)).then((res) => {
      if (res === 200) {
        dispatch(getNotificationSettings());
      }
    });
  };
  const onUpdate = (id) => {};
  return (
    <>
      <View style={[styles.flex(1), styles.backgroundColor(colors.themeWhite)]}>
        <GreadientHeader
          showLeftIcon={true}
          showRightIcon={false}
          showCenterText={labels.NotificationSettings}
          showLeftText={labels.back}
          back={true}
          leftRoute={() => navigation.goBack()}
        />
        <Image source={assets.bottom_image} style={styles.bottomImg} />
        <View style={styles.height(10)} />
        <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
          <TabBarr
            Tab={TabsList.map((item) => item.name)}
            handelSelection={(e) => {
              setSelectedIndex(e);
              setStatus(
                e === 0
                  ? 'pre-appointment'
                  : e === 1
                  ? 'post-appointment'
                  : e === 2
                  ? 'follow-up'
                  : '',
              );
            }}
            index={selectedIndex}
          />
          <View style={[styles.mH(20), styles.mB(10)]}>
            {selectedIndex == 0 && (
              <FlatList
                scrollEnabled={true}
                data={notificationSetting.filter(
                  (filter) => filter.type === 'pre-appointment',
                )}
                showsVerticalScrollIndicator={false}
                style={styles.flex(1)}
                ListEmptyComponent={noItem}
                renderItem={({item, index}) => (
                  <>
                    <NotificationItem
                      title={item.title}
                      time={item.createdAt}
                      date={item.createdAt}
                      descripton={item.description}
                      notifset={true}
                      onDelete={() => {
                        setDeleteId(item?.id);
                        setDeleletePopup(true);
                      }}
                    />
                  </>
                )}
              />
            )}
            {selectedIndex == 1 && (
              <FlatList
                scrollEnabled={true}
                data={notificationSetting.filter(
                  (filter) => filter.type === 'post-appointment',
                )}
                showsVerticalScrollIndicator={false}
                style={styles.flex(1)}
                ListEmptyComponent={noItem}
                renderItem={({item, index}) => (
                  <>
                    <NotificationItem
                      title={item.title}
                      time={item.createdAt}
                      date={item.createdAt}
                      descripton={item.description}
                      notifset={true}
                      onDelete={(e) => {
                        setDeleteId(item?.id);
                        setDeleletePopup(true);
                      }}
                    />
                  </>
                )}
              />
            )}
            {selectedIndex == 2 && (
              <FlatList
                scrollEnabled={true}
                data={notificationSetting.filter(
                  (filter) => filter.type === 'follow-up',
                )}
                showsVerticalScrollIndicator={false}
                style={styles.flex(1)}
                ListEmptyComponent={noItem}
                renderItem={({item, index}) => (
                  <>
                    <NotificationItem
                      title={item.title}
                      time={item.createdAt}
                      date={item.createdAt}
                      descripton={item.description}
                      notifset={true}
                      onDelete={(e) => {
                        setDeleteId(item?.id);
                        setDeleletePopup(true);
                      }}
                    />
                  </>
                )}
              />
            )}
          </View>
        </ScrollView>

        {/* {selectedIndex === 2 &&
          notificationSetting.filter(
            (filter) => filter.type === 'follow-up',
          ) && ( */}
            <AddBtn
              type={false}
              onBtnPress={() =>
                // selectedIndex === 2 &&
                // notificationSetting.filter(
                //   (filter) => filter.type === 'follow-up',
                // ) &&
                setOnAppPopup(true)
              }
            />
          {/* )} */}

        {/* CREATE NOTIFICATION MODAL */}
        <ReactNativeModal
          backdropOpacity={0.5}
          isVisible={onAddPopup}
          onBackdropPress={() => Keyboard.dismiss()}>
          <KeyboardAvoidingView
            style={styles.flex(0.8)}
            behavior={Platform.OS == 'ios' && 'padding'}>
            <View style={[styles.aboutMePopUpContainer]}>
              <TouchableOpacity
                hitSlop={styles.hitSlop}
                style={[styles.modalCrossIcon]}
                onPress={() => {
                  setSlot('');
                  setOnAppPopup(false);
                }}>
                <Image source={assets.close} />
              </TouchableOpacity>
              <Text
                style={[
                  styles.h2,
                  styles.textAlign,
                  styles.mT(10),
                  styles.mH(20),
                ]}>
                {selectedIndex === 0
                  ? labels.AddPreAppointmentNotification
                  : selectedIndex === 1
                  ? labels.AddPostNotification
                  : labels.AddFollowUpNotification}
              </Text>
              <Input
                inputContainerStyle={[
                  styles.inputContainer,
                  styles.borderShadow,
                ]}
                containerStyle={[
                  styles.pH(15),
                  styles.height(45),
                  styles.mT(10),
                ]}
                placeholder={labels.title}
                placeholderTextColor={colors.text}
                autoCapitalize="none"
                clearTextOnFocus={false}
                underlineColorAndroid="transparent"
                multiline={false}
                numberOfLines={1}
                returnKeyType={'done'}
                onChangeText={(text) => setTitle(text)}
                value={title}
              />

              <TextInput
                placeholder={labels.Description}
                placeholderTextColor={colors.text}
                autoCapitalize="none"
                clearTextOnFocus={false}
                underlineColorAndroid="transparent"
                multiline={true}
                numberOfLines={6}
                style={[
                  [
                    styles.aboutMeInputContainer,
                    styles.shadowbb,
                    styles.fontSize(18),
                  ],
                ]}
                returnKeyType={'done'}
                onChangeText={(text) => setDesc(text)}
                value={desc}
              />

              {selectedIndex === 2 && (
                <>
                  <Input
                    inputContainerStyle={[
                      styles.inputContainer,
                      styles.borderShadow,
                    ]}
                    containerStyle={[
                      styles.pH(15),
                      styles.height(45),
                      // styles.mT(10),
                      styles.mB(20),
                    ]}
                    placeholder={labels.interval}
                    placeholderTextColor={colors.text}
                    autoCapitalize="none"
                    clearTextOnFocus={false}
                    underlineColorAndroid="transparent"
                    multiline={false}
                    numberOfLines={1}
                    keyboardType="number-pad"
                    returnKeyType={'done'}
                    onChangeText={(text) => {
                      let num = Number(text.replace(/[^0-9]/g, ''));
                      {
                        text.length > 0
                          ? setSlotValue(
                              '' + Number(text.replace(/[^0-9]/g, '')),
                            )
                          : setSlotValue('');
                      }
                    }}
                    value={slotValue}
                  />
                </>
              )}

              <View
                style={[
                  styles.width90,
                  styles.alignSelf,
                  styles.mtm20,
                  styles.mB(10),
                ]}>
                <ButtonGradient
                  title={labels.add}
                  type={false}
                  gradient={true}
                  onBtnPress={() => {
                    setSlot('');
                    createNotif();
                  }}
                />
              </View>
            </View>
          </KeyboardAvoidingView>
        </ReactNativeModal>

        {/* TIME INTERVAL PICKER */}
        <ReactNativePickerModule
          titleStyle={styles.profileText}
          itemStyle={styles.pickerItem1}
          pickerRef={refPicker}
          value={slot}
          title={labels.selectSlot}
          items={timeData.map((a) => a.time)}
          selectedColor={colors.themeColor}
          onValueChange={(value) => {
            setSlot(value);
            timeData
              ?.filter((e) => e.time === value)
              ?.map((item, i) => {
                return setSlotValue(item.value);
              });
          }}
        />
        {/* DELETE NOTIFICATION MODAL */}
        <ReactNativeModal
          backdropOpacity={0.5}
          isVisible={deletePopup}
          onBackButtonPress={() => setDeleletePopup(false)}>
          <View style={[styles.aboutMePopUpContainer]}>
            <Text
              style={[styles.textSemiBold, styles.textAlign, styles.mT(25)]}>
              {labels.deleteNoti}
            </Text>
            <View
              style={[
                styles.flexRow,
                styles.alignSelf,
                styles.mH(45),
                styles.mT(5),
              ]}>
              <ButtonWhite
                title={labels.no}
                exstyle={styles.shadowbb}
                onBtnPress={() => setDeleletePopup(false)}
              />
              <ButtonSmall
                title={labels.yes}
                onBtnPress={() => onDelete(deleteId)}
              />
            </View>
            <View style={styles.height(10)} />
          </View>
        </ReactNativeModal>
      </View>
    </>
  );
};

export default NotificationSetting;
