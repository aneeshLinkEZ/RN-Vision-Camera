import { Button } from '@rneui/base';
import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@rneui/base';
import useWebSocket from '../../hooks/useWebSocket';
const WebSocketConnection = () => {
    const { wsConnect, isWsConnected, onDisconnect } = useWebSocket()


    // useEffect(() => {
    //     wsConnect()
    // }, []);
    console.log(isWsConnected);
    return (
        <View style={styles.mainView}>
            <Text>{isWsConnected}</Text>
            <Text h4>WebSocketConnection</Text>
            <View style={{ flexDirection: "row" }}>
                <Button containerStyle={{marginHorizontal: 10}} title={isWsConnected ? "Connected" : "Connect"} onPress={() => { wsConnect() }} disabled={isWsConnected} disabledStyle={{ backgroundColor: "green" }} />
                <Button containerStyle={{marginHorizontal: 10}} buttonStyle={isWsConnected ? {backgroundColor: "red"}: {backgroundColor: "gray"}} title={!isWsConnected ? "disconnected" : "disconnect" } onPress={() => { onDisconnect() }} disabled={!isWsConnected} />
            </View>
        </View>
    )
};

export default WebSocketConnection;

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    }
})
