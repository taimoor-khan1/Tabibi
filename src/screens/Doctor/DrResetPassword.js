import React, { useEffect, useRef, useState } from 'react';
import {
	View,
	Text,
	Image,
	StatusBar,
	TouchableOpacity,
	ScrollView,
	KeyboardAvoidingView,
	Platform,
} from 'react-native';
import { Input, Icon } from 'react-native-elements';
import styles from '../../assets/styles';
import { assets } from '../../assets/images';
import labels from '../../config/Labels';
import colors from '../../config/Colors';
import { ButtonGradient, HeaderBack } from '../../components';
import Utility from '../../config/Utility';
import { resetPassword } from '../../store/actions';
import { useDispatch } from 'react-redux';

const DrResetPassword = ({ navigation, route }) => {
	// Declare state variables
	const [newPassword, setNewPassword] = useState('');
	const [password, setPassword] = useState('');
	// Declare input reference field
	const refPassword = useRef();
	const dispatch = useDispatch();

	const didPressSave = () => {
		const params = {
			email: route.params.email,
			password: newPassword,
			confirmPassword: password,
		};
		Utility.resetPassword(navigation, params, resetPassword, dispatch);
	};

	return (
		<View style={[styles.container]}>
			<KeyboardAvoidingView style={styles.flex(1)} behavior={Platform.OS == 'ios' && 'padding'}>
				<ScrollView
					bounces={false}
					style={styles.backgroundColor(colors.white)}
					showsVerticalScrollIndicator={false}
				>
					<StatusBar backgroundColor={colors.themeColor} />
					<Image source={assets.login_bg} style={[styles.position]} resizeMode={'stretch'} />
					<HeaderBack
						showLeftIcon={true}
						showCenterIcon={assets.logo_header}
						showLeftText={labels.back}
						back={true}
						leftRoute={() => navigation.goBack()}
					/>
					<View style={styles.height(90)} />
					<View style={[styles.splash_logo, styles.flex(1)]}>
						<Image source={assets.newpass} />
					</View>
					<View style={styles.height(50)} />
					<View style={[styles.mH(35), styles.flex(1)]}>
						<Text style={[styles.Heading, styles.mB(10)]}>
							{labels.reset}
						</Text>
						<Text style={[styles.textBlack, styles.mB(44), styles.fontSize(15), styles.PoppinsLight]}>
							{labels.resettext}
						</Text>
						<Input
							inputContainerStyle={[styles.inputContainer, styles.borderShadow]}
							containerStyle={[styles.pH(0), styles.height(65)]}
							placeholder={labels.newpassword}
							placeholderTextColor={colors.text}
							underlineColorAndroid="transparent"
							autoCorrect={false}
							secureTextEntry={true}
							inputStyle={styles.inputStyle}
							selectionColor={colors.green}
							keyboardType="default"
							importantForAutofill="no"
							selectTextOnFocus={false}
							returnKeyType="done"
							autoCapitalize="none"
							onChangeText={text => setNewPassword(text)}
							value={newPassword}
							onSubmitEditing={() => {
								refPassword.current.focus();
							}}
						/>
						<Input
							ref={refPassword}
							inputContainerStyle={[styles.inputContainer, styles.borderShadow]}
							containerStyle={[styles.pH(0), styles.height(65)]}
							placeholder={labels.confirmPasswordN}
							placeholderTextColor={colors.text}
							underlineColorAndroid="transparent"
							autoCorrect={false}
							secureTextEntry={true}
							inputStyle={styles.inputStyle}
							selectionColor={colors.green}
							keyboardType="default"
							importantForAutofill="no"
							selectTextOnFocus={false}
							returnKeyType="done"
							autoCapitalize="none"
							onChangeText={text => setPassword(text)}
							value={password}
							onSubmitEditing={() => {}}
						/>
						<ButtonGradient title={labels.resetBtn} type={false} gradient={true} onBtnPress={() => didPressSave()} />
					</View>
					<View style={styles.mB(125)} />
				</ScrollView>
			</KeyboardAvoidingView>
		</View>
	);
};

export default DrResetPassword;
