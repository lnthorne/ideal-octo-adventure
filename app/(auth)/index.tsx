// app/home/index.tsx
import { getUser } from "@/services/user";
import { IUser } from "@/typings/user.inter";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

export default function HomeScreen() {
	const [userData, setUserData] = useState<IUser | null>();
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		const fetchUser = async () => {
			setLoading(true);
			try {
				const user = await getUser();
				if (!user) {
					return;
				}
				setUserData(user);
			} catch (error) {
				console.error("Error fetching user data", error);
			} finally {
				setLoading(false);
			}
		};
		fetchUser();
	}, []);

	if (loading) {
		return <ActivityIndicator size={"large"} />;
	}
	return (
		<View>
			<Text>{`Welcome to the Home Screen ${userData?.firstname}`}</Text>
		</View>
	);
}
