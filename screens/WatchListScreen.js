import React, {useState} from "react";
import {useFocusEffect} from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {Swipeable} from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/Ionicons";

import {
    View,
    Text,
    FlatList,
    StyleSheet,
    Button,
    Alert,
    TouchableHighlight,
} from "react-native";

function WatchListScreen({navigation}) {
    const [watchlist, setWatchlist] = useState([]);

    useFocusEffect(
        React.useCallback(() => {
            const fetchWatchlist = async () => {
                try {
                    const storedWatchlist =
                        JSON.parse(await AsyncStorage.getItem("watchlist")) || [];
                    setWatchlist(storedWatchlist);
                    const hasShownAlert = await AsyncStorage.getItem("hasShownAlert");
                    if(!hasShownAlert) {
                        Alert.alert(
                            "Tip",
                            "Swipe a stock to the right to remove it from your watchlist."
                        );
                        await AsyncStorage.setItem("hasShownAlert", "true");
                    }
                } catch(error) {
                    console.error("Failed to fetch watchlist", error);
                }
            };
            fetchWatchlist();
        }, [])
    );

    return (
        <View style={styles.container}>
            <View style={styles.container}>
                {watchlist.length > 0 ? (
                    <FlatList
                        data={watchlist}
                        keyExtractor={(item) => item.symbol}
                        renderItem={({item}) => (
                            <SwipeableRow
                                item={item}
                                navigator={navigation}
                            />
                        )}
                    />
                ) : (
                    <View>
                        <Text style={styles.message}>
                            No items in your watchlist.
                        </Text>
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Button
                                title="Add Stocks"
                                onPress={() => navigation.navigate("Search")}
                                style={{flex: 0, paddingHorizontal: 8}}
                            />
                        </View>
                    </View>
                )}
            </View>
        </View>
    );
}

function SwipeableRow({item, onDelete, navigator}) {
    const renderRightActions = () => {
        return (
            <TouchableHighlight onPress={() => onDelete(item)}>
                <View style={styles.deleteBox}>
                    <Icon name="trash-outline" size={20} color="#FFF" />
                </View>
            </TouchableHighlight>
        );
    };

    return (
        <Swipeable renderRightActions={renderRightActions}>
            <TouchableHighlight
                onPress={() =>
                    navigator.navigate("StockDetails", {symbol: item.symbol})
                }
            >
                <View style={styles.item}>
                    <Text style={styles.symbolText}>
                        {item.symbol}
                    </Text>
                </View>
            </TouchableHighlight>
        </Swipeable>
    );
}

export default WatchListScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#202020",
        color: "#F0FFFF",
        fontSize: 16,
        textAlign: "center",
        marginTop: 2,
        padding: 20,
        borderBottomColor: "#808080",
        borderBottomWidth: 1,
    },
    WatchListScreenContainer: {
        flex: 1,
        margin: 20,
    },
    header: {
        marginTop: 50,
        fontSize: 24,
        fontWeight: "bold",
        alignSelf: "flex-start",
    },
    button: {
        backgroundColor: "blue",
        padding: 10,
        borderRadius: 2,
        backgroundColor: "#508bd4",
        marginTop: 10,
        alignItems: "center",
    },
    textButton: {
        padding: 10,
        borderRadius: 2,
        marginTop: 10,
        alignItems: "center",
    },
    buttonText: {
        fontWeight: "bold",
    },
    error: {
        color: "red",
        fontSize: 12,
        marginVertical: 5,
        alignSelf: "flex-start",
    },
    item: {
        flex: 1,
        flexDirection: "column",
        paddingHorizontal: 10,
        paddingVertical: 10,
    },
    symbolText: {
        color: "#87CEEB",
        fontWeight: "bold",
        fontSize: 16,
    },
    nameText: {
        flex: 6,
        flexDirection: "row",
        color: "#F0FFFF",
        fontSize: 16,
    },
    message: {
        fontSize: 18,
        color: "#F0FFFF",
        textAlign: "center",
        marginTop: 20,
    },
    deleteBox: {
        backgroundColor: "red",
        justifyContent: "center",
        alignItems: "center",
        width: 100,
    },
    deleteText: {
        color: "#FFF",
    },
});
