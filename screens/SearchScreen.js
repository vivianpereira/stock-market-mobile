import React, {useState, useEffect} from "react";
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TextInput,
    TouchableHighlight
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {call} from "../api/APIClient";

function SearchScreen() {
    const [stocks, setStocks] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetchStocks = async () => {
            try {
                const response = await call("all");
                const data = response.data;
                const companies = data.map((company) => {
                    return {
                        symbol: company.symbol,
                        name: company.name,
                    };
                });
                setStocks(companies);
            } catch(error) {
                console.error("Failed to fetch stock list.", error);
            }
        };
        fetchStocks();
    }, []);

    const filteredStocks = stocks
        .filter(stock => {
            return (
                stock.symbol.toLowerCase().includes(search.toLowerCase()) ||
                stock.name.toLowerCase().includes(search.toLowerCase())
            );
        })
        .sort((a, b) => {
            const aNameMatches = a.name.toLowerCase().includes(search.toLowerCase());
            const bNameMatches = b.name.toLowerCase().includes(search.toLowerCase());

            if(aNameMatches && !bNameMatches) {
                return -1;
            } else if(!aNameMatches && bNameMatches) {
                return 1;
            } else {
                return 0;
            }
        });

    const addStockToWatchList = async (stock) => {
        try {
            const watchlist =
                JSON.parse(await AsyncStorage.getItem("watchlist")) || [];
            if(!watchlist.some((item) => item.symbol === stock.symbol)) {
                watchlist.push(stock);
                await AsyncStorage.setItem("watchlist", JSON.stringify(watchlist));
                toast(`${stock.symbol} is added to your watchlist`);
                console.log("Stock already in watchlist:", stock);
            } else {
                toast(`${stock.symbol} is already in your watchlist`);
            }
        } catch(error) {
            console.error("Failed to add stock to watchlist", error);
            toast("Error encountered, try again");
        }
    };


    return (
        <View style={styles.container}>
            <Text style={styles.container}>
                Type a company name or stock symbol:
            </Text>
            <TextInput
                style={styles.input}
                onChangeText={setSearch}
                value={search}
            />
            {stocks.length > 0 ? (
                <FlatList
                    data={filteredStocks}
                    keyExtractor={(item) => item["symbol"]}
                    renderItem={({item}) => (
                        <TouchableHighlight
                            activeOpacity={0.6}
                            onPress={() => addStockToWatchList(item)}
                        >
                            <View style={styles.item}>
                                <Text style={styles.symbolText}>{item.symbol}</Text>
                                <Text style={styles.nameText}>{item.name}</Text>
                            </View>
                        </TouchableHighlight>
                    )}
                />
            ) : (
                <View>
                    <Text style={styles.message}>
                        Fetching stocks...
                    </Text>
                </View>
            )}
            <div>
                <ToastContainer position="top-center" autoClose={3000} hideProgressBar={true}/>
            </div>
        </View>
    );
}

export default SearchScreen;

const styles = StyleSheet.create({
    container: {
        flex: "initial",
        backgroundColor: "#202020",
        color: "#F0FFFF",
        fontSize: 16,
        textAlign: "center",
        marginTop: 2,
        padding: 20,
        borderBottomColor: "#808080",
        borderBottomWidth: 1,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 2,
        padding: 10,
        marginBottom: 10,
        width: "100%",
        color: "#fff",
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
        fontSize: 12,
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
});
