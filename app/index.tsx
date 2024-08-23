import React from "react";
import { View, Text, Button, StyleSheet, Image } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Onboarding() {
	const router = useRouter();

	const handleLandscaperOnboarding = async () => {
		await AsyncStorage.setItem("hasOnboarded", "true");
		await AsyncStorage.setItem("userType", "companyowner");
		router.push("/companyowners/signIn");
	};

	const handleHomeownerOnboarding = async () => {
		await AsyncStorage.setItem("hasOnboarded", "true");
		await AsyncStorage.setItem("userType", "homeowner");
		router.push("/homeowners/signIn");
	};

	return (
		<View style={styles.container}>
			<Image
				source={require("../assets/images/Landscape_Connect_Logo.png")}
				style={{
					width: 200,
					height: 200,
					marginBottom: 20,
				}}
			/>
			<Text style={styles.title}>Welcome to Landscape Connect!</Text>
			<Text style={styles.description}>Are you a Landscaper or a Homeowner?</Text>
			<Button title="Landscaper" onPress={handleLandscaperOnboarding} />
			<Button title="Homeowner" onPress={handleHomeownerOnboarding} />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 16,
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 20,
	},
	description: {
		fontSize: 16,
		textAlign: "center",
		marginBottom: 40,
	},
});
