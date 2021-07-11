import React, {useContext, useEffect, useState} from 'react';
import {KeyboardAvoidingView, ScrollView, StyleSheet, View, Platform, TextInput, RefreshControl,} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {Avatar, Button, Input, ListItem, Text, Divider} from "react-native-elements";
import UserContext from "../../connection/userContext";
import {deleteUserData, getData, saveData} from "../../connection/AsyncStorage";
import {Firebase} from "../../connection/comms";
import {Orders} from "../../connection/OrderHandler";
import {Ionicons} from "@expo/vector-icons";
import {AirbnbRating} from "react-native-ratings";
// import firebase from "firebase";


export default function SellingOrderDetail({navigation, route}) {
    const [Loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false);
    const [time, setTime] = useState("")


    const loadDataInView = () => {
        countDown(route.params.order.start, route.params.order.time)

    }

    useEffect(() => {
        if (route.params?.reload) {
            loadDataInView()
        }
        if (Loading === true) {
            loadDataInView()
        }

    }, [navigation, route])

    const onRefresh = () => {
        setRefreshing(true)
        setLoading(true)

    }

    function countDown(start, endtime) {
        let timer;
        let compareDate = new Date(start);
        compareDate.setDate(compareDate.getDate() + parseInt(endtime));
        timer = setInterval(function () {
            timeBetweenDates(compareDate);
        }, 1000);
        function timeBetweenDates(toDate) {
            let dateEntered = toDate;
            let now = new Date();
            let difference = dateEntered.getTime() - now.getTime();
            if (difference <= 0) {
                setTime("Time Completed.")
                clearInterval(timer);
            } else {
                let seconds = Math.floor(difference / 1000);
                let minutes = Math.floor(seconds / 60);
                let hours = Math.floor(minutes / 60);
                let days = Math.floor(hours / 24);
                hours %= 24;
                minutes %= 60;
                seconds %= 60;
                setTime(days + ":" + hours + ":" + minutes + ":" + seconds)
            }
        }

    }
    return (
        <UserContext.Consumer>
            {({loggedIn, setLoggedin}) => (
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "padding"}
                                      style={styles.container} keyboardVerticalOffset={100}>
                    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}
                                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}>
                        <ListItem title={"Service: " + route.params.order.title} bottomDivider/>
                        <ListItem title={"Order Place Date: " + (new Date(route.params.order.start).toLocaleDateString())} bottomDivider/>

                        <ListItem title={"Order ID: " + route.params.order.id} bottomDivider/>
                        <ListItem title={"Price: Rs." + route.params.order.price} bottomDivider/>

                        {route.params.order.status.step >=3 && <ListItem title={"Order has been completed."} titleStyle={{fontWeight: "bold"}}/>}
                        {route.params.order.status.step === 1 && <ListItem title={"Timer: " + time} titleStyle={{fontWeight: "bold"}}/>}



                        <Divider style={{height: 20, backgroundColor: "#fff"}}/>
                        <Text style={{color: "grey", paddingLeft: 10}}>Customer's Measurements</Text>
                        {Object.keys(route.params.order.measurements).map((k, v) => (
                            <View style={{flexDirection: "row", paddingHorizontal: 20, paddingVertical: 5, justifyContent: "space-between"}}>
                                <Text style={{width: "50%", color: "#565656"}}>{k.toLocaleUpperCase() + ":  "}</Text>
                                <Text style={{color: "#565656"}}>{route.params.order.measurements[k]}</Text>
                            </View>
                        ))}

                        <View style={{marginTop: 30}}/>




                        {route.params.order.status.step === 0 &&
                        <Button title={"Accept Order"}
                                style={styles.deleteButton}
                                buttonStyle={{borderRadius: 10}}
                                onPress={() => {
                                    Orders.updateOrder(route.params.order.id, "status.step", 1).then(r => {
                                        navigation.navigate("SellingOrder", {reload: true})
                                    })
                                }}/>}

                        {route.params.order.status.step === 1 &&
                        <Button title={"Mark as Delivered!"}
                                style={styles.deleteButton}
                                buttonStyle={{borderRadius: 10}}
                                onPress={() => {
                                    Orders.updateOrder(route.params.order.id, "status.step", 2).then(r => {
                                        navigation.navigate("SellingOrder", {reload: true})
                                    })
                                }}/>}

                        {route.params.order.status.step === 0 ?
                            <Text style={{color: "grey", paddingLeft: 10}}> Order Placed. Please update the status when you start working.</Text> : null}

                        {route.params.order.status.step === 1 ?
                            <Text style={{color: "grey", paddingLeft: 10}}> Please dispatch the order then mark as delivered.</Text> : null}

                        {route.params.order.status.step === 2 ?
                            <Text style={{color: "grey", paddingLeft: 10}}> Awaiting Customer's Response</Text> : null}

                        {route.params.order.status.step === 3 && !route.params.order.feedback ?
                            <Text style={{color: "grey", paddingLeft: 10}}> Order Completed By Customer. Awaiting Feedback.</Text> : null}


                        {route.params.order.status.step === 3 && route.params.order.feedback &&
                        <View style={{
                            paddingHorizontal: 25,
                            paddingVertical: 10,
                        }}>
                            <AirbnbRating defaultRating={route.params.order.feedback ? route.params.order.feedback.rating: 3}
                                          selectedColor={"pink"} reviewColor={"pink"} reviewSize={18}
                                          size={25}
                                          isDisabled={route.params.order.feedback}
                                          onFinishRating={(rating)=>{
                                              setrating(rating)
                                          }}
                            />
                            <Input multiline
                                   placeholder={"Please leave your feedback!"}
                                   containerStyle={{
                                       backgroundColor: "#fafafa",
                                       height: 100,
                                       marginTop: 15,
                                       borderColor: "#99999930",
                                       borderRadius: 6,
                                       borderWidth: 1,
                                   }}
                                   inputContainerStyle={{borderBottomWidth: 0}}
                                   value={route.params.order.feedback ? route.params.order.feedback.review : review}
                                   disabled={route.params.order.feedback}
                                   onChangeText={(t)=>setreview(t)}
                            />
                            <Button title={"Submit Feedback"} style={styles.deleteButton}
                                    disabled={route.params.order.feedback}
                                    buttonStyle={{borderRadius: 10,backgroundColor: "pink"}}
                                    onPress={() => {
                                        if (rating === 0 && review.length < 25){
                                            alert("Please rate above 0 & review must me at least 25 chars.")
                                        }else{
                                            Orders.updateOrder(route.params.order.id, "feedback", {rating: rating, review: review})
                                                .then(r => {
                                                    if (r){
                                                        alert("Review Submitted.")
                                                        navigation.navigate("BuyingOrders", {reload: true})
                                                    }else{
                                                        alert("Error submitting your review.")
                                                    }
                                                })

                                        }
                                    }}
                            />
                        </View>
                        }

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
    deleteButton:{
        marginHorizontal: "15%",
        marginVertical: "5%",
        borderRadius: 30,
    }
});
