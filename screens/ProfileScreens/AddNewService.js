import React, {useContext, useEffect, useState} from 'react';
import {KeyboardAvoidingView, ScrollView, StyleSheet, View, Platform, TextInput,} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {Avatar, Button, Input, ListItem, Text, Divider} from "react-native-elements";
import UserContext from "../../connection/userContext";
import {Firebase} from "../../connection/comms";
import {Picker} from '@react-native-picker/picker';


export default function AddNewService({navigation, route}) {
    const {loggedIn} = useContext(UserContext)
    const [service, setService] = useState({})
    const [covers, setCovers] = useState(new Array(5).fill(""))
    const [isEditing, setEditing] = useState(false)

    useEffect(() => {
        //Image Permissions
        (async () => {
            if (Platform.OS !== 'web') {
                const {status} = await ImagePicker.requestCameraRollPermissionsAsync();
                if (status !== 'granted') {
                    alert('Sorry, we need camera roll permissions to make this work!');
                }
            }
        })();
        if (route.params && route.params.service) {
            setEditing(true)
            setService(route.params.service)
            setCovers(route.params.service.cover)
            route.name = route.params.title
        }
    }, [])


    const pickImage = async (index) => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });
        if (!result.cancelled) {
            Firebase.serviceIMG(result.uri)
                .then(link => {
                    console.log("link, >>", link)
                    covers[index] = link
                    setCovers(covers);
                    setService(previousState => ({...previousState, cover: covers}));
                })

        }
    };

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
                    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
                        <View style={{
                            marginBottom: 20,
                            display: "flex",
                            justifyContent: "center",
                            flexDirection: "row",
                            flexWrap: "wrap"
                        }}>

                            {covers.map((cover, key) => (
                                <Avatar source={{uri: covers[key]}} size={"medium"}
                                        containerStyle={{marginHorizontal: 10,}}
                                        title={key + 1} showEditButton={true}
                                        onEditPress={() => pickImage(key)}/>
                            ))}

                        </View>
                        <Picker
                            selectedValue={service.category}
                            onValueChange={(itemValue, itemIndex) => {
                                setService(previousState => ({...previousState, category: itemValue}))
                            }
                            }>
                            <Picker.Item label="Select Category" value="none"/>
                            <Picker.Item label="Embroidery" value="Embroidery"/>
                            <Picker.Item label="Stitching" value="Stitching"/>
                            <Picker.Item label="Alteration" value="Alteration"/>
                            <Picker.Item label="Designing" value="Designing"/>
                            <Picker.Item label="Cut Work" value="CutWork"/>
                        </Picker>
                        <ListItem
                            topDivider
                            title="I will..."
                            input={{
                                placeholder: 'do the task',
                                defaultValue: service.title,
                                onChangeText: (text) => {
                                    setService(previousState => ({...previousState, title: text}));
                                }
                            }}
                        />

                        <ListItem
                            topDivider
                            title="Starting at only, Rs: "
                            input={{
                                placeholder: 'Rs: 5000',
                                defaultValue: service.price,
                                onChangeText: (text) => {
                                    setService(previousState => ({...previousState, price: text}));
                                }
                            }}
                        />
                        <ListItem
                            topDivider
                            title="and in only..."
                            input={{
                                placeholder: '3 days',
                                defaultValue: service.time,
                                onChangeText: (text) => {
                                    setService(previousState => ({...previousState, time: text}));
                                }
                            }}
                        />
                        <ListItem
                            topDivider
                            title="Here are the details"
                            input={{
                                multiline: true,
                                placeholder: 'My service in detail...',
                                defaultValue: service.details,
                                style: {height: "100%"},
                                containerStyle: {height: 100},
                                onChangeText: (text) => {
                                    setService(previousState => ({...previousState, details: text}));
                                }
                            }}
                        />

                        {isEditing ? <Button
                                type={"outline"}
                                title={"Update Service"}
                                buttonStyle={{borderColor: "#ef3caf", borderRadius: 20}}
                                titleStyle={{color: "#ef3caf"}}
                                onPress={function () {
                                    if (!service.title || service.title.length < 10) {
                                        alert("Please add appropriate title.")
                                    } else if (!service.price || service.price.length < 2) {
                                        alert("Please add appropriate price. Minimum price is 99 Rupees.")
                                    } else if (!service.details || service.details.length < 30) {
                                        alert("Please explain your service in details. Min. 30 chars.")
                                    } else if (covers[0] !== "") {
                                        Firebase.updateService(service).then(r => {
                                            alert("Updated Service")
                                            navigation.navigate("Services", {reload: true})
                                        })
                                    } else {
                                        alert("Please add at least first image for service.")
                                    }

                                }}
                                style={{marginTop: 20, marginHorizontal: 20}}
                            /> :
                            <Button
                                type={"outline"}
                                title={"Add Service"}
                                buttonStyle={{borderColor: "#ef3caf", borderRadius: 20}}
                                titleStyle={{color: "#ef3caf"}}
                                onPress={function () {
                                    if (!service.title || service.title.length < 10) {
                                        alert("Please add appropriate title.")
                                    } else if (!service.price || service.price.length < 2) {
                                        alert("Please add appropriate price. Minimum price is 99 Rupees.")
                                    } else if (!service.details || service.details.length < 30) {
                                        alert("Please explain your service in details. Min. 30 chars.")
                                    } else if (covers[0] !== "") {
                                        Firebase.addNewService(service, loggedIn.uid).then(r => {
                                            if (r) {
                                                navigation.navigate("Services", {reload: true})
                                            }
                                        })
                                    } else {
                                        alert("Please add at least first image for service.")
                                    }

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
