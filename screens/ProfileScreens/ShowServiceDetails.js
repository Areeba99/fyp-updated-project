import React, { useEffect, useState, useContext } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { Button, ListItem, Text } from "react-native-elements";
import UserContext from "../../connection/userContext";
import { Firebase } from "../../connection/comms";
import { Ionicons } from "@expo/vector-icons";
import { SliderBox } from "react-native-image-slider-box";
import Modal from 'react-native-modal';
import { MeasurementsHandler } from "../../connection/MeasurementsHandler";
import { Orders } from "../../connection/OrderHandler";
import firebase from "firebase";


export default function ShowServiceDetails({ navigation, route }) {
    const [isModalVisible, setModalVisible] = useState(false);
    const [mList, setMList] = useState(null)
    const [order, setOrder] = useState(null)
    const [cover, setcover] = useState([])
    let { loggedIn, setLoggedin } = useContext(UserContext)

    const [sellerName, setSellerName] = useState([]);
    useEffect(() => {
        const sellerName = firebase.firestore()
            .collection('users')
            .where("uid", "==", route.params.service.seller)
            .get()
            .then(snapshot => {
                setSellerName(snapshot.docs[0].data().name);
            });
    });
    const [sellerDp, setSellerDp] = useState([]);
    useEffect(() => {
        const sellerName = firebase.firestore()
            .collection('users')
            .where("uid", "==", route.params.service.seller)
            .get()
            .then(snapshot => {
                setSellerDp(snapshot.docs[0].data().dp);
            });
    });

    useEffect(() => {
        let covers = route.params.service?.cover.filter(function (el) {
            return el !== "";
        })
        console.log(covers)
        setcover(covers)
    }, [])
    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    function placeOrder(mm) {
        order.measurements = mm
        Orders.newOrder(order).then(r => {
            toggleModal()
            navigation.navigate('Profile', {
                screen: 'BuyingOrders',
                params: { reload: true },
            });
        })
    }

    function createOrder(service, buyer) {
        setOrder({
            buyer: buyer.uid,
            buyerName: buyer.name,
            title: service.title,
            measurements: {},
            seller: service.seller,
            price: service.price,
            start: Date.now(),
            status: {
                step: 0,
                cancelled: false,
                notes: null
            },
            service: service.id,
            time: service.time,
            ratings: 0
        })
        MeasurementsHandler.getAll(buyer.uid).then(r => {
            if (r.length < 1) {
                alert("Please add measurements. \n Visit Profile > Measurements")
            } else {
                setMList(r)
                toggleModal()
            }
        })
    }

    function handleChatButtonPress() {
        const usersRef = firebase.firestore().collection('MESSAGE_THREADS')
        var x = 0

        usersRef.get()
            .then((querySnapshot) => {
                querySnapshot.forEach(documentSnapshot => {
                    if (documentSnapshot.data().user1 == loggedIn.uid &&
                        documentSnapshot.data().user2 == route.params.service.seller) {
                        x = x + 1;
                    }
                })
                if (x == 0) {
                    firebase.firestore()
                        .collection('MESSAGE_THREADS')
                        .add({
                            nameuser1: loggedIn.name,
                            nameuser2: sellerName,
                            user1: loggedIn.uid,
                            user2: route.params.service.seller,
                            avatar1: loggedIn.dp,
                            avatar2: sellerDp,
                            isBlocked: false,
                            blockedBy1: false,
                            blockedBy2: false,
                            latestMessage: {
                                text: `${loggedIn.name} started a conversation.`,
                                createdAt: new Date().getTime()
                            }
                        })
                        .then(docRef => {
                            docRef.collection('MESSAGES').add({
                                text: `${loggedIn.name} started a conversation.`,
                                createdAt: new Date().getTime(),
                                system: true
                            })
                            navigation.navigate("MessagesList", {
                                screen: "Chats",
                                params: {
                                    seller: route.params.service.seller,
                                    title: "Chat with Seller"
                                }
                            })
                        });  //end then 
                } //end if
                else {
                    navigation.navigate("MessagesList", {
                        screen: "Chats",
                        params: {
                            seller: route.params.service.seller,
                            title: "Chat with Seller"
                        }
                    });
                } // end else
            }); //end then

    }//end function

    return (
        <UserContext.Consumer>
            {({ loggedIn, setLoggedin }) => (
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "padding"}
                    style={styles.container} keyboardVerticalOffset={100}>
                    <Modal isVisible={isModalVisible} style={{ flex: 1 }}>
                        <View style={{
                            paddingVertical: 20,
                            backgroundColor: "white",
                            paddingHorizontal: 20,
                            borderRadius: 20,
                            height: "50%"
                        }}>
                            <Text style={{
                                fontSize: 18,
                                fontWeight: "bold",
                                textAlign: "center"
                            }}>{"Select Your Measurements"}</Text>
                            <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
                                {mList && mList.map(mrmt => <ListItem title={mrmt.n} bottomDivider onPress={() => {
                                    placeOrder(mrmt.m)
                                }} />)}
                            </ScrollView>
                            <Button title="Cancel" onPress={toggleModal} buttonStyle={{ borderRadius: 20 }}
                                type={"outline"} />
                        </View>
                    </Modal>

                    <SliderBox images={cover} sliderBoxHeight={300} dotStyle={{ marginBottom: 20 }}
                        dotColor={"red"} />
                    <View style={{
                        flex: 1,
                        backgroundColor: 'rgba(255,255,255,1)',
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                        paddingHorizontal: 20,
                        marginTop: -20,
                    }}>
                        <View style={{
                            marginTop: -25,
                            justifyContent: "flex-end",
                            display: "flex",
                            flexDirection: "row",
                        }}>
                            {loggedIn.uid === route.params.service?.seller ?
                                <>
                                    <Button icon={<Ionicons name={"ios-trash"} size={28} color={"white"} />}
                                        buttonStyle={{
                                            backgroundColor: "red",
                                            width: 50,
                                            height: 50,
                                            borderRadius: 50,
                                        }}
                                        onPress={() => (
                                            Firebase.deleteThisService(route.params.service.id).then(r => {
                                                if (r === true) {
                                                    navigation.navigate("Services", { reload: true })
                                                } else {
                                                    alert(r)
                                                }
                                            })
                                        )}
                                    />
                                    <Button icon={<Ionicons name={"md-create"} size={28} color={"white"} />}
                                        buttonStyle={{
                                            backgroundColor: "green",
                                            width: 50,
                                            height: 50,
                                            borderRadius: 50,
                                            marginHorizontal: 10,
                                        }}
                                        onPress={() => navigation.navigate("NewService", {

                                            service: route.params.service,
                                            title: "Modify Service"

                                        })}
                                    />
                                </> : <><Button icon={<Ionicons name={"ios-cart"} size={28} color={"white"} />}
                                    title={" Purchase"}
                                    buttonStyle={{
                                        backgroundColor: "#0085a2",
                                        width: 150,
                                        height: 50,
                                        borderRadius: 50,
                                        marginRight: 10,
                                    }}
                                    onPress={() => {
                                        Alert.alert("Confirm Purchase",
                                            "Do you want to purchase this offer at Rs." + route.params.service?.price + "?",
                                            [{
                                                text: "Cancel",
                                                onPress: () => console.log("Order Cancelled"),
                                                style: "cancel"
                                            },
                                            {
                                                text: "OK",
                                                onPress: () => createOrder(route.params.service, loggedIn)
                                            }
                                            ])
                                    }}
                                />

                                    <Button icon={<Ionicons name={"ios-mail"} size={28} color={"white"} />}
                                        title={" Chat"}
                                        buttonStyle={{
                                            backgroundColor: "#a362fd",
                                            width: 100,
                                            height: 50,
                                            borderRadius: 50,
                                        }}
                                        onPress={handleChatButtonPress} />
                                </>}


                        </View>
                        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>

                            <Text style={{
                                fontSize: 14,
                                color: "grey",
                                fontStyle: "italic",
                            }}>{"Category: " + route.params.service?.category + ", Est. Time: " + route.params.service?.time}</Text>
                            <Text style={{
                                fontSize: 24,
                                color: "grey",
                                fontWeight: "bold",
                            }}>{route.params.service?.title}</Text>

                            <Text style={{
                                fontSize: 14,
                                color: "grey",
                                marginTop: 10,
                            }}>{"Starting at: PKR " + route.params.service?.price}</Text>
                            <Text style={{
                                fontSize: 18,
                                color: "grey",
                                marginTop: 20,
                            }}>{route.params.service?.details}</Text>

                            <Button
                                type={"solid"}
                                title={"Go Back"}
                                buttonStyle={{ borderColor: "#797979", borderRadius: 20 }}
                                titleStyle={{ color: "#ffffff" }}
                                onPress={() => {
                                    navigation.goBack()

                                }}
                                style={{ marginTop: 20, marginHorizontal: 20 }}
                            />


                        </ScrollView>

                    </View>
                </KeyboardAvoidingView>

            )}
        </UserContext.Consumer>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    contentContainer: {
        paddingTop: 30,
        paddingBottom: 20
    },

});
