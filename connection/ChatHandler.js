import firebase from "firebase";

export const Chats = {
    addMessage: () => {
        return firebase.firestore()
            .collection('MESSAGE_THREADS')
            .doc("thread._id")
            .set({user1: "asd1", user2: "asd2"})
            .collection('MESSAGES')
            .add({
                text: "sdf",
                createdAt: new Date().getTime(),
                user: {
                    _id: loggedIn.uid,
                    displayName: loggedIn.name
                }
            })
    },
    startThread: (user1, user2) => {
        firebase.firestore()
            .collection('MESSAGE_THREADS')
            .add({
                user1: user1,
                user2: user2,
            }).then(r => console.log(r))
    },
    getThread: (user1, user2) => {
        firebase.firestore()
            .collection('MESSAGE_THREADS')
            .where("user1", "==", user1)
            .where("user2", "==", user2)
            .get()
            .then((snapshot) => {
                if(snapshot.docs.length <= 0){
                    Chats.startThread(user1, user2)
                }else{

                    console.log(snapshot.docs[0].data())
                }

            });

    }
}