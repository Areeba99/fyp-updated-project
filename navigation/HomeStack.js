import * as React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import HomeScreen from "../screens/HomeScreen";
import ShowServiceDetails from "../screens/ProfileScreens/ShowServiceDetails";
import Search from "../screens/Search/SearchScreen";

const Stack = createStackNavigator()

export default function HomeStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Home" component={HomeScreen} options={{title: "Seam & Stitch"}}/>
            <Stack.Screen name="Details" component={ShowServiceDetails}/>

            <Stack.Screen name="Search" component={Search}/>
        </Stack.Navigator>
    )

}
