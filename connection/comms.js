import firebase from "firebase";
import "firebase/auth";
import "firebase/firestore";
import firebaseConfig from "./firebaseConfig";
import {saveData} from "./AsyncStorage";

firebase.initializeApp(firebaseConfig);

export const Firebase = {
    loginWithEmail: (email, password) => {
        return firebase.auth().signInWithEmailAndPassword(email, password).then(res => {
            return firebase.firestore()
                .collection("users")
                .doc(res.user.uid)
                .get()
                .then((snapshot) => {
                    console.log("FROM FIREBASE, Saving user in storage.")
                    saveData(snapshot.data()).then()
                    return (snapshot.data())
                });
        });
    },

    updateData: (key, value, uid) => {
        return firebase.firestore()
            .collection("users")
            .doc(uid)
            .update({[key]: value})
            .then(() => {
                console.log("Updating: " + key)
                return true
            });
    },

    signupWithEmail: (email, password) => {
        return firebase.auth().createUserWithEmailAndPassword(email, password);
    },

    signOut: () => {
        return firebase.auth().signOut();
    },

    passwordReset: email => {
        return firebase.auth().sendPasswordResetEmail(email);
    },

    createNewUser: userData => {
        return firebase
            .firestore()
            .collection("users")
            .doc(`${userData.uid}`)
            .set(userData);
    },

    userAvatar: async (uri, uid) => {
        const response = await fetch(uri);
        const blob = await response.blob();

        const ref = firebase.storage().ref('/avatars/' + uid);
        const task = ref.put(blob);
        console.log("Running Upload Task.")
        return task.snapshot.ref.getDownloadURL().then((downloadURL) => {
            console.log("DOWNLOAD URL GENERATED")
            return downloadURL;
        });


    },

    getHomeScreenData: (uid) => {
        return firebase
            .firestore()
            .collection("services")
            // .where("seller", "!=", uid)
            .get()
            .then((snapshot) => {
                let dataArray = [];
                snapshot.docs.forEach(doc => {
                    let data = doc.data()
                    data.id = doc.id;
                    dataArray.push(data)
                });
                return dataArray
            });
    },

    addNewService: (data, uid) => {
        data.seller = uid;
        return firebase.firestore()
            .collection("services")
            .add(data)
            .then((r) => {
                return r
            });
    },
    updateService: (data) => {
        return firebase.firestore()
            .collection("services")
            .doc(data.id)
            .update(data)
            .then((r) => {
                return r
            });
    },

    serviceIMG: async (uri) => {
        const response = await fetch(uri);
        const blob = await response.blob();

        const ref = firebase.storage().ref('/services/' + Math.floor(Math.random() * 99999) + 999);

        return ref.put(blob).then(snapshot => snapshot.ref.getDownloadURL().then((downloadURL) => {
                console.log("DOWNLOAD URL GENERATED")
                return downloadURL;
            }).catch(err => console.log(err))
        )
    },

    getMyServices: (uid) => {
        return firebase
            .firestore()
            .collection("services")
            .where("seller", "==", uid)
            .get()
            .then((snapshot) => {
                let dataArray = [];
                snapshot.docs.forEach(doc => {
                    let data = doc.data()
                    data.id = doc.id
                    dataArray.push(data)
                });
                return dataArray
            });
    },


    deleteThisService: (serviceID) => {
        return firebase
            .firestore()
            .collection("services")
            .doc(serviceID)
            .delete()
            .then(() => {
                return true
            })
            .catch(err => console.log(err));
    },

};


