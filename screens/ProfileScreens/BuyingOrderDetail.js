import React, {useContext, useEffect, useState} from 'react';
import {KeyboardAvoidingView, ScrollView, StyleSheet, View, Platform, TextInput, RefreshControl,} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {Avatar, Button, Input, ListItem, Text, Divider} from "react-native-elements";
import UserContext from "../../connection/userContext";
import {deleteUserData, getData, saveData} from "../../connection/AsyncStorage";
import {Firebase} from "../../connection/comms";
import {Orders} from "../../connection/OrderHandler";
import {Ionicons} from "@expo/vector-icons";
// import firebase from "firebase";

import {Rating, AirbnbRating} from 'react-native-ratings';
import FormButton from "../../components/FormButton";


export default function BuyingOrderDetail({navigation, route}) {
    const {loggedIn} = useContext(UserContext)
    const [orders, setOrders] = useState(null)
    const [Loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false);

    const [rating, setrating] = useState(0);
    const [review, setreview] = useState("");


    const loadDataInView = () => {
        console.log(route.params)
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

    }

    return (
        <UserContext.Consumer>
            {({loggedIn, setLoggedin}) => (
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "padding"}
                                      style={styles.container} keyboardVerticalOffset={100}>
                    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}
                                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}>
                        <ListItem title={"Service: " + route.params.order.title} bottomDivider/>
                        <ListItem
                            title={"Order Place Date: " + (new Date(route.params.order.start).toLocaleDateString())}
                            bottomDivider/>
                        <ListItem title={"Expected Time (days): " + route.params.order.time} bottomDivider/>
                        <ListItem title={"Order ID: " + route.params.order.id} bottomDivider/>
                        <ListItem title={"Price: Rs." + route.params.order.price}/>
                        <Divider style={{height: 20, backgroundColor: "#fff"}}/>

                        {route.params.order.status.step === 1 ?
                            <Text style={{color: "grey", paddingLeft: 10}}> -> Seller Started Working On Your
                                Order</Text> : null}
                        {route.params.order.status.step === 2 ?
                            <Text style={{color: "grey", paddingLeft: 10}}> -> Seller Dispatched Your Order. Pending
                                Approval From You.</Text> : null}


                        {route.params.order.status.step === 0 &&
                        <Button title={"Delete Order"}
                                style={styles.deleteButton}
                                buttonStyle={{borderRadius: 10}}
                                onPress={() => {
                                    Orders.deleteOrder(route.params.order.id).then(r => {
                                        navigation.navigate("BuyingOrders", {reload: true})
                                    })
                                }}/>}


                        {route.params.order.status.step === 2 &&
                        <Button title={"Order Received"} style={styles.deleteButton}
                                buttonStyle={{borderRadius: 10}}
                                onPress={() => {
                                    Orders.updateOrder(route.params.order.id, "status.step", route.params.order.status.step + 1)
                                        .then(navigation.navigate("BuyingOrders", {reload: true}))
                                }}
                        />}

                        {route.params.order.status.step === 3 &&
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
    deleteButton: {
        marginHorizontal: "15%",
        marginVertical: "5%",
        borderRadius: 30,
    },

});
