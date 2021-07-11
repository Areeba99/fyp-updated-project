import React, { useContext, useEffect, useState } from 'react';
import { KeyboardAvoidingView, ScrollView, StyleSheet, View, Platform, TextInput, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Avatar, Button, Input, ListItem, Text, Divider } from "react-native-elements";
import UserContext from "../connection/userContext";
import { deleteUserData, getData, saveData } from "../connection/AsyncStorage";
import { Firebase } from "../connection/comms";
import Toast from "../components/ToastMessage";
import firebase from "firebase";


export default function ProfileScreen({ navigation, route }) {
    let { loggedIn, setLoggedin } = useContext(UserContext)


    useEffect(() => {
        (async () => {
            if (Platform.OS !== 'web') {
                const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
                if (status !== 'granted') {
                    alert('Sorry, we need camera roll permissions to make this work!');
                }
            }
        })();
    }, []);


    const pickImage = async (uid) => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });
        console.log(result);

        if (!result.cancelled) {
            Firebase.userAvatar(result.uri, uid)
                .then(dpLink => {
                    console.log(dpLink)
                    Firebase.updateData("dp", dpLink, uid)
                        .then(s => {
                            if (s === true) {
                                setLoggedin(previousState => ({ ...previousState, dp: dpLink }))
                                saveData(loggedIn).then(() => alert("Profile Picture Updated."))
                            }
                        })
                })

        }
    };


    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "padding"}
            style={styles.container} keyboardVerticalOffset={100}>

            {/*{loggedIn.profileStatus === "incomplete" ?*/}
            {/*    <Toast message={"Please Complete your profile."} color={"#ef3caf"}/> : null}*/}

            <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
                <View style={{ alignItems: "center", marginBottom: 20 }}>
                    <Avatar source={{ uri: loggedIn.dp }} size={"xlarge"} rounded
                        title={loggedIn.name.charAt(0).toUpperCase()}
                        showEditButton={true} onEditPress={() => pickImage(loggedIn.uid)} />
                </View>


                <View style={{ alignItems: "center", marginBottom: 20 }}>
                    <TextInput placeholder={"Write bio here (300 chars max)"} defaultValue={loggedIn.bio}
                        maxLength={300} multiline={true}
                        onChangeText={(e) => {
                            setLoggedin(previousState => ({ ...previousState, bio: e }));
                        }}
                        style={{ textAlign: "center", width: "80%", height: 50 }} />
                    <Button
                        onPress={() => {
                            if (loggedIn.bio != undefined) {
                                Firebase.updateData("bio", loggedIn.bio, loggedIn.uid).then(r => {
                                    if (r === true) {
                                        saveData(loggedIn).then(r => alert("Updated Profile."))
                                    }
                                })
                            } else {
                                Alert.alert("Bio is empty", "Please write some text in your bio.")
                            }

                        }}
                        title={"Update Bio"}
                        titleStyle={{ fontSize: 12, color: "#ef3caf", textDecorationLine: "underline" }}
                        type="clear"
                        style={{ padding: 10, }}
                    />
                </View>
                <ListItem
                    topDivider
                    title="Full Name"
                    titleStyle={{ fontSize: 14 }}
                    input={{
                        placeholder: 'Type Here',
                        defaultValue: loggedIn.name,
                        disabled: true,
                        inputStyle: { fontSize: 14 }
                    }}
                />
                <ListItem
                    topDivider
                    title="Email"
                    titleStyle={{ fontSize: 14 }}
                    input={{
                        placeholder: 'Type Here',
                        defaultValue: loggedIn.email,
                        textContentType: "emailAddress",
                        disabled: true,
                        inputStyle: { fontSize: 14 }

                    }}
                />
                <ListItem
                    topDivider
                    title={"Location"}
                    titleStyle={{ fontSize: 14 }}

                    input={{
                        placeholder: 'Type Here',
                        textContentType: "location",
                        defaultValue: loggedIn.city,
                        onFocus: () => {
                            navigation.push("Location")
                        },
                        inputStyle: { fontSize: 14 }
                    }}
                />
                <ListItem
                    titleStyle={{ fontSize: 14 }}
                    topDivider
                    bottomDivider
                    title={"Seller Mode"}
                    checkBox={{
                        center: true,
                        iconRight: true,
                        checkedTitle: "Disable ",
                        title: "Enable ",
                        checked: loggedIn.sellerMode,
                        onPress() {
                            console.log("1 Current Value : ", loggedIn.sellerMode);

                            if (loggedIn.sellerMode === undefined) {
                                setLoggedin(previousState => ({ ...previousState, sellerMode: true }));
                                Firebase.updateData("sellerMode", true, loggedIn.uid).then(r => console.log("Seller Mode Updated"))
                            } else if (loggedIn.sellerMode === true) {
                                setLoggedin(previousState => ({ ...previousState, sellerMode: false }));
                                console.log(loggedIn.sellerMode)
                                Firebase.updateData("sellerMode", false, loggedIn.uid).then(r => console.log("Seller Mode Updated"))
                            } else if (loggedIn.sellerMode === false) {
                                setLoggedin(previousState => ({ ...previousState, sellerMode: true }));
                                console.log(loggedIn.sellerMode)
                                Firebase.updateData("sellerMode", true, loggedIn.uid).then(r => console.log("Seller Mode Updated"))
                            }
                        }
                    }}
                />
                {loggedIn.sellerMode ? <>
                    <Divider style={{ height: 30, backgroundColor: "white" }} />
                    <ListItem
                        title={"Selling"}
                        titleStyle={{ fontSize: 16, fontWeight: "bold" }}

                    />
                    <Divider style={{ height: 10, backgroundColor: "white" }} />
                    <ListItem
                        topDivider
                        titleStyle={{ fontSize: 14 }}
                        title="Sales Orders"
                        onPress={() => navigation.navigate("SellingOrder")}
                    />
                    <ListItem
                        topDivider
                        titleStyle={{ fontSize: 14 }}
                        title="Earnings"
                        onPress={() => navigation.navigate("Earnings")}
                    />
                    <ListItem
                        titleStyle={{ fontSize: 14 }}
                        topDivider
                        title="Services"
                        onPress={() => navigation.navigate("Services")}
                    />
                </> : null}
                <Divider style={{ height: 30, backgroundColor: "white" }} />
                <ListItem
                    title={"Buying"}
                    titleStyle={{ fontSize: 16, fontWeight: "bold" }}

                />
                <Divider style={{ height: 10, backgroundColor: "white" }} />
                <ListItem
                    topDivider
                    titleStyle={{ fontSize: 14 }}

                    title="Measurements"
                    onPress={() => navigation.navigate("MeasurementsList")}
                />
                <ListItem
                    topDivider
                    titleStyle={{ fontSize: 14 }}

                    title="Orders"
                    onPress={() => navigation.navigate("BuyingOrders")}
                />

                <Divider style={{ height: 30, backgroundColor: "white" }} />
                <ListItem
                    title={"Help Center"}
                    titleStyle={{ fontSize: 16, fontWeight: "bold" }}

                />
                <Divider style={{ height: 10, backgroundColor: "white" }} />
                <ListItem
                    titleStyle={{ fontSize: 14 }}
                    topDivider
                    title="Help"
                    onPress={() => navigation.navigate("HelpCenter")}
                />
                <ListItem
                    titleStyle={{ fontSize: 14 }}
                    topDivider
                    title="F.A.Q"
                    onPress={() => navigation.navigate("FAQ")}
                />


                <Button
                    type={"outline"}
                    title={"Logout"}
                    buttonStyle={{ borderColor: "#ef3caf", borderRadius: 20 }}
                    titleStyle={{ color: "#ef3caf" }}
                    onPress={() => {
                        deleteUserData().then(() => {
                            setLoggedin(undefined)
                            Firebase.signOut().then(() => console.log("Logged out"))
                        })
                    }}
                    style={{ marginTop: 20, marginHorizontal: 20 }}
                />


            </ScrollView>
        </KeyboardAvoidingView>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    contentContainer: {
        paddingVertical: 30,
    },
});
