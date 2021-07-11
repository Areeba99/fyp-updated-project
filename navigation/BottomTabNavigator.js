import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

import * as React from 'react';

import TabBarIcon from '../components/TabBarIcon';
import ProfileStack from "./ProfileStack";
import HomeStack from "./HomeStack";
import ChatStack from "./ChatStack";
import NotifStack from "./NotifStack";
const BottomTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = 'Home';

export default function BottomTabNavigator({ navigation, route }) {
    // navigation.setOptions({headerTitle: getHeaderTitle(route)});

    return (
        <BottomTab.Navigator initialRouteName={INITIAL_ROUTE_NAME}>
            <BottomTab.Screen
                name="Home"
                component={HomeStack}
                options={{
                    title: 'Home',
                    tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-home" />,
                }}
            />

            <BottomTab.Screen
                name="MessagesList"
                component={ChatStack}
                options={{
                    title: 'Messages',
                    tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-mail" />
                }}
            />

            <BottomTab.Screen
                name="Notifications"
                component={NotifStack}
                options={{
                    title: 'Notifications',
                    tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-notifications" />
                }}
            />

            <BottomTab.Screen
                name="Profile"
                component={ProfileStack}
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-settings" />,
                }}
            />
        </BottomTab.Navigator>
    );
}

function getHeaderTitle(route) {
    // const routeName = route.state?.routes[route.state.index]?.name ?? INITIAL_ROUTE_NAME;
    const routeName = getFocusedRouteNameFromRoute(route) ?? INITIAL_ROUTE_NAME;
    switch (routeName) {
        case 'Home':
            return 'Seam & Stitch';
        case 'Profile':
            return 'Profile';
        case 'Search':
            return 'Search Trains';
        case "Messages":
            return 'Chats';
        case 'Measurements':
            return 'Measurements';
    }
}
