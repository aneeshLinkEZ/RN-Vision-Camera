import React, { useEffect, useState } from "react";
import { PermissionsAndroid, Platform,  NativeModules, NativeEventEmitter} from "react-native";
import BleManager from 'react-native-ble-manager';


const BleManagerModule = NativeModules.BleManager;
const BleManagerEmitter = new NativeEventEmitter(BleManagerModule);


interface BleManagerApi {
    requestPermissions: Promise<void>;
    scanForDevices:any;
    connectToDevice;
    devices;
    connectedDevice;
}

export default function useBleManager(): BleManagerApi {
    const [devices, setDevices] = useState([]);
    const [connectedDevice, setConnectedDevice] = useState(null);
    const [isScanning, setIsScanning] = useState(false);


    const requestPermissions = async () => {
        const a = await BleManager.enableBluetooth().then(() => {
            console.log('Bluetooth is turned on!');
            if (Platform.OS === 'android' && Platform.Version >= 23) {
                PermissionsAndroid.check(
                  PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                ).then(result => {
                  if (result) {
                    console.log('Permission is OK');
                  } else {
                    PermissionsAndroid.request(
                      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    ).then(result => {
                      if (result) {
                        console.log('User accept');
                      } else {
                        console.log('User refuse');
                      }
                    });
                  }
                });
              }
          });
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
        // if (!isScanning) {
            BleManager.scan([], 10, true)
              .then(() => {
                setIsScanning(true);
                console.log("Scaning");
                
              })
              .catch(error => {
                console.error(error);
              });
        //   }
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

    const stopDeviceScan = ()=>{
        let stopListener = BleManagerEmitter.addListener(
            'BleManagerStopScan',
            () => {
              setIsScanning(false);
              console.log('Scan is stopped');
            },
          );
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