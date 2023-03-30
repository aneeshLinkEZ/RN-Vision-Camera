import { useState } from "react";
import { Alert, PermissionsAndroid, Platform } from "react-native";
import { BleError, BleManager, Characteristic, Device } from "react-native-ble-plx";

type PermissionCallback = (result: boolean) => void;

const bleManager = new BleManager();
const deviceAdd = "C4:BE:B8:A5:15:C8";

const serviceUUID = "C1B25000-CAAF-6D0E-4C33-7DAE30052840";
const characteristicUUID = "C1B25010-CAAF-6D0E-4C33-7DAE30052840"

interface BluetoothLowEnergyApi {
    requestPermissions(callback: PermissionCallback): Promise<void>;
    scanForDevices(): void;
    connectToDevice(device: Device): Promise<void>;
    disConnect(): void;
    dataMonitoring: string;
    allDevices: Device[];
    isConnected: Promise<void>;
}

export default function useBLE(): BluetoothLowEnergyApi {

    const [allDevices, setAllDevices] = useState([]);
    const [dataMonitoring, setDataMonitoring] = useState("");
    const [isConnected, setIsConnected] = useState(false)
    const [currentDevices, setCurrentDevices] = useState()

    const requestPermissions = async (callback: PermissionCallback) => {
        const subscription = bleManager.onStateChange((state) => {
            if (state === 'PoweredOff') {
                Alert.alert('"BasicApp" would like to use Bluetooth.', 'This app uses Bluetooth to connect to and share information with your .....', [
                    {
                        text: "Don't allow",
                        onPress: () => console.log('Cancel Pressed'),
                        style: 'cancel',
                    },
                    { text: "Turn ON", onPress: () => { bleManager.enable(); } },
                ]);
                subscription.remove();
            }
        }, true);
        onEnable(callback);
    }

    const onEnable = async (callback: PermissionCallback) => {
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
            if (device?.id === "D9:7A:C9:C5:56:7D") {
                // if (device) {
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
            setCurrentDevices(deviceConnection);
            isDeviceConnected(deviceConnection)

            bleManager.stopDeviceScan();
            const d = await bleManager.discoverAllServicesAndCharacteristicsForDevice(deviceId);

            // Checking all available services
            const services = await deviceConnection.services();
            services.forEach(async service => {
                const characteristics = await deviceConnection.characteristicsForService(service.uuid);
                characteristics.forEach(console.log);
            });
            
            startStreamingData(d);
        } catch (e) {
            alert(e)
            console.log("Error while Connecting " + e);
        }
    }

    const startStreamingData = async (device: Device) => {
        if (device) {
            device.monitorCharacteristicForService(serviceUUID, characteristicUUID, onDataUpdate)
        } else {
            console.error("No Device Connected")
        }
    }


    const onDataUpdate = (error: BleError | null, characteristic: Characteristic | null) => {
        if (error) {
            alert(error)
            console.error(error);
            return;
        }
        else if (characteristic.value) {
            var atob = require('atob');
            const rawData = atob(characteristic.value);
            // console.log("rawData", rawData);
            setDataMonitoring(rawData)
            return;
        } else if (!characteristic?.value) {
            console.error("No Characteristic Found");
            return;
        }
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
                alert("Error disconnecting: " + error)

            } else {
                alert("Disconnected from device: " + disconnectedDevice.id)
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
        isConnected
    }
}