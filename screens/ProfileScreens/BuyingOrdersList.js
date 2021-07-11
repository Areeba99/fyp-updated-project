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


export default function BuyingOrderList({navigation, route}) {
    const {loggedIn} = useContext(UserContext)
    const [orders, setOrders] = useState(null)
    const [Loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false);

    console.log(route.params)

    const loadDataInView = () => {
        Orders.getBuyingOrders(loggedIn.uid).then(r => {
            setOrders(r)
            setLoading(false)
            setRefreshing(false)
        })
    }

    useEffect(() => {
        if (route.params?.reload){
            loadDataInView()
        }
        if (Loading === true) {
            loadDataInView()
        }

    },[Loading, refreshing])

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
                        {orders && orders.map((o, k) => (
                            <ListItem key={k} title={"Order ID: "+o.id}
                                      bottomDivider
                                      subtitle={"Price: Rs."+o.price}
                                      chevron={true}
                                      subtitleStyle={{color: "grey"}}
                                      leftIcon={o.status.step >= 3 ? <Ionicons name={"md-checkmark"} size={28} color={"green"}/>:<Ionicons name={"md-hourglass"} size={28} color={"orange"}/>}
                                      onPress={()=>navigation.navigate("BuyingOrdersDetails", {order: o})}

                            />))}
                            <Text style={{textAlign: "center", color: "grey",}}>No More Orders to display.</Text>

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
