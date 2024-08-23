// app/home/index.tsx
import { fetchBidsFromUid } from "@/services/bid";
import { getUser } from "@/services/user";
import { IBidEntity } from "@/typings/jobs.inter";
import { ICompanyOwnerEntity, IHomeOwnerEntity, UserType } from "@/typings/user.inter";
import React, { useEffect, useState } from "react";
import {
	ActivityIndicator,
	Text,
	View,
	StyleSheet,
	FlatList,
	TouchableOpacity,
} from "react-native";

export default function HomeScreen() {
	const [userData, setUserData] = useState<ICompanyOwnerEntity | null>();
	const [bidData, setBidData] = useState<IBidEntity[] | null>();
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		const fetchUserAndBids = async () => {
			setLoading(true);
			try {
				const user = await getUser<ICompanyOwnerEntity>(UserType.companyowner);
				if (!user) {
					return;
				}
				setUserData(user);

				const bids = await fetchBidsFromUid(user.uid);

				if (!bids) {
					return;
				}
				setBidData(bids);
			} catch (error) {
				console.error("Error fetching user data", error);
			} finally {
				setLoading(false);
			}
		};
		fetchUserAndBids();
	}, []);

	if (loading) {
		return <ActivityIndicator size={"large"} />;
	}
	return (
		<View style={styles.container}>
			<Text
				style={styles.title}
			>{`Welcome back ${userData?.companyName}! Here are your current bids`}</Text>
			<FlatList
				data={bidData}
				keyExtractor={(item) => item.pid}
				renderItem={({ item }) => (
					<TouchableOpacity onPress={() => {}}>
						<View style={styles.postContainer}>
							<Text style={styles.title}>${item.bidAmount}</Text>
							<Text style={styles.description}>{item.description}</Text>
							<Text style={styles.status}>Status: {item.status}</Text>
						</View>
					</TouchableOpacity>
				)}
				ListEmptyComponent={<Text style={styles.title}>No bids available.</Text>}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		paddingHorizontal: 16,
	},
	postContainer: {
		backgroundColor: "#f9f9f9",
		padding: 16,
		borderRadius: 8,
		marginBottom: 16,
	},
	title: {
		fontSize: 18,
		fontWeight: "bold",
	},
	description: {
		fontSize: 14,
		marginVertical: 8,
	},
	status: {
		fontSize: 12,
		color: "gray",
	},
});
