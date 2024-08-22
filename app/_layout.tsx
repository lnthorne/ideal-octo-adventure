import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { ActivityIndicator, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function RootLayout() {
	const [initializing, setInitializing] = useState(true);
	const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
	const [hasOnboarded, setHasOnboarded] = useState<boolean>(false);
	const router = useRouter();
	const segments = useSegments();

	const onAuthStateChanged = (user: FirebaseAuthTypes.User | null) => {
		setUser(user);
		if (initializing) setInitializing(false);
	};

	// Check if the user has completed onboarding
	const checkOnboarding = async () => {
		const onboarded = await AsyncStorage.getItem("hasOnboarded");
		console.log("Checking onboarding", onboarded);
		setHasOnboarded(onboarded === "true");
	};

	useEffect(() => {
		const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
		return subscriber;
	}, []);

	useEffect(() => {
		checkOnboarding();
		console.log("Value of hasOnboarded", hasOnboarded);
	}, []);

	useEffect(() => {
		if (initializing) return;

		const inAuthGroup = segments[0] === "(auth)";

		if (!user && !hasOnboarded) {
			router.replace("/onboarding");
		} else if (user && !inAuthGroup) {
			router.replace("/(auth)");
		} else if (!user && inAuthGroup) {
			router.replace("/signIn");
		}
	}, [user, initializing, hasOnboarded]);

	if (initializing) {
		return (
			<View
				style={{
					alignItems: "center",
					justifyContent: "center",
					flex: 1,
				}}
			>
				<ActivityIndicator size="large" />
			</View>
		);
	}

	return (
		<Stack screenOptions={{ headerShown: false }}>
			<Stack.Screen name="signIn" options={{ headerShadowVisible: false }} />
			<Stack.Screen name="onboarding" options={{ headerShadowVisible: false }} />
			<Stack.Screen name="(auth)" options={{ headerShadowVisible: false }} />
		</Stack>
	);
}
