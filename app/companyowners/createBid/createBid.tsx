// companyowners/createBid.tsx
import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Formik } from "formik";
import * as Yup from "yup";
import { IBid } from "@/typings/jobs.inter";
import { ICompanyOwnerEntity, UserType } from "@/typings/user.inter";
import { getUser, getUserId } from "@/services/user";
import { submitBid } from "@/services/bid";

// Validation schema for the form
const BidSchema = Yup.object().shape({
	bidAmount: Yup.number()
		.required("Bid amount is required")
		.min(1, "Bid amount must be greater than zero"),
	description: Yup.string()
		.required("Bid description is required")
		.min(10, "Bid description must be at least 10 characters long"),
});

export default function CreateBid() {
	const [userId, setUserId] = useState<string | null>();
	const [loading, setLoading] = useState(true);
	const { pid } = useLocalSearchParams<{ pid?: string }>();
	const router = useRouter();

	useEffect(() => {
		const fetchUserId = async () => {
			setLoading(true);
			try {
				const user = await getUserId();
				if (!user) {
					return;
				}
				setUserId(user);
			} catch (error) {
				console.error("Error fetching user data", error);
			} finally {
				setLoading(false);
			}
		};
		fetchUserId();
	}, []);

	const initialValues: Omit<IBid, "pid" | "uid"> = {
		bidAmount: 0,
		description: "",
	};

	const handleSubmitBid = async (values: Omit<IBid, "pid" | "uid">) => {
		setLoading(true);
		try {
			const bid: IBid = {
				...values,
				bidAmount: Number(values.bidAmount),
				pid: pid!,
				uid: userId!,
			};
			await submitBid(bid);
		} catch (error) {
			console.error("Error submitting bid:", error);
		} finally {
			setLoading(false);
			router.push("/companyowners/(auth)/viewPosts");
		}
	};
	return (
		<View style={styles.container}>
			<Formik initialValues={initialValues} validationSchema={BidSchema} onSubmit={handleSubmitBid}>
				{({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
					<View>
						<Text style={styles.label}>Bid Amount</Text>
						<TextInput
							style={styles.input}
							keyboardType="numeric"
							onChangeText={handleChange("bidAmount")}
							onBlur={handleBlur("bidAmount")}
							value={values.bidAmount.toString()}
							placeholder="Enter your bid amount"
						/>
						{errors.bidAmount && touched.bidAmount && (
							<Text style={styles.errorText}>{errors.bidAmount}</Text>
						)}

						<Text style={styles.label}>Bid Description</Text>
						<TextInput
							style={[styles.input, styles.textArea]}
							multiline={true}
							numberOfLines={5}
							onChangeText={handleChange("description")}
							onBlur={handleBlur("description")}
							value={values.description}
							placeholder="Enter details about your bid"
						/>
						{errors.description && touched.description && (
							<Text style={styles.errorText}>{errors.description}</Text>
						)}

						<Button title="Submit Bid" onPress={handleSubmit as () => void} />
						<Button title="CANCEL" onPress={() => router.back()} />
					</View>
				)}
			</Formik>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		paddingHorizontal: 16,
	},
	label: {
		fontSize: 16,
		marginBottom: 8,
	},
	input: {
		borderWidth: 1,
		borderColor: "#ccc",
		padding: 8,
		marginBottom: 10,
		borderRadius: 4,
	},
	textArea: {
		height: 120, // Adjust this to make the text area bigger
		textAlignVertical: "top", // Ensure the text starts at the top of the text area
	},
	errorText: {
		color: "red",
		marginBottom: 10,
	},
});
