import React, { useEffect } from "react";
import { Text, View } from "react-native";
import BleManager from 'react-native-ble-manager';
import { PermissionsAndroid } from "react-native";

export default function Bluetooth({ navigation }) {
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
        BleManager.scan([], 5, true).then(results => {
            console.log('Scanning...');
        });
    }

    const cennectBluetooth = () => {
        BleManager.connect(deviceId)
            .then(() => {
                console.log('Connected to ' + deviceId);
            })
            .catch((error) => {
                console.log('Connection error: ' + error);
            });
    }

    const cennectedDevice = () => {
        BleManager.retrieveServices(deviceId)
            .then((peripheralInfo) => {
                console.log('Peripheral info:', peripheralInfo);
                BleManager.retrieveCharacteristics(deviceId, serviceUUID)
                    .then((characteristics) => {
                        console.log('Characteristics:', characteristics);
                    });
            });

    }

    const writeBluetooth = () => {
        BleManager.write(deviceId, serviceUUID, characteristicUUID, data)
            .then(() => {
                console.log('Write success');
            })
            .catch((error) => {
                console.log('Write error:', error);
            });

    }

    const readBluetooth = () => {
        BleManager.read(deviceId, serviceUUID, characteristicUUID)
            .then((data) => {
                console.log('Read data:', data);
            })
            .catch((error) => {
                console.log('Read error:', error);
            });
    }
    return (
        <View>
            <Text>Bluetooth</Text>
        </View>
    )
}