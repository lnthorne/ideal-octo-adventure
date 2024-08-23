import { View, Text, StyleSheet, ActivityIndicator, Image, Button } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Formik } from "formik";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import { IPostEntity } from "@/typings/jobs.inter";
import { fetchPost } from "@/services/post";

const BidSchema = Yup.object().shape({
	bidAmount: Yup.number()
		.required("Bid amount is required")
		.min(1, "Bid amount must be greater than zero"),
	bidDescription: Yup.string()
		.required("Bid description is required")
		.min(10, "Bid description must be at least 10 characters long"),
});

export default function CreateBidScreen() {
	const { posting } = useLocalSearchParams<{ posting: string }>();
	const [post, setPosting] = useState<IPostEntity | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// fetch the posting
		const fetchPosting = async () => {
			try {
				const postData = await fetchPost(posting);
				setPosting(postData);
			} catch (error) {
				console.error("Error fetching post", error);
			} finally {
				setLoading(false);
			}
		};
		fetchPosting();
	}, []);

	if (loading) {
		return (
			<View style={styles.container}>
				<ActivityIndicator size={"large"} />
			</View>
		);
	}
	return (
		<View style={styles.container}>
			<Text>{post?.title}</Text>
			<Text>{post?.description}</Text>
			<Text>{post?.jobStatus}</Text>
			<Image source={{ uri: post?.imageUrl }} style={{ width: 200, height: 200 }} />

			<Button title="CANCEL" onPress={() => router.back()} />
			<Button
				title="BID"
				onPress={() => {
					router.push(`/companyowners/createBid/createBidPage?pid=${posting}`);
				}}
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
});
