import React, {useEffect, useRef, useState} from "react";
import {Platform, StatusBar, StyleSheet, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import BottomTabNavigator from './navigation/BottomTabNavigator';
import UserContext from "./connection/userContext";
import AuthNavigation from "./navigation/AuthNavigation";
import {getData, saveData} from "./connection/AsyncStorage";
import {LogBox} from 'react-native';
import firebase from "firebase";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";

Notifications.setNotificationHandler({
    handleNotification: async () => {
        return {
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: true,
        };
    },
});
let askPermissions = async () => {
    const {status: existingStatus} = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
        const {status} = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        finalStatus = status;
    }
    return finalStatus === "granted";

};


const App = () => {
    LogBox.ignoreAllLogs();
    const [loggedIn, setLoggedin] = useState(undefined);
    const value = {loggedIn, setLoggedin};

    useEffect(() => {
        askPermissions().then(r => console.log("Notification Permission => ", r))
        if (!loggedIn) {
            getData().then(r => {
                setLoggedin(r)
            })
        } else {

        }
    })

    saveData(loggedIn).then(() => {
        console.log("saved App.js context data")
    })

    if (loggedIn) {
        return (
            <UserContext.Provider value={value}>
                <View style={styles.container}>
                    {Platform.OS === 'ios' && <StatusBar barStyle="default"/>}
                    <NavigationContainer>
                        <BottomTabNavigator/>
                    </NavigationContainer>
                </View>
            </UserContext.Provider>
        );
    } else {
        return (
            <UserContext.Provider value={value}>
                <UserContext.Consumer>
                    {({loggedIn, setLoggedin}) => (
                        <View style={styles.container}>
                            {Platform.OS === 'ios' && <StatusBar barStyle="default"/>}
                            <NavigationContainer>
                                <AuthNavigation/>
                            </NavigationContainer>
                        </View>
                    )}
                </UserContext.Consumer>
            </UserContext.Provider>

        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});

export default App;