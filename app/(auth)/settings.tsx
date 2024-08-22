import { View, Text, Button, ActivityIndicator } from "react-native";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { useEffect, useState } from "react";
import { getUser } from "@/services/user";
import { IUser } from "@/typings/user.inter";
import { signOut } from "@/services/auth";

export default function SettingsScreen() {
	return (
		<View>
			<Button title="Logout" onPress={async () => signOut()} />
		</View>
	);
}
