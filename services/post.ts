import { IPostText } from "@/typings/post.inter";
import firestore, { addDoc, collection } from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";

export async function CreateNewPost(postText: IPostText, imageUri: string | null) {
	try {
		const postDocRef = await firestore()
			.collection("posts")
			.add({
				...postText,
			});
		const postId = postDocRef.id;
		let imageUrl = null;

		if (imageUri) {
			// Convert image URI to Blob
			const imageRef = storage().ref(`posts/${postId}/image.jpg`);

			// Upload the image file to Firebase Storage
			await imageRef.putFile(imageUri);

			// Get the download URL of the uploaded image
			imageUrl = await imageRef.getDownloadURL();

			// Update the post document with the image URL
			await postDocRef.update({
				imageUrl,
			});
		}

		return { postId, imageUrl };
	} catch (error) {
		console.error("Error creating post: ", error);
		throw error;
	}
}
