import { useState } from "react";
import { Linking, PermissionsAndroid, Platform } from "react-native";
import {CameraRoll} from '@react-native-camera-roll/camera-roll';

import { Camera, useCameraDevices } from 'react-native-vision-camera';

type PermissionCallback = (result: boolean) => void;

interface useStoragePermission {
    requestStoragePermission(callback: PermissionCallback): Promise<void>;
    isPermission: Promise<void>;
    savePicture;
    saveVideo;

}


export default function useCameraApi(): useStoragePermission {

    const [isPermission, setIsPermission] = useState(false)

    const requestStoragePermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                {
                    title: 'Permission Required',
                    message: 'This app needs access to your storage to save photos.',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log('Storage Permission Granted.');
            } else {
                console.log('Storage Permission Denied.');
            }
            getPermission()
        } catch (err) {
            console.warn(err);
        }
    };

    const getPermission = async () => {
        const cameraPermission = await Camera.getCameraPermissionStatus()
        const newCameraPermission = await Camera.requestCameraPermission()
        console.log(`Camera permission status: ${newCameraPermission}`);
        if (newCameraPermission === 'denied') {
            await Linking.openSettings()
        }
        const newMicrophonePermission = await Camera.requestMicrophonePermission()
    }

    const savePicture = async (imagePath) => {
        try {
            const result = await CameraRoll.save(imagePath, 'photo');
            console.log('Image saved to gallery:', result);
        } catch (error) {
            console.log('Error saving image to gallery:', error);
        }
    }

    const saveVideo = async (videoPath) => {
        try {
            const result = await CameraRoll.save(videoPath, 'video');
            console.log('Video saved to gallery:', result);
        } catch (error) {
            console.log('Error saving Video to gallery:', error);
        }
    }

    return {
        requestStoragePermission,
        isPermission,
        savePicture,
        saveVideo
    }
}