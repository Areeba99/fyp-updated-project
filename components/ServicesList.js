import React from "react";
import {TouchableOpacity, View} from 'react-native'
import {Image, Card, Icon, Button, Text} from "react-native-elements";


const ServicesList = ({services, navigation}) => {

    if (services && services.length > 0) {
        return (
            <View>
                {services.map((s, k) => {
                    return (
                        <TouchableOpacity onPress={() => navigation.navigate("Details", {service: s})} key={k}>
                            <View style={{
                                display: "flex",
                                justifyContent: "flex-start",
                                flexDirection: "row",
                                paddingHorizontal: 10,
                                paddingVertical: 10,
                                backgroundColor: "#fcfcfc",
                                marginBottom: 5,
                            }}>
                                <Image source={{uri: s.cover[0]}} style={{width: 100, height: 100}}
                                       containerStyle={{borderRadius: 10, overflow: "hidden"}}/>

                                <View style={{paddingLeft: 10, flex: 1, justifyContent: "space-evenly"}}>
                                    <View style={{flexDirection: 'row'}}>
                                        <Text style={{
                                            flexWrap: 'wrap',
                                            fontSize: 16,
                                            fontWeight: "bold"
                                        }}>{s.title}</Text>
                                    </View>
                                    <View style={{flexDirection: 'row'}}>
                                        <Text style={{flexWrap: 'wrap'}}>{s.details}</Text>
                                    </View>
                                    <View style={{flexDirection: 'row'}}>
                                        <Text style={{
                                            flexWrap: 'wrap',
                                            fontWeight: "bold",
                                            fontStyle: "italic",
                                            fontSize: 10
                                        }}>{"Starting From: Rs." + s.price}</Text>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )
                })}
            </View>
        )
    } else {
        return (<View style={{alignItems: "center", paddingVertical: 50}}><Text style={{color: "#ababab"}}>No records
            found.</Text></View>)
    }


};

export default ServicesList;
