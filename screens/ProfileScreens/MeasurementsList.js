import React, {useContext, useEffect, useState} from 'react';
import {KeyboardAvoidingView, ScrollView, StyleSheet, View, Platform, TextInput, RefreshControl,} from 'react-native';
import {Avatar, Button, Icon, Input, ListItem, Text} from "react-native-elements";
import UserContext from "../../connection/userContext";
import {MeasurementsHandler} from "../../connection/MeasurementsHandler";
import {Ionicons} from "@expo/vector-icons";


export default function MeasurementsList({navigation, route}) {
    const {loggedIn} = useContext(UserContext)
    const [list, setList] = useState(null)
    const [Loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false);

    navigation.setOptions({
        headerRight: () => (
            <Button type={"clear"}
                    icon={<Icon name={"md-add"} type={"ionicon"} size={25} containerStyle={{paddingRight: 10}}/>}
                    onPress={() => navigation.navigate("Measurements", {addNew: true})}
            />
        ),
    });

    const loadDataInView = () => {
        MeasurementsHandler.getAll(loggedIn.uid).then(r => {
            setList(r)
            setRefreshing(false)
            setLoading(false)
        })
    }

    useEffect(() => {
        if (route.params?.reload) {
            loadDataInView()
        }
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
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "padding"}
                                      style={styles.container} keyboardVerticalOffset={100}>
                    <Text style={{fontSize: 14, fontWeight: "normal", padding: 20}}>Add your measurements
                        precisely. These will be shared with the tailors you hire.</Text>
                    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}
                                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}>
                        {list && list.map(l => {
                            return (<ListItem title={l.n} key={l.id} bottomDivider={true} chevron={true}
                                              leftIcon={<Ionicons name={"md-book"} size={18} color={"grey"}/>}
                                              onPress={() => {
                                                  navigation.navigate("Measurements", {addNew: false, data: l})
                                              }}
                            />)
                        })}
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