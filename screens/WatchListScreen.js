import React, {useState} from "react";
import {useFocusEffect} from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {BottomSheet, Button} from "@rneui/themed";
import {SafeAreaProvider} from "react-native-safe-area-context";
import {call} from "../api/APIClient";
import {View, Text, FlatList, StyleSheet, TouchableHighlight} from "react-native";

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
                        ItemSeparatorComponent={() => (
                            <View style={{backgroundColor: "white", height: 1}} />
                        )}
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
                                    <Text style={styles.amountText}>
                                        {item.close}
                                    </Text>
                                    <DiffView item={item} />
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
                                style={{
                                    flex: 0,
                                    paddingHorizontal: 8,
                                    marginTop: 22,
                                }}
                            />
                        </View>
                    </View>
                )}
            </View>
            <BottomSheet modalProps={{}} isVisible={isVisible} >
                <Text style={styles.bottomSheetHeader}>
                    {selectedStock != null ? (
                        selectedStock.name
                    ) : ("")
                    }
                </Text>
                <View style={styles.bottomSheetItem}>
                    <Text style={styles.bottomSheetItemTitle}>
                        OPEN
                    </Text>
                    <Text style={styles.bottomSheetItemText}>
                        {selectedStock != null ? (
                            selectedStock.open
                        ) : ("")
                        }
                    </Text>
                    <Text style={styles.bottomSheetItemTitle}>
                        &nbsp;&nbsp;LOW
                    </Text>
                    <Text style={styles.bottomSheetItemText}>
                        {selectedStock != null ? (
                            selectedStock.low
                        ) : ("")
                        }
                    </Text>
                </View>
                <View
                    style={{
                        borderBottomColor: 'black',
                        borderBottomWidth: StyleSheet.hairlineWidth,
                    }}
                />
                <View style={styles.bottomSheetItem}>
                    <Text style={styles.bottomSheetItemTitle}>
                        CLOSE
                    </Text>
                    <Text style={styles.bottomSheetItemText}>
                        {selectedStock != null ? (
                            selectedStock.close
                        ) : ("")
                        }
                    </Text>
                    <Text style={styles.bottomSheetItemTitle}>
                        &nbsp;&nbsp;HIGH
                    </Text>
                    <Text style={styles.bottomSheetItemText}>
                        {selectedStock != null ? (
                            selectedStock.high
                        ) : ("")
                        }
                    </Text>
                </View>
                <View
                    style={{
                        borderBottomColor: 'black',
                        borderBottomWidth: StyleSheet.hairlineWidth,
                    }}
                />
                <View style={styles.bottomSheetItem}>
                    <Text style={styles.bottomSheetItemTitle}>
                        VOLUME
                    </Text>
                    <Text style={styles.bottomSheetItemText}>
                        {selectedStock != null ? (
                            selectedStock.volumes
                        ) : ("")
                        }
                    </Text>
                    <Text style={styles.bottomSheetItemTitle} />
                    <Text style={styles.bottomSheetItemText} />
                </View>
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

function DiffView({item}) {
    // improve it to add background
    if(item.open <= item.close) {
        return (
            <Text style={styles.diffPositiveText}>{item.diff}</Text>
        )
    } else {
        return (
            <Text style={styles.diffNegativeText}>{item.diff}</Text>
        )
    }
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
        flexDirection: "row",
        paddingHorizontal: 10,
        paddingVertical: 10,
    },
    symbolText: {
        color: "#ffffff",
        fontWeight: "bold",
        fontSize: 16,
        width: "60%",
    },
    amountText: {
        color: "#ffffff",
        fontSize: 16,
        textAlign: "right",
        width: "20%",
    },
    diffPositiveText: {
        color: "#008000",
        fontSize: 16,
        textAlign: "right",
        width: "20%",

    },
    diffNegativeText: {
        color: "#FF0000",
        fontSize: 16,
        textAlign: "right",
        width: "20%",

    },
    message: {
        fontSize: 18,
        color: "#F0FFFF",
        textAlign: "center",
        marginTop: 20,
    },
    bottomSheetHeader: {
        backgroundColor: "white",
        textAlign: "center",
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 10,
        flex: 1
    },
    bottomSheetItem: {
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 10,
        paddingVertical: 10,
        flex: 1
    },
    bottomSheetItem: {
        flex: 1,
        flexDirection: "row",
        paddingHorizontal: 10,
        paddingVertical: 10,
        backgroundColor: "white",
    },
    bottomSheetItemTitle: {
        color: "#A9A9A9",
        fontSize: 15,
        textAlign: "left",
        width: "20%",
    },
    bottomSheetItemText: {
        fontSize: 14,
        textAlign: "right",
        width: "30%",
    },
    bottomButton: {
        marginVertical: 10,
        marginHorizontal: 10,
        flex: 0
    },
});


async function loadDetails(watchList) {
    return await Promise.all(
        watchList.map(async (stock) => {
            const response = await call(`history?symbol=` + stock.symbol);
            let lastResult = response.data[0];
            lastResult["diff"] = calculateDiff(lastResult.open, lastResult.close);
            return lastResult;
        })
    );
}


function calculateDiff(close, open) {
    return (open < close ? "-" + (((close - open) * 100) / open).toFixed(2) : (((open - close) * 100) / close).toFixed(2)) + "%";
}