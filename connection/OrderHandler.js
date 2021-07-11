import firebase from "firebase";

export const Orders = {
    newOrder: (data) => {
        return firebase.firestore()
            .collection('Orders')
            .add(data)
            .then((r) => {
                return r
            })
            .catch(err => console.log(err));
    },
    getBuyingOrders: (uid) => {
        return firebase
            .firestore()
            .collection("Orders")
            .where("buyer", "==", uid)
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
    getSellingOrders: (uid) => {
        return firebase
            .firestore()
            .collection("Orders")
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
    getEarnings: (uid) => {
        return firebase
            .firestore()
            .collection("Orders")
            .where("seller", "==", uid)
            .where("accepted", "==", true)
            .where("completed", "==", true)
            .where("delivered", "==", true)
            .get()
            .then((snapshot) => {
                let dataArray = [];
                let cash = 0
                snapshot.docs.forEach(doc => {
                    let data = doc.data()
                    data.id = doc.id
                    cash += parseInt(data.price);
                    dataArray.push(data)
                });
                return {data: dataArray, total: cash}
            });
    },
    deleteOrder: (orderID) => {
        return firebase
            .firestore()
            .collection("Orders")
            .doc(orderID)
            .delete()
            .then(() => {
                return true
            })
            .catch(err => console.log(err));
    },
    updateOrder: (orderID, key, value) => {
        return firebase
            .firestore()
            .collection("Orders")
            .doc(orderID)
            .update({[key]: value})
            .then(() => {
                return true
            })
            .catch(err => console.log(err));
    },
}
