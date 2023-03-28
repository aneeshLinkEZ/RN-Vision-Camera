import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect } from 'react'
import useBleManager from '../../hooks/useBleManager'

const BleManager = () => {
    const { requestPermissions, scanForDevices,devices,connectedDevice, connectToDevice } = useBleManager();

    useEffect(() => {
        requestPermissions()
    }, [])

    return (
        <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
            <Button title='Scan devices' onPress={scanForDevices}/>
            {devices.map((device) => (
                <TouchableOpacity key={device.id} onPress={() => connectToDevice(device)}>
                    <Text>{device.name}</Text>
                </TouchableOpacity>
            ))}
            {connectedDevice && (
                <Text>Connected to {connectedDevice.name}</Text>
            )}
        </View>
    )
}

export default BleManager

const styles = StyleSheet.create({})