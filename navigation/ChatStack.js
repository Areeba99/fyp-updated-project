import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MessagesList from "../screens/ChatScreens/MessageList";
import MessagesScreen from "../screens/ChatScreens/Messages";
import { View } from "react-native";
import { Button } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";

const Stack = createStackNavigator()

export default function ChatStack() {


    return (
        <Stack.Navigator>
            <Stack.Screen name="Chats" component={MessagesList} />
            <Stack.Screen name="Chat" component={MessagesScreen} options={({ route }) => ({
                title: route.params.title,
                headerRight: () => (
                    <View>
                        <Button icon={<Ionicons name={"ios-images"} size={28} color={"black"} />}
                            buttonStyle={{
                                backgroundColor: 'rgba(0, 0, 0, 0)',
                                flex: 1,
                                borderRadius: 50,

                            }}
                        //  onPress={()=>console.log("bokee")}
                        />
                    </View>
                )
            })}
            />
        </Stack.Navigator>
    )

}
