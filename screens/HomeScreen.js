import React, {useContext, useEffect, useState} from 'react';
import {RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import UserContext from "../connection/userContext";
import {Firebase} from "../connection/comms";
import ServicesList from "../components/ServicesList";

export default function HomeScreen({navigation, route}) {

    const [Loading, setLoading] = useState(true)
    const [data, setData] = useState(null)
    const [refreshing, setRefreshing] = useState(false);
    const {loggedIn, setLoggedin} = useContext(UserContext)

    const loadDataInView = () => {
        Firebase.getHomeScreenData(loggedIn.uid).then(r => {
            setData(r)
            setLoading(false)
            setRefreshing(false)
        })
    }

    useEffect(() => {
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
                <View style={styles.container}>
                    <TouchableOpacity onPress={()=>{
                        navigation.navigate("Search")
                    }}>
                        <View style={{height: 70, paddingHorizontal: 20, justifyContent: "center"}}>
                            <View style={{
                                backgroundColor: "#f6f6f6",
                                borderRadius: 20,
                                height: 40,
                                justifyContent: "center",
                                paddingHorizontal: 20,
                            }}>
                                <Text style={{color: "grey"}}>Search Services</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <ScrollView style={styles.container}
                                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}>
                        <Text style={{paddingLeft: 20, fontWeight: "bold", fontSize: 20, marginVertical: 20,}}>Recommended
                            Services</Text>
                        <ServicesList services={data} navigation={navigation}/>
                    </ScrollView>
                </View>
            )}
        </UserContext.Consumer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        padding: 20,
    },
    smallText: {
        fontSize: 15,
        fontStyle: "italic",
        fontWeight: "200",
        color: "grey"
    },
    title: {
        fontSize: 30,
        fontWeight: "bold"
    }
});
