import firestore from '@react-native-firebase/firestore';


export const subscribeToChat = (callback) => {
    return firestore()
        .collection('chats')
        .orderBy('createdAt', 'desc')
        .onSnapshot((querySnapshot) => {
            const msgs = querySnapshot.docs.map((doc) => {
                const data = doc.data();
                return {
                    _id: doc.id,         
                    text: data.text,
                    createdAt: data.createdAt?.toDate() || new Date(),
                    user: { _id: data.senderId },
                };
            });
            callback(msgs);
        });
};

export const sendMessage = async (text, senderId) => {
    try {
        await firestore()
            .collection('chats')
            .add({
                text,
                senderId,
                createdAt: firestore.FieldValue.serverTimestamp(),
            });
    } catch (error) {
        console.log('Error sending message:', error.message);
    }
}