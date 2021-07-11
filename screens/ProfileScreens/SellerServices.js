import React, {useContext, useEffect, useState} from 'react';
import {KeyboardAvoidingView, ScrollView, StyleSheet, View, Platform, TextInput, RefreshControl,} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {Avatar, Button, Input, ListItem, Text, Divider} from "react-native-elements";
import UserContext from "../../connection/userContext";
import {deleteUserData, getData, saveData} from "../../connection/AsyncStorage";
import {Firebase} from "../../connection/comms";
// import firebase from "firebase";


export default function SellerServices({navigation, route}) {
    const {loggedIn} = useContext(UserContext)
    const [services, setServices] = useState(null)
    const [Loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false);


    const loadDataInView = () => {
        Firebase.getMyServices(loggedIn.uid).then(r => {
            setServices(r)
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

    },[navigation, route])

    const onRefresh = () => {
        setRefreshing(true)
        setLoading(true)

    }

    return (
        <UserContext.Consumer>
            {({loggedIn, setLoggedin}) => (
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "padding"}
                                      style={styles.container} keyboardVerticalOffset={100}>
                    <Text style={{
                        fontSize: 25,
                        fontWeight: "bold",
                        paddingHorizontal: 20,
                        marginTop: 10
                    }}>{route.name}</Text>
                    <Text style={{fontSize: 14, fontWeight: "normal", paddingHorizontal: 20}}>Advertise your service
                        here.</Text>
                    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}
                                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}>


                        {services && services.map((s, k) => (
                            <ListItem key={k} title={s.title}
                                      subtitle={s.details}
                                      onPress={()=>navigation.navigate("Details", {service: s})}
                                      leftAvatar={{
                                          source: {uri: s.cover[0]},
                                          rounded: false,
                                      }}
                                      chevron={true}
                                      subtitleStyle={{color: "grey"}}
                            />))}

                        <Button
                            type={"outline"}
                            title={"Add New Service"}
                            buttonStyle={{borderColor: "#ef3caf", borderRadius: 20}}
                            titleStyle={{color: "#ef3caf"}}
                            onPress={() => navigation.navigate("NewService")}
                            style={{marginTop: 20, marginHorizontal: 20}}
                        />
                        <Button
                            type={"solid"}
                            title={"Back to Profile"}
                            buttonStyle={{borderColor: "#797979", borderRadius: 20}}
                            titleStyle={{color: "#ffffff"}}
                            onPress={() => {
                                navigation.goBack()

                            }}
                            style={{marginTop: 20, marginHorizontal: 20}}
                        />


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