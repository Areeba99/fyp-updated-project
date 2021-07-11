import React, {useState} from "react";
import {SafeAreaView, StyleSheet, ActivityIndicator} from 'react-native'
import UserContext from "../connection/userContext";
import {GooglePlacesAutocomplete} from "react-native-google-places-autocomplete";
import {Firebase} from "../connection/comms";
import {saveData} from "../connection/AsyncStorage";



export default function LocationScreen({navigation}) {
    const GOOGLE_PLACES_API_KEY = 'AIzaSyD5d-fefCNOQYqK3IljuyYygcTzWgWmsME';


    return (
        <UserContext.Consumer>
            {({loggedIn, setLoggedin}) => (
                <SafeAreaView style={styles.container}>
                    <GooglePlacesAutocomplete
                        query={{
                            key: GOOGLE_PLACES_API_KEY,
                            language: 'en',
                            components: 'country:pk',
                            // types: "(cities)"
                        }}
                        onPress={(data, details) => {
                            const c = details.description

                            if (loggedIn) {
                                setLoggedin(previousState => ({...previousState, city: c}));
                                navigation.navigate("Profile");
                                Firebase.updateData("city", c, loggedIn.uid).then(r => {
                                    if (r === true) {
                                        saveData(loggedIn).then(r => alert("Updated City."))
                                    }
                                })
                            } else {
                                navigation.navigate("Register", {geoLocation: c});
                            }


                        }

                        }
                        placeholder={"Search Your Location"}
                        enablePoweredByContainer={false}
                        returnKeyType={"search"}
                        styles={{
                            textInputContainer: {
                                marginTop: 20,
                                marginHorizontal: 10,
                                color: '#5d5d5d',
                                fontSize: 16,
                            },
                            textInput: {
                                backgroundColor: "#fafafa"
                            }
                        }}/>

                </SafeAreaView>
            )}
        </UserContext.Consumer>
    )

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    searchHeader: {}
});
