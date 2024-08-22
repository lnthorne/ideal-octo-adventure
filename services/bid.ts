import { BidStatus, IBid, IBidEntity } from "@/typings/jobs.inter";
import firestore from "@react-native-firebase/firestore";

export async function submitBid(bidData: IBid): Promise<void> {
	try {
		const bidRef = firestore().collection("bids").doc();

		const newBid: IBidEntity = {
			...bidData,
			bid: bidRef.id,
			createdAt: firestore.FieldValue.serverTimestamp(),
			status: BidStatus.pending,
		};

		await bidRef.set(newBid);

		await firestore()
			.collection("posts")
			.doc(bidData.pid)
			.update({
				bids: firestore.FieldValue.arrayUnion(bidRef.id), // Add the bid ID to the post's bids array
			});

		console.log("Bid submitted successfully:", newBid);
	} catch (error) {
		console.error("Error submitting bid:", error);
		throw error;
	}
}
