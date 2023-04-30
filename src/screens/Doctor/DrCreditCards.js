import React, {useEffect, useRef, useState} from 'react';
import {View, Image, Text} from 'react-native';
import styles from '../../assets/styles';
import {assets} from '../../assets/images';
import labels from '../../config/Labels';
import colors from '../../config/Colors';
import {
  AddBtn,
  GreadientHeader,
  SelectoinCategory,
  NoRecordComponent,
  ButtonSmall,
  ButtonWhite,
} from '../../components';
import ReactNativeModal from 'react-native-modal';
import {useDispatch, useSelector} from 'react-redux';
import {getDrCard, drdeleteCard} from '../../store/actions';

const DrCreditCard = ({navigation, route}) => {
  //Redux Store
  const {creditsCards: creditCards} = useSelector((state) => state.Doctor);
  const dispatch = useDispatch();

  // Declare state variables'
  const [options, setOptions] = useState([]);
  const [paymentCard, setPaymentCard] = useState(null);
  const [deletePopUp, setDeletePopUp] = useState(false);
  const [deleteId, setDeleteId] = useState('');

  // const [from] = useState(route.params.from);
  // Declare input reference field
  const refPopUp = useRef();

  //Action for Set Credit Cards
  useEffect(() => {
    const cards = creditCards.map((text, index) => {
      return {
        ...text,
        servieId: text?.id,
        title: `${text.nameOnCard}\nxxxx xxxx xxxx ${text.cardNumber}`,
        complete: true,
      };
    });
    setOptions(cards);
  }, [creditCards]);

  useEffect(() => {
    dispatch(getDrCard(true));
  }, []);

  //On Delete
  const onDelete = (id) => {
    setDeletePopUp(false)
    const payload = {
      data: {
        cardId: id,
      },
    };
    dispatch(drdeleteCard(payload, true)).then((res) => {
      if (res === 200) {
        dispatch(getDrCard(true));
      }
    });
  };

  return (
    <>
      <View style={[styles.flex(1), styles.backgroundColor(colors.themeWhite)]}>
        <GreadientHeader
          showLeftIcon={true}
          showRightIcon={false}
          showCenterText={labels.payment}
          showLeftText={labels.back}
          back={true}
          leftRoute={() => navigation.goBack()}
        />

        <View style={styles.height(10)} />
        <View style={styles.mH(20)}>
          {options.length > 0 ? (
            <SelectoinCategory
              options={options.length ? options : []}
              isSelected={paymentCard}
              from={true}
              lovedOne={true}
              payment={true}
              prescriptions={false}
              onDelete={(id) => {
                setDeletePopUp(true);
                setDeleteId(id);
              }}
              onItemPress={(value) => {
                // setPaymentCard(value.id);
              }}
            />
          ) : (
            <View style={styles.mT(150)}>
              <NoRecordComponent />
            </View>
          )}
        </View>
      </View>
      <Image source={assets.bottom_image} style={styles.bottomImg} />
      <AddBtn
        type={false}
        onBtnPress={() => navigation.navigate('DrAddCard')}
      />
      {/* CANCEL APPOINTMENT MODAL */}
      <ReactNativeModal
        backdropOpacity={0.5}
        isVisible={deletePopUp}
        onBackButtonPress={() => setDeletePopUp(false)}>
        <View style={[styles.aboutMePopUpContainer]}>
          <Text style={[styles.textSemiBold, styles.textAlign, styles.mT(25),styles.mH(20)]}>
            {labels.deleteCard}
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
              onBtnPress={() => setDeletePopUp(false)}
            />
            <ButtonSmall
              title={labels.yes}
              onBtnPress={() => onDelete(deleteId)}
            />
          </View>
          <View style={styles.height(10)} />
        </View>
      </ReactNativeModal>
    </>
  );
};

export default DrCreditCard;
