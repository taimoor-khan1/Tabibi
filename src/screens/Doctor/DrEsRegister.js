import React, { useEffect, useRef, useState } from 'react';
import {
	View,
	Text,
	Image,
	StatusBar,
	TouchableOpacity,
	ScrollView,
	Platform,
	KeyboardAvoidingView,
} from 'react-native';
import { Input, Icon, CheckBox } from 'react-native-elements';
import styles from '../../assets/styles';
import { assets } from '../../assets/images';
import labels from '../../config/Labels';
import colors from '../../config/Colors';
import { flags } from '../../assets/flags';
import { CountryCodes } from '../../assets/flags/CountryCodes';
import { ButtonGradient, HeaderBack } from '../../components';
import config from '../../config';

const DrEsRegister = ({ navigation }) => {
	// Declare state variables
	const [fname, setFname] = useState('');
	const [lname, setLname] = useState('');
	const [email, setEmail] = useState('');
	const [mobileNo, setMobileNo] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [check, setCheck] = useState(true);
	const [modalVisible, setModalVisible] = useState(false);
	const [phoneCode, setPhoneCode] = useState(CountryCodes[0].phoneCode);
	const [countriesData] = useState([CountryCodes[0].name]);
	const [countryCode, setCountryCode] = useState(CountryCodes[0].phoneCode);
	const [selectedCountry, setSelectedCountry] = useState(CountryCodes[0]);
	const [countryCodes, setCountryCodes] = useState(CountryCodes);
	const [phoneCodeList] = useState(CountryCodes);
	const [searchFlag, setSearchFlag] = useState('');

	// Declare input reference field
	const refLastName = useRef();
	const refPhoneNo = useRef();
	const refEmail = useRef();
	const refPassword = useRef();
	const refConfirmPassword = useRef();

	// Search flag filter: by country name
	const searchFlagFilter = text => {
		const newData = phoneCodeList.filter(item => {
			const itemData = item.name.toUpperCase();
			const textData = text.toUpperCase();
			return itemData.indexOf(textData) > -1;
		});
		setCountryCodes(newData);
	};
	function renderFlagItem({ item }) {
		return (
			<TouchableOpacity
				onPress={() => {
					setCountryCode(item.phoneCode);
					setSelectedCountry(item);
					setModalVisible(false);
				}}
			>
				<View style={styles.countryFlagView}>
					<Text style={[styles.fontSize(12)]}>
						<Image source={flags[item.code]} resizeMode="contain" />
						{'  '}
						{item.name}
					</Text>
					<Text style={styles.fontSize(12)}>
						{item.phoneCode}
					</Text>
				</View>
			</TouchableOpacity>
		);
	}
	return (
		<View style={[styles.container]}>
			<ScrollView
				bounces={false}
				style={styles.backgroundColor(colors.themeWhite)}
				showsVerticalScrollIndicator={false}
			>
				<KeyboardAvoidingView style={styles.flex(1)} behavior={Platform.OS == 'ios' && 'padding'}>
					<StatusBar backgroundColor={colors.themeColor} />

					<Image source={assets.login_bg} style={[styles.position]} />
					<HeaderBack
						showLeftIcon={true}
						// showCenterIcon={assets.inner_logoWhite}
						showLeftText={labels.back}
						back={true}
						leftRoute={() => navigation.goBack()}
					/>
					<View style={styles.height(50)} />
					<Image source={assets.login_logo} style={[styles.alignSelf]} />
					<View style={[styles.mH(30), styles.mT(30)]}>
						<Text style={[styles.Heading, styles.mT(30), styles.mB(40)]}>
							{labels.signUp}
						</Text>
						<View style={[styles.flexRow]}>
							<View style={[styles.flex(0.5), styles.pR(10)]}>
								<Input
									inputContainerStyle={[styles.inputContainer, styles.borderShadow]}
									containerStyle={[styles.pH(0), styles.height(65)]}
									placeholder={labels.name}
									placeholderTextColor={colors.text}
									underlineColorAndroid="transparent"
									autoCorrect={false}
									inputStyle={[styles.inputStyle]}
									selectionColor={colors.green}
									keyboardType="email-address"
									importantForAutofill="no"
									selectTextOnFocus={false}
									returnKeyType="next"
									autoCapitalize="none"
									onChangeText={text => setFname(text)}
									value={fname}
									onSubmitEditing={() => {
										refLastName.current.focus();
									}}
								/>
							</View>
							<View style={styles.flex(0.5)}>
								<Input
									ref={refLastName}
									inputContainerStyle={[styles.inputContainer, styles.borderShadow]}
									containerStyle={[styles.pH(0), styles.height(65)]}
									placeholder={labels.lname}
									placeholderTextColor={colors.text}
									underlineColorAndroid="transparent"
									autoCorrect={false}
									inputStyle={[styles.inputStyle]}
									selectionColor={colors.green}
									keyboardType="email-address"
									importantForAutofill="no"
									selectTextOnFocus={false}
									returnKeyType="next"
									autoCapitalize="none"
									onChangeText={text => setLname(text)}
									value={lname}
									onSubmitEditing={() => {
										refEmail.current.focus();
									}}
								/>
							</View>
						</View>
						<Input
							ref={refEmail}
							inputContainerStyle={[styles.inputContainer, styles.borderShadow]}
							containerStyle={[styles.pH(0), styles.height(65)]}
							placeholder={labels.email}
							placeholderTextColor={colors.text}
							underlineColorAndroid="transparent"
							autoCorrect={false}
							inputStyle={[styles.inputStyle]}
							selectionColor={colors.green}
							keyboardType="email-address"
							importantForAutofill="no"
							selectTextOnFocus={false}
							returnKeyType="next"
							autoCapitalize="none"
							onChangeText={text => setEmail(text)}
							value={email}
							onSubmitEditing={() => {
								refPassword.current.focus();
							}}
						/>
						<Input
							ref={refPassword}
							inputContainerStyle={[styles.inputContainer, styles.borderShadow]}
							containerStyle={[styles.pH(0), styles.height(65)]}
							placeholder={labels.password}
							placeholderTextColor={colors.text}
							underlineColorAndroid="transparent"
							autoCorrect={false}
							secureTextEntry={true}
							inputStyle={styles.inputStyle}
							selectionColor={colors.green}
							keyboardType="default"
							importantForAutofill="no"
							selectTextOnFocus={false}
							returnKeyType="next"
							autoCapitalize="none"
							onChangeText={text => setPassword(text)}
							value={password}
							// onSubmitEditing={() => {}}
						/>
						<View style={styles.mB(10)} />
						<ButtonGradient
							title={labels.register}
							type={false}
							onBtnPress={() =>
								navigation.reset({
									index: 0,
									routes: [{ name: 'DrawerStack' }],
								})}
						/>
					</View>
					<Text style={[styles.lable, styles.mT(28), styles.mB(30), styles.color(colors.white)]}>
						{labels.already}
						<Text onPress={() => navigation.navigate('DrLogin')} style={[styles.let]}>
							{labels.letsLogin}
						</Text>
					</Text>
					<View style={styles.mB(20)} />
				</KeyboardAvoidingView>
			</ScrollView>
		</View>
	);
};

export default DrEsRegister;
