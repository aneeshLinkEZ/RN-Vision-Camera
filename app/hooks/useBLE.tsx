import { isDeclaration } from "@babel/types";
import { useState } from "react";
import { PermissionsAndroid, Platform } from "react-native";
import { BleError, BleManager, readCharacteristicForService, Device,cancelConnection } from "react-native-ble-plx";
import { atob } from 'react-native-quick-base64';
type PermissionCallback = (result: boolean) => void;

const bleManager = new BleManager();
const deviceAdd = "C4:BE:B8:A5:15:C8";
const serviceUUID = "c1b25000-caaf-6d0e-4c33-7dae30052840";
const characteristicUUID = "c1b25010-caaf-6d0e-4c33-7dae30052840"


interface BluetoothLowEnergyApi {
    requestPermissions(callback: PermissionCallback): Promise<void>;
    scanForDevices(): void;
    currentDevices: Device | null;
    connectToDevice(device: Device): Promise<void>;
    disConnect(): void;
    data: string;
    allDevices: Device[];
}

export default function useBLE(): BluetoothLowEnergyApi {

    const [allDevices, setAllDevices] = useState([]);
    const [devObj, setDevObj] = useState({});
    const [currentDevices, setConnectedDevice] = useState<Device | null>(null);
    const [data, setData] = useState("");

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

    const isDuplicateDevice = (devices: Device[], nextDevice: Device) =>
        devices.findIndex(device => nextDevice.id === device.id) > -1;



    const scanForDevices = () => {
        bleManager.startDeviceScan(null, null, (error, device) => {
            if (error) {
                console.log(error);
            }
            if (device?.name === "SY295") {

                setAllDevices((prevState) => {
                    if (!isDuplicateDevice(prevState, device)) {
                        return [...prevState, device];
                    }
                    return prevState;
                });
            }
        })

    }

    const connectToDevice = async (device: Device) => {

        try {
            const deviceConnection = await bleManager.connectToDevice(device);
            console.log("vsfdSGV   => ", deviceConnection);

            setConnectedDevice(deviceConnection);
            bleManager.stopDeviceScan();
            const v = await deviceConnection.discoverAllServicesAndCharacteristics();
            console.log(v);

            // Read data from a characteristic
            // bleManager.readCharacteristicForDevice() 
            readCharacteristicForService(serviceUUID, characteristicUUID)
                .then((characteristic) => {
                    console.log('Read data:', characteristic.value);
                })
                .catch((error) => {
                    console.error(error);
                });

        } catch (e) {
            alert(e)
            console.log("Error while Connecting " + e);
        }
    }

    const disConnect = () => {
        // Disconnect from the device
        cancelConnection()
            .then(() => {
                alert("Disconnected from device");
                console.log('Disconnected from device');
            })
            .catch((error) => {
                console.error(error);
            });
    }

    // const startStreamingData = async (device: Device) => {
    //     if (device) {
    //         device.monitorCharacteristicForService(deviceUUID, deviceCHAR, onDataUpdate)
    //     } else {
    //         console.error("No Device Connected")
    //     }
    // }

    // const onDataUpdate = (error: BleError | null, characteristic: Characteristic | null) => {
    //     if (error) {
    //         console.error(error);
    //         return;
    //     } else if (!characteristic?.value) {
    //         console.error("No Characteristic Found");
    //         return;
    //     }

    //     // const rowData = atob(characteristic.value);
    //     const rowData = "3564z6894"
    //     const firstBitValue = String(rowData)
    //     if (firstBitValue) {
    //         setData(firstBitValue);
    //     }
    // }

    return {
        requestPermissions,
        scanForDevices,
        allDevices,
        connectToDevice,
        disConnect,
        currentDevices,
        data,
    }
}