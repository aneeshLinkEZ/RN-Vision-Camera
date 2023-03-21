import React, { useEffect } from "react";
import { Text, View } from "react-native";
// import BleManager from 'react-native-ble-manager';
import { BleManager } from 'react-native-ble-plx';

import { PermissionsAndroid } from "react-native";
import { Button } from "@rneui/base";

const bleManager = new BleManager();
export default function Bluetooth({ navigation }) {
    useEffect(() => {
        bleManager.start({ showAlert: false, forceLegacy: true });
    }, []);

    useEffect(() => {
        async function requestLocationPermission() {
            try {
                const granted = await PermissionsAndroid.check(
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                );
                if (!granted) {
                    const result = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
                        {
                            title: 'Location Permission',
                            message: 'This app needs access to your location to scan for BLE devices',
                            buttonNeutral: 'Ask Me Later',
                            buttonNegative: 'Cancel',
                            buttonPositive: 'OK',
                        },
                    );
                    if (result === PermissionsAndroid.RESULTS.GRANTED) {
                        console.log('Location permission granted');
                    } else {
                        console.log('Location permission denied');
                    }
                } else {
                    console.log('Location permission already granted');
                }
            } catch (error) {
                console.log('Location permission error:', error);
            }
        }
        requestLocationPermission();
    }, [])
    const startScan = () => {
        bleManager.startDeviceScan(null, null, (error, device) => {
            if (error) {
                // Handle error
                return;
            }
            // Check if the device has the service you're looking for
            if (device.name === 'MyDevice' && device.serviceUUIDs.includes('00')) {
                // Do something with the device
                console.log('Found MyDevice:', device);
            }
        });
    }

    return (
        <View>
            <Text>Bluetooth</Text>
            <Button title={"Scan"} onPress={() => {startScan()}} />
        </View>
    )
}