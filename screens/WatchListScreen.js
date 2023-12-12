import React, {useState} from "react";
import {useFocusEffect} from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BottomSheet, Button } from '@rneui/themed';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {call} from "../api/APIClient";
import { View,Text,FlatList,StyleSheet,TouchableHighlight} from "react-native";

function WatchListScreen({navigation}) {
    const [watchlist, setWatchlist] = useState([]);
    const [isVisible, setIsVisible] = useState(false);
    const [selectedStock, setSelectedStock] = useState(null);

    useFocusEffect(
        React.useCallback(() => {
            const fetchWatchlist = async () => {
                try {
                    const storedWatchlist = JSON.parse(await AsyncStorage.getItem("watchlist")) || [];
                    const listWithDetails = await loadDetails(storedWatchlist)
                    setWatchlist(listWithDetails);
                } catch(error) {
                    console.error("Failed to fetch watchlist", error);
                }
            };
            fetchWatchlist();
        }, [])
    );

    return (
        <SafeAreaProvider>
            <View style={styles.container}>
                {watchlist.length > 0 ? (
                    <FlatList
                        data={watchlist}
                        keyExtractor={(item) => item.symbol}
                        renderItem={({item}) => (
                            <TouchableHighlight
                                onPress={() => {
                                        setSelectedStock(item)
                                        setIsVisible(true)
                                    }
                            }
                            >
                                <View style={styles.item}>
                                    <Text style={styles.symbolText}>
                                        {item.symbol}
                                    </Text>
                                    <Text style={styles.symbolText}>
                                        {item.close}
                                    </Text>
                                    <Text style={styles.symbolText}>
                                        {item.open}
                                    </Text>
                                </View>
                            </TouchableHighlight>
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
            <BottomSheet modalProps={{}} isVisible={isVisible} >
                <Text style={styles.bottomSheetItem}>       
                    {selectedStock != null ? (
                        selectedStock.symbol
                    ) : ( "" )
                    }
                </Text>
                <Text style={styles.bottomSheetItem}>       
                    {selectedStock != null ? (
                        selectedStock.symbol
                    ) : ( "" )
                    }
                </Text>
                <div style={styles.bottomButton}>
                    <Button
                        title="Close"
                        onPress={() => {
                            setIsVisible(false)
                            setSelectedStock(null)
                        }}
                    />
                </div>
            </BottomSheet>
        </SafeAreaProvider>
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
    message: {
        fontSize: 18,
        color: "#F0FFFF",
        textAlign: "center",
        marginTop: 20,
    },
    bottomSheetItem: {
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 10,
        paddingVertical: 10,
        flex: 1
    },
    bottomButton: {
        marginVertical: 10,
        marginHorizontal: 10,
        flex: 0
    },
});


async function loadDetails(watchList){
    return await Promise.all(
        watchList.map(async (stock) => {
            const response = await call(`history?symbol=` + stock.symbol);
            return await response.data[0];
        })
      );
}
