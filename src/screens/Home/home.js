import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Button, Text } from '@rneui/base';
import { FlatGrid } from 'react-native-super-grid';

function Home({ navigation }) {
    const [items, setItems] = React.useState([
        { title: 'Counter', navigateTo: 'Counter' },
        { title: 'Camera', navigateTo: 'Camera' },
        { title: 'Bluetooth1', navigateTo: 'blePlxBluetooth1' },
        { title: 'FileSystem', navigateTo: 'FileSystemHandle' },
        { title: 'WebSocket', navigateTo: 'WebSocketConnection' },
        { title: 'Http', navigateTo: 'HttpConnection' },
        { title: 'RNBleManager', navigateTo: 'RNBleManager' },
        { title: 'Bluetooth2', navigateTo: 'BlePlxBluetooth2' },
        { title: 'Multi', navigateTo: 'Multi' }



    ]);

    return (
        <View style={styles.gridView}>
            <Text h4 style={{ textAlign: "center" }}>Home</Text>
            <Text style={{ textAlign: "center" }}>Component list for Experiment</Text>
            <FlatGrid
                itemDimension={130}
                data={items}
                style={styles.gridView}
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