import { Stack } from "expo-router";

export default function HomeOwnerRootLayout() {
	return (
		<Stack screenOptions={{ headerShown: false }}>
			<Stack.Screen name="signIn" />
			<Stack.Screen name="signUp" />
			<Stack.Screen name="(auth)" />
		</Stack>
	);
}
