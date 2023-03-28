import React, { useState } from "react";
import { PermissionsAndroid, Platform } from "react-native";
import BleManager from 'react-native-ble-manager';


type PermissionCallback = (result: boolean) => void;

interface BleManagerApi {
    requestPermissions(callback: PermissionCallback): Promise<void>;
    scanForDevices:any;
    connectToDevice;
    devices;
    connectedDevice;
}

export default function useBleManager(): BleManagerApi {
    const [devices, setDevices] = useState([]);
    const [connectedDevice, setConnectedDevice] = useState(null);


    const requestPermissions = async (callback: PermissionCallback) => {
        if (Platform.OS === 'android') {
            const grantedStatus = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: 'Location Permission',
                    message: 'Bluetooth Low Energy Needs Location Permission',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'Ok',
                    buttonNeutral: 'Maybe Later'

                },
            );
            callback(grantedStatus === PermissionsAndroid.RESULTS.GRANTED);
        } else {
            callback(true)
        }
    }

    const bleInit = () => {
        BleManager.start({ showAlert: false })
            .then(() => {
                console.log('BLE module initialized');
            })
            .catch((error) => {
                console.log('BLE module initialization error', error);
            });
    }


    const scanForDevices = () => {
        bleInit();
        BleManager.scan([], 5, true)
            .then(() => {
                console.log('Scan started');
            })
            .catch((error) => {
                console.log('Scan error', error);
            });
    }

    const connectToDevice = async (device) => {
        BleManager.connect(device.id)
        .then(() => {
          console.log('Connected to device', device.id);
          setConnectedDevice(device);
        })
        .catch((error) => {
          console.log('Connection error', error);
        });
    }



    // const startStreamingData = async (device: Device) => {

    // }

    // const readingData = async (device) => {

    // }

    // const onDataUpdate = () => {

    // }

    // const isDeviceConnected = (deviceConnection) => {


    // }

    // const disConnect = async (device) => {

    // }

    return {
        requestPermissions,
        scanForDevices,
        connectToDevice,
        devices,
        connectedDevice
    }
}