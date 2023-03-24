import { isDeclaration } from "@babel/types";
import { useState } from "react";
import { PermissionsAndroid, Platform } from "react-native";
import { BleError, BleManager, readCharacteristicForService, Device, cancelConnection } from "react-native-ble-plx";
import { atob } from 'react-native-quick-base64';
type PermissionCallback = (result: boolean) => void;

const bleManager = new BleManager();
const deviceAdd = "C4:BE:B8:A5:15:C8";
const serviceUUID = "c1b25000-caaf-6d0e-4c33-7dae30052840";
const characteristicUUID = "c1b25014-caaf-6d0e-4c33-7dae30052840"


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
    const [device, setDevice] = useState();
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

    const connectToDevice = async (deviceId: Device) => {

        try {
            const deviceConnection = await bleManager.connectToDevice(deviceId);
            setDevice(deviceConnection);
            setConnectedDevice(deviceConnection);
            bleManager.stopDeviceScan();

            const d = await deviceConnection.discoverAllServicesAndCharacteristics();
            // Checking all available services
            const services = await deviceConnection.services();
            services.forEach(async service => {
                const characteristics = await deviceConnection.characteristicsForService(service.uuid);
                characteristics.forEach(console.log);
            });


            d.readCharacteristicForService(serviceUUID, characteristicUUID)
                .then((characteristic) => {
                    console.log('Read data:', characteristic.value);
                    // alert(characteristic.value)
                })
                .catch((error) => {
                    console.error(error);
                });
                startStreamingData(d)
        } catch (e) {
            alert(e)
            console.log("Error while Connecting " + e);
        }
    }

    const startStreamingData = async (device: Device) => {
        if(device){
            device.monitorCharacteristicForService(serviceUUID, characteristicUUID,onDataUpdate)
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
        // // const rowData = atob(characteristic.value);
        // const rowData = "3564z6894"
        // const firstBitValue = String(rowData)
        // if(firstBitValue){
        //     setData(firstBitValue);
        // }
    }

    const disConnect = async (deviceId) => {
        // Disconnect from the device
        await bleManager.cancelDeviceConnection(deviceId);

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
    }

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