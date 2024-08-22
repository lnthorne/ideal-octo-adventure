import auth from "@react-native-firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import firestore from "@react-native-firebase/firestore";

import { ILoginData } from "@/typings/auth/login.inter";
import { IRegisterData } from "@/typings/auth/register.inter";
import { IUser } from "@/typings/user.inter";

export async function signIn(data: ILoginData) {
	try {
		const user = await auth().signInWithEmailAndPassword(data.email, data.password);
		await AsyncStorage.setItem("uid", user.user.uid);
		return user;
	} catch (error) {
		throw error;
	}
}

export async function signOut() {
	try {
		await auth().signOut();
		await AsyncStorage.removeItem("uid");
	} catch (error) {
		throw error;
	}
}

export async function signUp(data: IRegisterData): Promise<IUser> {
	try {
		const user = await auth().createUserWithEmailAndPassword(data.email, data.password);
		await AsyncStorage.setItem("uid", user.user.uid);

		const formattedData: IUser = {
			...data,
			uid: user.user.uid,
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		await firestore()
			.collection("users")
			.doc(user.user.uid)
			.set({
				...formattedData,
			});

		return formattedData;
	} catch (error) {
		throw error;
	}
}
