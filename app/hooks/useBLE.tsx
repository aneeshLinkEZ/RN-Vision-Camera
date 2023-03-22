import { isDeclaration } from "@babel/types";
import { useState } from "react";
import { PermissionsAndroid, Platform } from "react-native";
import { BleError, BleManager, Characteristic, Device } from "react-native-ble-plx";
import {atob} from 'react-native-quick-base64';
type PermissionCallback = (result: boolean) => void;

const bleManager = new BleManager();
const deviceAdd ="D9:7A:C9:C5:56:7D";
const deviceUUID = "c1b25000-caaf-6d0e-4c33-7dae30052840";
const deviceCHAR = "c1b25010-caaf-6d0e-4c33-7dae30052840"


interface BluetoothLowEnergyApi {
    requestPermissions(callback: PermissionCallback): Promise<void>;
    scanForDevices(): void;
    currentDevices: Device | null;
    connectToDevice(device: Device): Promise<void>;
    data: string;
    allDevices: Device[];
}

export default function useBLE(): BluetoothLowEnergyApi {

    const [allDevices, setAllDevices] = useState<Device[]>([]);
    const [manager, setManager] = useState(null);
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
            if (device) {
                setAllDevices((prevState) => {
                    if (!isDuplicateDevice(prevState, device)) {
                        return [...prevState, device];
                    }
                    return prevState;
                });
            }
        })
    }

    const connectToDevice =async (device : Device) => {
        try{
            const deviceConnection = await bleManager.connectToDevice(device);
            setConnectedDevice(deviceConnection);
            bleManager.stopDeviceScan();
            await deviceConnection.discoverAllServicesAndCharacteristics();
            // startStreamingData(device);


        } catch (e){
            alert(e)
            console.log("Error while Connecting " + e);
        }
    }

    const startStreamingData = async (device: Device) => {
        if(device){
            device.monitorCharacteristicForService(deviceUUID, deviceCHAR,onDataUpdate)
        }else{
            console.error("No Device Connected")
        }
    }

    const onDataUpdate = (error: BleError | null, characteristic : Characteristic | null)=> {
        if(error){
            console.error(error);
            return;
        } else if(!characteristic?.value){
            console.error("No Characteristic Found");
            return;
        }

        // const rowData = atob(characteristic.value);
        const rowData = "3564z6894"
        const firstBitValue = String(rowData)
        if(firstBitValue){
            setData(firstBitValue);
        }
    }

    // const connectToDevice = async (deviceId) => {
    //     const device = allDevices.find((d) => d.id === deviceId);
    //     if (!device) {
    //         console.log('Device not found!');
    //         return;
    //     }

    //     try {
    //         await device.connect();
    //         setConnectedDevice(device);
    //     } catch (error) {
    //         console.log('Error while connecting:', error);
    //     }
    // };

    // const stopScan = () => {
    //     const b = bleManager.stopDeviceScan();
    //     console.log(b);
        
    // };

    // const disconnectFromDevice = async () => {
    //     if (!connectedDevice) {
    //         console.log('No connected device!');
    //         return;
    //     }

    //     try {
    //         await connectedDevice.cancelConnection();
    //         setConnectedDevice(null);
    //     } catch (error) {
    //         console.log('Error while disconnecting:', error);
    //     }
    // };

    return {
        requestPermissions,
        scanForDevices,
        allDevices,
        connectToDevice,
        currentDevices,
        data,
    }
}