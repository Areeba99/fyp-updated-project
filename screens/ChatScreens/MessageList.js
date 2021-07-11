import React, { useState, useEffect, useContext } from "react";
import { Button, Avatar } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";
import firebase from "firebase";
import { Alert } from "react-native";
import { View, StyleSheet, FlatList, Text, TouchableOpacity } from "react-native";
import UserContext from "../../connection/userContext";
import { List, Divider } from 'react-native-paper';//install react-native-vector-icons first
import { Chats } from "../../connection/ChatHandler";


export default function MessagesList({ navigation, route }) {
    let { loggedIn, setLoggedin } = useContext(UserContext)

    const buyerName = loggedIn.name;
    const [threads, setThreads] = useState([]);
    const [mapArrayLen, setMapArrayLen] = useState(0);

    //the following section of code needs a few changes = needs to be reloaded
    useEffect(() => {
        const dbRef = firebase.firestore().collection('MESSAGE_THREADS');
        let mapArray = [];
        dbRef.onSnapshot((querySnapshot) => {
            querySnapshot.forEach(documentSnapshot => {
                if (documentSnapshot.data().user1 == loggedIn.uid ||
                    documentSnapshot.data().user2 == loggedIn.uid) {
                    mapArray.push(documentSnapshot);
                }
            });
            setMapArrayLen(mapArray.length);
        });

        const unsubscribe = dbRef.onSnapshot((querySnapshot) => {
            const threads =
                mapArray.map((documentSnapshot) => {
                    return {
                        _id: documentSnapshot.id,
                        // give defaults
                        user1: '',
                        user2: '',
                        latestMessage: '',
                        ...documentSnapshot.data(),
                    };
                });
            setThreads(threads);
        });
        return () => {
            unsubscribe();
        }
    }, []);

    function isArrayEmpty() {
        if (mapArrayLen == 0) {
            return "You do not have any chats currently.";
        }
        else {
            return "";
        }
    }

    function getName(item) {  //to get the name for message threads
        if (loggedIn.name == item.nameuser2)
            return item.nameuser1;
        else
            return item.nameuser2;
    }
    function getAvatar(item) {  //to get the avatar for message threads
        if (loggedIn.name == item.nameuser2)
            return item.avatar1;
        else
            return item.avatar2;
    }

    return (
        <View style={styles.container}>
            <Text>{isArrayEmpty()}</Text>
            <FlatList
                data={threads}
                keyExtractor={item => item._id}
                ItemSeparatorComponent={() => <Divider />}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={{
                            flex: 1,
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center"
                        }}
                        onPress={() => {
                            navigation.navigate('Chat', {
                                thread: item,
                                loggedIn: loggedIn.uid,
                                title: getName(item)
                            })
                        }}
                    >
                        <Avatar
                            rounded size={50} source={{
                                uri:
                                    getAvatar(item)
                            }} />
                        <List.Item
                            style={{
                                width: '60%'
                            }}
                            title={getName(item)} //display name
                            description={item.latestMessage.text}
                            titleNumberOfLines={1}
                            titleStyle={styles.listTitle}
                            descriptionStyle={styles.listDescription}
                            descriptionNumberOfLines={1}
                        />
                        <Button icon={<Ionicons name={"ios-trash"} size={28} color={"black"} />}
                            buttonStyle={{
                                backgroundColor: 'rgba(0, 0, 0, 0)',
                                flex: 1,
                                borderRadius: 50,

                            }}
                            onPress={() => (
                                Alert.alert("Delete Chat", 'Are you sure you want to delete this chat?',
                                    [{
                                        text: "No",
                                        onPress: () => console.log("Cancel Pressed"),
                                        style: "cancel"
                                    },
                                    {
                                        text: "Yes", onPress: () => {
                                            firebase.firestore().collection('MESSAGE_THREADS').doc(item._id).delete()
                                                .then(r => {
                                                    if (r === true) {
                                                        navigation.navigate("Chat", { reload: true })
                                                    } else {
                                                        alert(r)
                                                    }
                                                })
                                        }
                                    }
                                    ])
                            )}
                        />
                        <Button icon={<Ionicons name={"ios-menu"} size={28} color={"black"} />}
                            buttonStyle={{
                                backgroundColor: 'rgba(0, 0, 0, 0)',
                                flex: 1,
                                borderRadius: 50,
                            }}
                            onPress={() => {
                                if ((item.isBlocked == false) ||
                                    ((loggedIn.uid == item.user1) && (item.blockedBy2 == true) && (item.blockedBy1 == false)) ||
                                    ((loggedIn.uid == item.user2) && (item.blockedBy1 == true) && (item.blockedBy2 == false))) {
                                    Alert.alert("Block User", 'Are you sure you want to block this user?',
                                        [{
                                            text: "No",
                                            onPress: () => console.log("Cancel Pressed"),
                                            style: "cancel"
                                        },
                                        {
                                            text: "Yes", onPress: () => {
                                                if (loggedIn.uid == item.user1) {
                                                    firebase.firestore().collection('MESSAGE_THREADS').doc(item._id).update({
                                                        isBlocked: true,
                                                        blockedBy1: true
                                                    }).then(() => {
                                                        console.log("update done1");
                                                    });
                                                }
                                                else {
                                                    firebase.firestore().collection('MESSAGE_THREADS').doc(item._id).update({
                                                        isBlocked: true,
                                                        blockedBy2: true
                                                    }).then(() => {
                                                        console.log("update done2");
                                                    });
                                                }

                                            }
                                        }
                                        ]) //end alert

                                } //end if
                                else if (loggedIn.uid == item.user1 && item.blockedBy1 == true) {
                                    Alert.alert("Unblock User", 'Are you sure you want to unblock this user?',
                                        [{
                                            text: "No",
                                            onPress: () => console.log("Cancel Pressed"),
                                            style: "cancel"
                                        },
                                        {
                                            text: "Yes", onPress: () => {

                                                firebase.firestore().collection('MESSAGE_THREADS').doc(item._id).update({
                                                    blockedBy1: false
                                                }).then(() => {
                                                    console.log("update done1");
                                                });
                                            }
                                        }
                                        ])
                                } //end else if
                                else if (loggedIn.uid == item.user2 && item.blockedBy2 == true) {
                                    Alert.alert("Unblock User", 'Are you sure you want to unblock this user?',
                                        [{
                                            text: "No",
                                            onPress: () => console.log("Cancel Pressed"),
                                            style: "cancel"
                                        },
                                        {
                                            text: "Yes", onPress: () => {
                                                firebase.firestore().collection('MESSAGE_THREADS').doc(item._id).update({
                                                    blockedBy2: false
                                                }).then(() => {
                                                    console.log("update done1");
                                                });

                                            }
                                        }
                                        ])
                                } //end else
                                if (item.blockedBy1 == false && item.blockedBy2 == false) {
                                    firebase.firestore().collection('MESSAGE_THREADS').doc(item._id).update({
                                        isBlocked: false
                                    }).then(() => {
                                        console.log("youre not blocked anymore");
                                    });
                                }
                            }}
                        />
                    </TouchableOpacity>
                )} //render item close
            />
        </View>
    );

}
const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f5f5f5',
        flex: 1
    },
    listTitle: {
        fontSize: 22
    },
    listDescription: {
        fontSize: 16
    }
});

