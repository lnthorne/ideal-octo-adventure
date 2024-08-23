import { Stack } from "expo-router";

export default function CompanyOwnerRootLayout() {
	return (
		<Stack screenOptions={{ headerShown: false }}>
			<Stack.Screen name="signIn" />
			<Stack.Screen name="signUp" />
			<Stack.Screen name="(auth)" />
		</Stack>
	);
}
