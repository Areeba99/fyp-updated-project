import firebase from "firebase";

export const MeasurementsHandler = {
    addNew: (data, uid) => {
        return firebase.firestore()
            .collection('users')
            .doc(uid)
            .collection("Measurements")
            .add(data)
            .then((snapshot) => {
                return snapshot
            })
            .catch(err => console.log(err));
    },
    getAll: (uid) => {
        return firebase.firestore()
            .collection('users')
            .doc(uid)
            .collection("Measurements")
            .get()
            .then((snapshot) => {
                let dataArray = [];
                snapshot.docs.forEach(doc => {
                    let data = doc.data()
                    data.id = doc.id;
                    dataArray.push(data)
                });
                return dataArray
            })
            .catch(err => console.log(err));
    },
    deleteMeasurement: (docID, uid) => {
        return firebase.firestore()
            .collection('users')
            .doc(uid)
            .collection("Measurements")
            .doc(docID)
            .delete()
            .then((snapshot) => {
                return snapshot
            })
            .catch(err => console.log(err));
    },

}