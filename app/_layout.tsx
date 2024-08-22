import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { ActivityIndicator, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { identifyUserType } from "@/services/user";
import { UserType } from "@/typings/user.inter";

export default function RootLayout() {
	const [initializing, setInitializing] = useState<boolean>(true);
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
		const checkUserTypeAndRedirect = async () => {
			if (initializing) return;

			const inAuthGroup = segments[1] === "(auth)";

			const userType = await identifyUserType(user?.uid);
			const pathType = userType === UserType.homeowner ? "homeowners" : "companyowners";

			console.log("User type", userType);
			console.log("Path type", pathType);
			console.log("User", user);

			if ((!user && !hasOnboarded) || !userType) {
				router.replace("/");
			} else if (user && !inAuthGroup) {
				router.replace(`/${pathType}/(auth)`);
			} else if (!user && inAuthGroup) {
				router.replace(`/${pathType}/signIn`);
			}
		};
		checkUserTypeAndRedirect();
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
			<Stack.Screen name="index" options={{ headerShadowVisible: false }} />
		</Stack>
	);
}
