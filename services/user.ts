import AsyncStorage from "@react-native-async-storage/async-storage";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

import { IUser } from "@/typings/user.inter";

export async function getUserId(): Promise<string | null> {
	try {
		const userId = await AsyncStorage.getItem("uid");
		if (userId) {
			return userId;
		}

		const currentUser = auth().currentUser;
		if (currentUser) {
			await AsyncStorage.setItem("uid", currentUser.uid);
			return currentUser.uid;
		}

		return null;
	} catch (error) {
		console.error("Error getting user ID", error);
		throw error;
	}
}

export async function getUser(): Promise<IUser | null> {
	try {
		const userId = await getUserId();
		if (!userId) {
			return null;
		}
		const userDocument = await firestore().collection("users").doc(userId).get();
		const userData = userDocument.data() as IUser | null;

		return userData;
	} catch (error) {
		console.error("Error getting user data", error);
		throw error;
	}
}
