import React from "react";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {NavigationContainer, DarkTheme} from "@react-navigation/native";
import SearchScreen from "./screens/SearchScreen";
import WatchListScreen from "./screens/WatchListScreen";

const Tab = createBottomTabNavigator();

const Navigation = () => {
    return (
        <NavigationContainer theme={DarkTheme}>
            <Tab.Navigator>
                <Tab.Screen name="Stocks" component={WatchListScreen} />
                <Tab.Screen name="Search" component={SearchScreen} />
            </Tab.Navigator>
        </NavigationContainer>
    );
};

export default Navigation;
