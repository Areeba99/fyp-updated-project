import React, {useContext, useEffect, useState} from 'react';
import {KeyboardAvoidingView, ScrollView, StyleSheet, View, Platform, TextInput,} from 'react-native';
import {Avatar, Button, Input, ListItem, Text, Divider} from "react-native-elements";
import UserContext from "../../connection/userContext";
import {Firebase} from "../../connection/comms";
import {MeasurementsHandler} from "../../connection/MeasurementsHandler";
import {Ionicons} from "@expo/vector-icons";
import {SimpleLineIcons} from '@expo/vector-icons';
import * as ImagePicker from "expo-image-picker";
import {saveData} from "../../connection/AsyncStorage";


export default function Measurements({navigation, route}) {
    const [measurementsState, setMeasurementsState] = useState({})
    const [measurements_name, setmeasurements_name] = useState("")

    useEffect(() => {
        (async () => {
            if (Platform.OS !== 'web') {
                const {status} = await ImagePicker.requestCameraRollPermissionsAsync();
                if (status !== 'granted') {
                    alert('Sorry, we need camera roll permissions to make this work!');
                }
            }
        })();
    }, []);

    useEffect(() => {
        if (route.params.data) {
            setMeasurementsState(route.params.data.m)
            setmeasurements_name((route.params.data.n))
        }
    }, [])

    let measurementsList = {
        arms: "Arms Length",
        shoulder: "Shoulders",
        chest: "Chest",
        stomach: "Stomach",
        waist: "Waist",
        armHole: "Arms Hole",
        shirtLength: "Shirt Length",
        collar: "Collar Size",
        pantsLength: "Pants Length",
        pantsWaist: "Pants Waist",
        crotch: "Crotch",
        cuffs: "Cuffs Size"
    }
    return (
        <UserContext.Consumer>
            {({loggedIn, setLoggedin}) => (
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "padding"}
                                      style={styles.container} keyboardVerticalOffset={100}>
                    <TextInput style={{
                        fontSize: 25,
                        fontWeight: "bold",
                        paddingHorizontal: 20,
                        marginVertical: 10
                    }} placeholder={"Enter Measurements Name"} defaultValue={measurements_name}
                               onChangeText={t => setmeasurements_name(t)}/>
                    <Text style={{fontSize: 14, fontWeight: "normal", paddingHorizontal: 20}}>Add your measurements
                        precisely. These will be shared with the tailors you hire. All measurements are recorded in
                        inches.</Text>

                    <View style={{paddingHorizontal: 20, paddingVertical: 20}}>
                        <Button title={"Magic Measurements"} type={"outline"}
                                buttonStyle={{borderColor: "pink"}}
                                containerStyle={{width: 220}}
                                titleStyle={{color: "pink"}}
                                icon={<SimpleLineIcons name="magic-wand" size={20} color="pink" style={{paddingHorizontal: 10}}/>}
                                onPress={()=>navigation.navigate("MagicMeasurement")}
                        />
                    </View>

                    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
                        {Object.keys(measurementsList).map(key => {
                            return (<ListItem
                                key={key}
                                topDivider
                                title={measurementsList[key]}
                                input={{
                                    placeholder: '00.0',
                                    defaultValue: measurementsState[key],
                                    value: measurementsState[key],
                                    onChangeText: text => {
                                        setMeasurementsState(previousState => ({
                                            ...previousState,
                                            [key]: text.replace(/[^0-9\.]/g, '')
                                        }));
                                    }
                                }}
                            />)
                        })}


                        <Button
                            type={"outline"}
                            title={"Update Measurements"}
                            buttonStyle={{borderColor: "#ef3caf", borderRadius: 20}}
                            titleStyle={{color: "#ef3caf"}}
                            onPress={() => {
                                if (Object.keys(measurementsState).length < Object.keys(measurementsList).length) {
                                    alert("Please fill in all information.")
                                } else {
                                    setLoggedin(previousState => ({...previousState, measurements: measurementsState}));
                                    MeasurementsHandler.addNew({
                                        n: measurements_name,
                                        m: measurementsState
                                    }, loggedIn.uid).then(r => {
                                        if (r) {
                                            navigation.goBack()
                                        }
                                    })
                                }

                            }}
                            style={{marginTop: 20, marginHorizontal: 20}}
                        />
                        {route.params.addNew ? null : <Button
                            type={"outline"}
                            title={"Delete"}
                            buttonStyle={{borderColor: "red", borderRadius: 20}}
                            titleStyle={{color: "red"}}
                            onPress={() => {
                                MeasurementsHandler.deleteMeasurement(route.params.data.id, loggedIn.uid).then(r => {
                                    navigation.goBack()
                                })

                            }}
                            style={{marginTop: 20, marginHorizontal: 20}}
                        />}


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
