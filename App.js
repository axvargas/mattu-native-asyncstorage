import React, { useRef, useEffect, useState } from 'react';
import {
	StyleSheet,
	View,
	Text,
	StatusBar,
	TextInput,
	Button,
	TouchableHighlight,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form'
import AsyncStorage from '@react-native-community/async-storage';

const App = () => {
	const [storagedName, setStoragedName] = useState(null)
	const { control, handleSubmit, errors, reset } = useForm({
		defaultValues: {
			name: ''
		}
	})
	const nameRef = useRef()

	useEffect(() => {
		getStoragedData()
	}, [])

	const getStoragedData = async () => {
		try {
			const name = await AsyncStorage.getItem('name')
			setStoragedName(name)
		} catch (error) {
			console.log(error)
		}
	}

	const onSubmit = async (data) => {
		try {
			await AsyncStorage.setItem('name', data.name.trim())
			setStoragedName(data.name.trim())
			reset()
		} catch (error) {
			console.log(error)
		}
	}
	const deleteName = async () => {
		try {
			await AsyncStorage.removeItem('name')
			setStoragedName(null)
		} catch (error) {
			console.log(error)
		}
	}
	return (
		<>
			<View style={styles.viewApp}>
				{storagedName && <Text style={styles.txtName}>Hi {storagedName}</Text>}
				<Controller
					name="name"
					control={control}
					defaultValue=""
					onFocus={() => {
						nameRef.current.focus();
					}}
					rules={{
						required: "Type the name please",
						validate: (value) => value.trim() !== '' || "Type the name please"
					}}
					render={({ onChange, onBlur, value }) => (
						<TextInput
							id="name"
							name="name"
							style={[styles.input, { borderColor: errors.name ? 'red' : '#666' }]}
							placeholder="Type your name"
							onChangeText={(value) => {
								onChange(value)
							}}
							value={value}
							ref={nameRef}
						/>
					)}
				/>
				{errors.name && <Text style={styles.txtError}>{errors.name.message}</Text>}

				<View style={styles.viewBtnSave}>
					<Button title="Save" color='#333' onPress={handleSubmit(onSubmit)} />
				</View>
				{storagedName &&
					<TouchableHighlight
						style={styles.btnDelete}
						onPress={() => deleteName()}
					>
						<Text style={styles.txtDelete}>Delete name</Text>
					</TouchableHighlight>
				}
			</View>
		</>
	);
};

const styles = StyleSheet.create({
	viewApp: {
		marginTop: StatusBar.currentHeight,
		flex: 1,
		backgroundColor: '#FFF',
		// alignItems: 'center',
		paddingHorizontal: '10%',
		justifyContent: 'center'
	},
	input: {
		borderBottomWidth: 1,
		height: 40
	},
	viewBtnSave: {
		marginTop: 20,
	},
	btnDelete: {
		backgroundColor: 'red',
		marginTop: 20,
		padding: 10,
	},
	txtDelete: {
		color: 'white',
		fontWeight: 'bold',
		textAlign: 'center',
		textTransform: 'uppercase',
	},
	txtError: {
		color: 'red',
		fontSize: 10
	},
	txtName: {
		textAlign: 'center',
		marginBottom: 20
	}
});

export default App;
