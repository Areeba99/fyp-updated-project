import React, {useContext, useEffect, useState} from 'react';
import {KeyboardAvoidingView, ScrollView, StyleSheet, View, Platform, TextInput, RefreshControl,} from 'react-native';
import {Avatar, Button, Input, ListItem, Text, Divider} from "react-native-elements";
import UserContext from "../connection/userContext";
import {Firebase} from "../connection/comms";
import * as Notifications from "expo-notifications";
import firebase from "firebase";

export default function NotificationScreen({navigation, route}) {
    const {loggedIn} = useContext(UserContext)
    const [notifs, setNotifs] = useState(null)
    const [Loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {

        let unsub = firebase.firestore()
            .collection("Orders")
            .onSnapshot((snapshot) => {
                console.log("snapshot2")
                for (const change of snapshot.docChanges()) {
                    console.log(change.type);

                    if (change.type === "added") {
                        let data = change.doc.data();
                        if (data.seller === loggedIn.uid) {
                            const content = {
                                title: 'New Order',
                                body: "Please check and agree if you want to work on it."
                            };
                            Notifications.scheduleNotificationAsync({content, trigger: null})
                                .then(r => console.log("Notification -> " + r));
                        }
                    }
                    if (change.type === "modified") {
                        let data = change.doc.data();

                        const content = {
                            title: 'News about your order.',
                            body: "Your order for service '" + data.title + "' has been updated."
                        };
                        Notifications.scheduleNotificationAsync({content, trigger: null})
                            .then(r => {
                                return firebase.firestore()
                                    .collection("notifications")
                                    .doc(loggedIn.uid)
                                    .collection("notifs")
                                    .add(content)
                                    .then((r) => {
                                        return r
                                    });
                            });


                        // if (data.buyer === loggedIn.uid && data.accepted === true && data.delivered === false && data.complated === false) {
                        //     const content = {
                        //         title: 'Seller agreed to work.',
                        //         body: "Seller has agreed to work on the following service: "+data.title
                        //     };
                        //     Notifications.scheduleNotificationAsync({content, trigger: null})
                        //         .then(r => console.log("Notification -> " + r));
                        // }
                        // if (data.buyer === loggedIn.uid && data.accepted === true && data.delivered === true && data.complated === false) {
                        //     const content = {
                        //         title: 'Seller has completed working..',
                        //         body: "Seller has completed work on the following service: "+data.title
                        //     };
                        //     Notifications.scheduleNotificationAsync({content, trigger: null})
                        //         .then(r => console.log("Notification -> " + r));
                        // }
                        // if (data.seller === loggedIn.uid && data.accepted === true && data.delivered === true && data.complated === true) {
                        //     const content = {
                        //         title: 'Order Completed',
                        //         body: "Buyer has accepted your order #" + data.id
                        //     };
                        //     Notifications.scheduleNotificationAsync({content, trigger: null})
                        //         .then(r => console.log("Notification -> " + r));
                        // }
                    }
                }
            });
        Notifications.addNotificationResponseReceivedListener((resp) => {
            navigation.navigate("Notifications")
        });
        return () => {
            unsub()
        }
    }, [])

    const loadDataInView = () => {
        console.log("LoadDataInView")
        firebase.firestore()
            .collection("notifications")
            .doc(loggedIn.uid)
            .collection("notifs")
            .get()
            .then((snapshot) => {
                let dataArray = [];
                snapshot.docs.forEach(doc => {
                    let data = doc.data()
                    data.id = doc.id
                    dataArray.push(data)
                });
                console.log(dataArray)
                setNotifs(dataArray)
                setLoading(false)
                setRefreshing(false)
            }).catch(err => console.log(err))
    }

    useEffect(() => {
        if (route.params?.reload) {
            loadDataInView()
        }
        console.log("Effect Seller Services")
        if (Loading === true) {
            loadDataInView()
        }
    }, [navigation, route])

    const onRefresh = () => {
        setRefreshing(true)
        setLoading(true)
        loadDataInView()

    }

    return (
        <UserContext.Consumer>
            {({loggedIn, setLoggedin}) => (
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "padding"}
                                      style={styles.container} keyboardVerticalOffset={100}>
                    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}
                                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}>
                        {notifs && notifs.map((s, k) => (
                            <ListItem key={k}
                                      title={s.title}
                                      subtitle={s.body}
                                      subtitleStyle={{color: "grey"}}
                                      bottomDivider
                            />))}

                        {notifs && notifs.length < 1 ?
                            <Text style={{fontSize: 12, color: "grey", textAlign: "center"}}>No Notifications for
                                you.</Text> : null}

                    </ScrollView>
                </KeyboardAvoidingView>

            )}
        </UserContext.Consumer>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },

    contentContainer: {
        paddingTop: 30,
        paddingBottom: 20
    },

});