import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";

export enum JobStatus {
	completed = "completed",
	closed = "closed",
	inprogress = "inprogress",
	open = "open",
}

export enum BidStatus {
	accepted = "accepted",
	rejected = "rejected",
	pending = "pending",
}

export interface IBid {
	pid: string;
	uid: string; // uid of the company owner
	bidAmount: number;
	description: string;
}

export interface IBidEntity extends IBid {
	bid: string;
	createdAt: FirebaseFirestoreTypes.FieldValue;
	status: BidStatus;
}

export interface IPost {
	uid: string; //uid of the homeowner
	title: string;
	description: string;
	imageUrl?: string;
	bids?: string[];
}

export interface IPostEntity extends IPost {
	pid: string;
	jobStatus: JobStatus;
	createdAt: FirebaseFirestoreTypes.FieldValue;
}
