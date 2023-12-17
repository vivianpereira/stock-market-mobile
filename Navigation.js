import React from "react";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {NavigationContainer, DarkTheme} from "@react-navigation/native";
import SearchScreen from "./screens/SearchScreen";
import WatchListScreen from "./screens/WatchListScreen";
import TabBarIcon from "./components/TabBarIcon";

const Tab = createBottomTabNavigator();

const Navigation = () => {
    return (
        <NavigationContainer theme={DarkTheme}>
            <Tab.Navigator>
                <Tab.Screen name="Stocks" component={WatchListScreen} options={{
                    title: "Stocks",
                    tabBarIcon: ({focused}) => <TabBarIcon focused={focused} name="md-trending-up" />,
                }} />
                <Tab.Screen name="Search" component={SearchScreen} options={{
                    title: "Search",
                    tabBarIcon: ({focused}) => <TabBarIcon focused={focused} name="md-search" />,
                }} />
            </Tab.Navigator>
        </NavigationContainer>
    );
};

export default Navigation;
