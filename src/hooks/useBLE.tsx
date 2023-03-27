import { isDeclaration } from "@babel/types";
import { useState } from "react";
import { PermissionsAndroid, Platform } from "react-native";
import { useAppDispatch, useAppSelector } from "../hooks";
import { BleError, BleManager, Device, NativeDescriptor, Descriptor } from "react-native-ble-plx";
import { Base64 } from "react-native-ble-plx";
import { decode } from 'base-64';

type PermissionCallback = (result: boolean) => void;

const bleManager = new BleManager();
const deviceAdd = "C4:BE:B8:A5:15:C8";
const serviceUUID = "c1b25000-caaf-6d0e-4c33-7dae30052840";
const characteristicUUID = "c1b25016-caaf-6d0e-4c33-7dae30052840"
// const serviceUUID2 = "00001800-0000-1000-8000-00805f9b34fb";
// const characteristicUUID2 = "00002a00-0000-1000-8000-00805f9b34fb"

const serviceUUID2 = "00005000-0000-1000-8000-00805f9b34fb";
const characteristicUUID2 = "00005020-0000-1000-8000-00805f9b34fb"

interface BluetoothLowEnergyApi {
    requestPermissions(callback: PermissionCallback): Promise<void>;
    scanForDevices(): void;
    connectToDevice(device: Device): Promise<void>;
    disConnect(): void;
    dataMonitoring: string;
    dataReading: string;
    allDevices: Device[];
    isConnected: Promise<void>;
}

export default function useBLE(): BluetoothLowEnergyApi {

    const [allDevices, setAllDevices] = useState([]);
    const [device, setDevice] = useState();
    const [dataMonitoring, setDataMonitoring] = useState("");
    const [dataReading, setDataReading] = useState("");
    const [isConnected, setIsConnected] = useState(false)

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

    const connectToDevice = async (deviceId: Device) => {

        try {
            const deviceConnection = await bleManager.connectToDevice(deviceId);
            setDevice(deviceConnection);
            isDeviceConnected(deviceConnection)

            bleManager.stopDeviceScan();
            const d = await bleManager.discoverAllServicesAndCharacteristicsForDevice(deviceId);

            // Checking all available services
            const services = await deviceConnection.services();
            services.forEach(async service => {
                const characteristics = await deviceConnection.characteristicsForService(service.uuid);
                characteristics.forEach(console.log);
            });

            const v = await bleManager.readCharacteristicForDevice(deviceId, serviceUUID, characteristicUUID)
            console.log("readCharacteristicForDevice : ", v);

            d.readCharacteristicForService(serviceUUID, characteristicUUID)
                .then((characteristic) => {
                    setDataReading(characteristic.value)
                    console.log('readCharacteristicForService : ', characteristic);
                })
                .catch((error) => {
                    console.error(error);
                });
            startStreamingData(d);
            readingData(d);

        } catch (e) {
            alert(e)
            console.log("Error while Connecting " + e);
        }
    }

    // const convertValue = (value) => {
    //     const dataView = new DataView(characteristic.value.buffer);
    //     const valueNumber = dataView.getUint32(0); // assumes the value is a 32-bit unsigned integer
    //     console.log(valueNumber); // outputs the value as a number

    // }

    const startStreamingData = async (device: Device) => {
        if (device) {
            device.monitorCharacteristicForService(serviceUUID2, characteristicUUID2, onDataUpdate)
        } else {
            console.error("No Device Connected")
        }
    }

    const readingData = async (device) => {

        device.readCharacteristic(characteristicUUID).then((char) => {
            console.log(char);
        })
    }

    const onDataUpdate = (error: BleError | null, characteristic: Characteristic | null) => {
        if (error) {
            alert(error)
            console.error(error);
            return;
        }
        else if (characteristic.value) {
            console.log(characteristic.value);
            setDataMonitoring(characteristic.value)

            // convertValue(characteristic.value);
            // Convert the data to a string
            const base64String = characteristic.value;
            const decodedString = decode(base64String);
            
            console.log(decodedString); // Output: "Test string"

            return;
        } else if (!characteristic?.value) {
            console.error("No Characteristic Found");
            return;
        }
        // // const rowData = atob(characteristic.value);
        // const rowData = "3564z6894"
        // const firstBitValue = String(rowData)
        // if(firstBitValue){
        //     setData(firstBitValue);
        // }
    }

    const isDeviceConnected = (deviceConnection) => {
        // check if the device is connected
        deviceConnection.isConnected().then((connected) => {
            if (connected) {
                setIsConnected(connected);
                console.log('Device is connected');
            } else {
                setIsConnected(false);
                console.log('Device is not connected');
            }
        }).catch((error) => {

            console.log('Error isConnected:', error);
        });

    }

    const disConnect = async (device) => {
        // Disconnect from the device
        await bleManager.cancelDeviceConnection(device.id);

        // Handle the disconnect event
        device.onDisconnected((error, disconnectedDevice) => {
            if (error) {
                // console.log('Error disconnecting:', error);
                alert("Error disconnecting: " + error)

            } else {
                alert("Disconnected from device: " + disconnectedDevice.id)
                // console.log('Disconnected from device:', disconnectedDevice.id);
            }
        });
        isDeviceConnected(device);
    }

    return {
        requestPermissions,
        scanForDevices,
        allDevices,
        connectToDevice,
        disConnect,
        dataMonitoring,
        dataReading,
        isConnected
    }
}