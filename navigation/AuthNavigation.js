import * as React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import ResetPassword from "../screens/auth/ResetPassword";
import LocationScreen from "../screens/LocationScreen";


const Stack = createStackNavigator()

export default function AuthNavigation() {
    return (
        <Stack.Navigator screenOptions={{
            headerShown: false

        }}>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Reset" component={ResetPassword} />
            <Stack.Screen name="Location" component={LocationScreen}/>
        </Stack.Navigator>
    )

}
