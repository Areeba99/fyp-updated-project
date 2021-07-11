import * as React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import NotificationScreen from "../screens/NotificationScreen";

const Stack = createStackNavigator()

export default function NotifStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="NotificationScreen" component={NotificationScreen} options={{title: "Notifications"}}/>
        </Stack.Navigator>
    )

}
