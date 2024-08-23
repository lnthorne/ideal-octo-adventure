import { BidStatus, IBid, IBidEntity, IPostEntity } from "@/typings/jobs.inter";
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
				bidIds: firestore.FieldValue.arrayUnion(bidRef.id), // Add the bid ID to the post's bids array
			});

		console.log("Bid submitted successfully:", newBid);
	} catch (error) {
		console.error("Error submitting bid:", error);
		throw error;
	}
}

export async function fetchBidsFromUid(uid: string): Promise<IBidEntity[]> {
	try {
		const bidsSnapshot = await firestore().collection("bids").where("uid", "==", uid).get();

		const bids = bidsSnapshot.docs.map((doc) => {
			const data = doc.data() as IBidEntity;
			return data;
		});

		return bids;
	} catch (error) {
		console.error("Error fetching bids:", error);
		throw error;
	}
}

export async function fetchAllOpenJobsWithBids(uid: string = ""): Promise<IPostEntity[]> {
	try {
		const postsSnapshot = await firestore()
			.collection("posts")
			.where("uid", "==", uid)
			.where("jobStatus", "==", "open")
			.get();

		const posts: IPostEntity[] = postsSnapshot.docs.map((doc) => doc.data() as IPostEntity);

		for (const post of posts) {
			if (post.bidIds) {
				// Fetch bids only if bidIds exist and bids array is not already populated
				const bidDocs = await Promise.all(
					post.bidIds.map((bidId) => firestore().collection("bids").doc(bidId).get())
				);

				// Map and filter the bid documents to get the actual bids
				post.bids = bidDocs
					.map((bidDoc) => bidDoc.data() as IBidEntity)
					.filter((bid) => bid.status === BidStatus.accepted || bid.status === BidStatus.pending);
			}
		}

		return posts;
	} catch (error) {
		console.error("Error fetching jobs with bids:", error);
		throw error;
	}
}
