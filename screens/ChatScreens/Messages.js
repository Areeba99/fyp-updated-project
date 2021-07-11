import React, { useContext, useEffect, useState } from "react";
import { GiftedChat, Bubble, InputToolbar, Send, Composer, SystemMessage } from 'react-native-gifted-chat';
import { StyleSheet } from "react-native";
import UserContext from "../../connection/userContext";
import firebase from "firebase";
//import * as ImagePicker from 'expo-image-picker';
//import BtnRound from "../../components/BtnRound";

export default function MessagesScreen({ navigation, route }) {
    const { thread } = route.params;
    let { loggedIn, setLoggedin } = useContext(UserContext)
    const user = loggedIn;
    var emergencyText = "You can no longer send messages in this conversation."

    const [messages, setMessages] = useState([
        // example of system message  
        {
            _id: 0,
            text: 'Say Hello',
            createdAt: new Date().getTime(),
            system: true,
        }

    ])

    useEffect(() => {
        const unsubscribeListener = firebase.firestore()
            .collection('MESSAGE_THREADS')
            .doc(thread._id)
            .collection('MESSAGES')
            .orderBy('createdAt', 'desc')
            .onSnapshot(querySnapshot => {
                const messages = querySnapshot.docs.map(doc => {
                    const firebaseData = doc.data()

                    const data = {
                        _id: doc.id,
                        text: '',
                        createdAt: new Date().getTime(),
                        ...firebaseData
                    }

                    if (!firebaseData.system) {
                        data.user = {
                            ...firebaseData.user,
                            name: firebaseData.user.name,
                            avatar: firebaseData.user.avatar
                        }
                    }

                    return data
                })

                setMessages(messages)
            })

        return () => unsubscribeListener()
    }, []) //end useEffect hook


    function handleSend(newMessage = []) {
        setMessages(GiftedChat.append(messages, newMessage))

    }
    async function handleSend(messages) {
        const text = messages[0].text
        firebase.firestore()
            .collection('MESSAGE_THREADS')
            .doc(thread._id)
            .collection('MESSAGES')
            .add({
                text,
                createdAt: new Date().getTime(),
                user: {
                    _id: user.uid,
                    name: user.name,
                    avatar: user.dp
                }
            })
        await firebase.firestore()
            .collection('MESSAGE_THREADS')
            .doc(thread._id)
            .set(
                {
                    latestMessage: {
                        text,
                        createdAt: new Date().getTime()
                    }
                },
                { merge: true }
            )
    }

    return (
        <GiftedChat
            messages={messages}
            onSend={handleSend}
            user={{
                _id: user.uid,
                name: user.name,
                avatar: user.dp
            }}
            renderUsernameOnMessage={true}
            showUserAvatar={true}
            showAvatarForEveryMessage={true}

            renderInputToolbar={(props) => {
                if (thread.isBlocked == true) {
                    return <InputToolbar
                        //  render={null}
                        disable={true}
                        text={emergencyText}
                    />
                }
                else {
                    return <InputToolbar
                        {...props}
                        disable={false}
                    />
                }
            }}
            renderSend={(props) => {
                if (thread.isBlocked == true) {
                    return <Send
                        {...props}
                        disabled={true}
                        textStyle={{ color: "white" }}
                    />
                }
                else {
                    return <Send
                        {...props}
                        disabled={false}
                        textStyle={{ color: "pink" }}
                    />
                }
            }}
            // <BtnRound icon="camera" iconColor={"red"} size={40} style={{ marginHorizontal: 5 }} onPress={() => this.choosePicture()} />
            //<Icon name="ios-send" size={24} color="#ffffff" />
            renderSystemMessage={(props) => {
                return <SystemMessage
                    {...props}
                    wrapperStyle={{
                        backgroundColor: "pink",
                        padding: 5
                    }}
                    textStyle={{
                        color: "black"
                    }}
                />
            }}

            renderBubble={(props) => {
                return <Bubble
                    {...props}
                    wrapperStyle={{
                        right: {
                            backgroundColor: "pink"
                        },
                        left: {
                            backgroundColor: "white"
                        }
                    }}
                    textStyle={{
                        right: {
                            color: "black"
                        }
                    }}
                />
            }}
        />
    )
}

const styles = StyleSheet.create({
    composer: {
        borderRadius: 25,
        borderWidth: 0.5,
        borderColor: '#dddddd',
        marginTop: 10,
        marginBottom: 10,
        paddingLeft: 10,
        paddingTop: 5,
        paddingBottom: 5,
        paddingRight: 10,
        fontSize: 16
    },
    btnSend: {
        height: 40,
        width: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
        backgroundColor: "pink",
        borderRadius: 50
    }
});
