import { Stack } from "expo-router";

export default function CreatBidLayout() {
	return (
		<Stack screenOptions={{ headerShown: false }}>
			<Stack.Screen name="[posting]" />
			<Stack.Screen name="createBidPage" />
		</Stack>
	);
}
