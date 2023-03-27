import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Button } from '@rneui/base';
import { FlatGrid } from 'react-native-super-grid';

function Home({ navigation }) {
    const [items, setItems] = React.useState([
        { title: 'Counter', navigateTo: 'Counter' },
        { title: 'Camera', navigateTo: 'Camera' },
        { title: 'Bluetooth', navigateTo: 'blePlxBluetooth' },
        { title: 'FileSystem', navigateTo: 'FileSystemHandle' },
        { title: 'WebSocket', navigateTo: 'webSocketConnection' },
        { title: 'Http', navigateTo: 'httpConnection' }
    ]);

    return (
        <View style={styles.gridView}>
            <Text style={{ textAlign: "center" }}>Home</Text>
            <FlatGrid
                itemDimension={130}
                data={items}
                style={styles.gridView}
                // staticDimension={300}
                // fixed
                spacing={10}
                renderItem={({ item }) => (
                    <TouchableOpacity style={[styles.itemContainer]} onPress={() => navigation.navigate(item.navigateTo)} >
                        <Text style={styles.itemTitle}>{item.title}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    gridView: {
        marginTop: 10,
        flex: 1,
    },
    itemContainer: {
        justifyContent: 'center',
        alignItems: "center",
        borderRadius: 5,
        padding: 10,
        height: 150,
        backgroundColor: "#f08c36"
    },
    itemName: {
        fontSize: 16,
        color: '#fff',
        fontWeight: '600',
    },
    itemTitle: {
        fontWeight: '600',
        fontSize: 18,
        color: '#fff',
    },
});

export default Home;