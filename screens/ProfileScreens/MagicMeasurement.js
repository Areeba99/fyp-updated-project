import React, {useEffect, useState} from 'react';
import {Button, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator} from "react-native";
import {Image, Overlay} from "react-native-elements";
import * as ImagePicker from "expo-image-picker";
import firebase from "firebase";
import {Linking} from "react-native";

import frontPose from "../../assets/images/placeholder.png"


function MagicMeasurement() {

    const [front, setFront] = useState(null)
    const [side, setSide] = useState(null)
    const [diff, setDiff] = useState(null)
    const [uploading, setUploading] = useState(false)
    const [measuring, setMeasuring] = useState(false)

    const pickImage = async () => {

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });

        if (!result.cancelled) {
            const response = await fetch(result.uri);
            const blob = await response.blob();

            const ref = firebase.storage().ref('/temp/measure');
            const task = ref.put(blob);
            setUploading(true)
            console.log("Running Upload Task.")
            return task.snapshot.ref.getDownloadURL().then((downloadURL) => {
                setUploading(false)
                return downloadURL;
            });
        }
        else{
            setUploading(false)
            return null
        }
    };


    return (
        <View style={styles.container}>
            <Text style={styles.instructions}>For Magic Measurements please follow the following instructions: {"\n"} {"\n"}
            1- Your background should be plain and light in color. {"\n"}
            2- Wear dark cloths preferably black. {"\n"}
            3- For image 1 - stretch your arms and make a T shape as shown in thumbnail {"\n"}
            4- For image 2- upload a full body side pose image as shown in thumbnail {"\n"}
            5- For image 3- hold a checkered board in front of you from the edges {"\n"} {"\n"}
                If you do not have a checkered board download and print it from {" "}
                <Text style={{color: 'blue'}}
                      onPress={() => Linking.openURL('http://google.com')}>
                     here
                </Text>
            </Text>

            <Text style={styles.uploadTxt}>Upload Your Images {uploading && <Text style={{fontSize:12,color:"grey",letterSpacing:2,}}> Uploading...</Text>}</Text>

            <View style={styles.images}>
                <TouchableOpacity onPress={() => {
                    pickImage().then(r => {
                        if(r !== undefined){
                            setFront(r)
                        }else{
                            console.log("Upload cancelled")
                        }
                    })
                }}>
                    <View style={styles.picker}>
                        <Image
                            containerStyle={{ borderRadius: 6, borderWidth: 1}}
                            transition
                            transitionDuration={1000}
                            source={front !== null ? {uri: front} : frontPose}
                            PlaceholderContent={<Text>loading..</Text>}
                            placeholderStyle={{borderRadius: 6}}
                            style={{height: 94, width: 94, borderRadius: 8,}}
                        />
                    </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => {
                    pickImage().then(r => {
                        if(r !== undefined){
                            setSide(r)
                        }else{
                            console.log("Upload cancelled")
                        }
                    })
                }}>
                    <View style={styles.picker}>
                        <Image
                            containerStyle={{borderRadius: 6}}
                            source={side !== null ? {uri: side} : frontPose}
                            PlaceholderContent={<Text>loading..</Text>}
                            style={{height: 94, width: 94, borderRadius: 6}}
                        />
                    </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => {
                    pickImage().then(r => {
                        if(r !== undefined){
                            setDiff(r)
                        }else{
                            console.log("Upload cancelled")
                        }
                    })
                }}>
                    <View style={styles.picker}>
                        <Image
                            containerStyle={{borderRadius: 6}}
                            source={diff !== null ? {uri: diff} : frontPose}
                            PlaceholderContent={<Text>loading..</Text>}
                            style={{height: 94, width: 94, borderRadius: 6}}
                        />
                    </View>
                </TouchableOpacity>


            </View>
            <View style={styles.measureButton}>
                <Button title={"Run Auto Measurements"} color={"white"} onPress={() => {

                    if (front !== null && side !== null && diff !== null){
                        setMeasuring(true)
                        console.log({
                            front,side,diff
                        })

                    }else{
                        alert("Please upload all images.")
                    }
                }}/>
            </View>
            <Overlay isVisible={measuring} overlayBackgroundColor={"transparent"} overlayStyle={{height:300, width: "90%", display: "flex", justifyContent: "center", alignItems: "center"}}>
                <View style={{backgroundColor: "white", width: 200, height:200, borderRadius: 8, display: "flex", justifyContent: "center", alignItems: "center"}}>
                    <View >
                        <ActivityIndicator size={"large"} style={{marginBottom: 20}}/>
                        <Text style={{textAlign: "center"}}>Processing your {'\n'} measurements. {'\n \n'} Please wait a few moments.</Text>
                    </View>

                </View>
            </Overlay>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },

    heading: {
        fontSize: 18,
        fontWeight: "200",
    },
    uploadTxt: {
        fontWeight: "bold",
        color: "grey",
        fontSize: 18,
        marginTop: 50,
        marginBottom: 30,

    },
    images: {
        marginBottom: 50,
        flexDirection: "row",
        justifyContent: "space-between"
    },
    picker: {
        height: 100,
        width: 100,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: "#cacaca",
        borderStyle: "dashed",
        padding: 1,
    },
    measureButton: {
        padding: 6,
        borderRadius: 6,
        marginTop: 20,
        backgroundColor: "pink",
    },
    instructions:{
        fontSize: 15,
        color: "grey"
    }

});


export default MagicMeasurement;

