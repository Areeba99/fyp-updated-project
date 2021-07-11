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


export default function Earnings({navigation, route}) {
    const {loggedIn} = useContext(UserContext)
    const [orders, setOrders] = useState(null)
    const [Loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false);
    const [earnings, setEarnings] = useState(0)


    const loadDataInView = () => {
        Orders.getEarnings(loggedIn.uid).then(r => {
            console.log(r)
            setOrders(r.data)
            setEarnings(r.total)
            setLoading(false)
            setRefreshing(false)
        })
    }

    useEffect(() => {
        if (route.params?.reload){
            loadDataInView()
        }

        console.log("Effect Seller Services")
        if (Loading === true) {
            loadDataInView()
        }

    })

    const onRefresh = () => {
        setRefreshing(true)
        setLoading(true)

    }

    return (
        <UserContext.Consumer>
            {({loggedIn, setLoggedin}) => (
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "padding"}
                                      style={styles.container} keyboardVerticalOffset={100}>
                    <View style={{height: 100, justifyContent: "center", alignItems: "center"}}>
                        <Text style={{fontSize: 12, color: "grey", marginBottom: 10}}>{"All time earnings"}</Text>
                        <Text style={{fontSize: 40, color: "#000", fontWeight: "bold"}}>{"Rs. "+ earnings}</Text>
                    </View>
                    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}
                                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}>
                        {orders && orders.map((o, k) => {
                            return (<ListItem key={k} title={"Earned: Rs."+o.price}
                                              titleStyle={{fontSize: 14}}
                                              bottomDivider
                                              chevron
                                              subtitle={"Order ID: "+o.id}
                                              subtitleStyle={{color: "grey", fontSize: 12}}
                                              leftIcon={<Ionicons name={"md-checkmark-circle"} size={28} color={"green"}/>}
                                              onPress={()=>navigation.navigate("SellingOrderDetails", {order: o})}

                            />)
                            })}
                            <Text style={{textAlign: "center", color: "grey", marginVertical: 20}}>No More details to show.</Text>

                    </ScrollView>
                </KeyboardAvoidingView>

            )}
        </UserContext.Consumer>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1 ,
        backgroundColor: '#fff',
    },

    contentContainer: {
        paddingTop: 30,
        paddingBottom: 20
    },

});