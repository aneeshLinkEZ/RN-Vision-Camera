import { useIsFocused } from '@react-navigation/native';
import { Button, Icon } from '@rneui/base';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Text, StyleSheet, Linking, View, Touchable, TouchableOpacity, Image, Platform } from 'react-native';
import { Dirs, FileSystem } from 'react-native-file-access';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from "react-native-responsive-dimensions";
import useCameraApi from '../../hooks/useCameraApi';


export default function CameraScreen({ navigation }) {
    const {requestStoragePermission, isPermission, savePicture, saveVideo} = useCameraApi();
    const camera = useRef(null);
    let cameraRef = null;
    const [isRecording, setIsRecording] = useState(false);
    const [flash, setFlash] = useState("off")
    const [video, setVideo] = useState(false);
    const [photoShoot, setPhotoShoot] = useState(true)
    const [showCamera, setShowCamera] = useState(false)
    const [imageSource, setImageSource] = useState(false)
    const devices = useCameraDevices('wide-angle-camera')
    const [device, setDevice] = useState(false)
    const isFocused = useIsFocused()

    useEffect(() => {
        requestStoragePermission()
    }, [])

    useEffect(() => {
        requestStoragePermission()
    },[])
    
    useEffect(() => {
        setDevice(devices.back)
    }, [devices])


    // taking photo
    const capturePhoto = async () => {
        if (camera.current !== null) {
            const photo = await camera.current.takePhoto({});
            savePicture(photo.path);// Saving Image to Gallary
            setImageSource(photo.path);
            setShowCamera(false);
        }

        if (camera.current !== null) {
            const photo = await camera.current.takePhoto({
                flash: flash,
                qualityPrioritization: 'speed',
                enableAutoRedEyeReduction: true,
                enableAutoStabilization: true
            });
            setImageSource(photo.path);
            setShowCamera(false);
            console.log(photo.path);
        }
    }


    // start video Record
    const startRecording = () => {
        setIsRecording(true);
        console.log(isRecording);
        let video = camera.current.startRecording({
            flash: flash,
            onRecordingFinished: (video) => { 
                setIsRecording(false), 
                console.log("Video", video.path), 
                saveVideo(video.path) // Saving video to Gallary
            },
            onRecordingError: (error) => console.log("Recording Erroe = ", error),
        })
    }

    //Stop video record
    const stopRecording = async () => {
        if (camera.current) {
            setIsRecording(false);
            await camera.current.stopRecording();
        }
    };


    function flipCamera() {
        {(device === devices.back) ? setDevice(devices.front) : setDevice(devices.back)}
    }


    if (device == null) return <ActivityIndicator size={"large"} style={{ flex: 1 }} />
    return (
        <View style={Styles.container}>
            {photoShoot === true ? (
                <View style={Styles.container}>
                    <Camera
                        ref={camera}
                        style={[Styles.camera, { position: "relative" }]}
                        device={device}
                        isActive={isFocused}
                        photo={true}
                        preset="medium"
                        fps={240}
                        video={false}
                        audio={false}
                    />
                    <View style={Styles.flashView}>
                        {flash === "off" ? (<View>
                            <Icon type='ionicon' name="flash" iconStyle={{ color: "white" }} style={{ borderRadius: 5 }} onPress={() => {
                                if (flash === "off") {
                                    setFlash("on")
                                } else {
                                    setFlash("off")
                                }
                            }} />
                            <Text>ON</Text>
                        </View>) : (
                            <View><Icon type='ionicon' name="flash-off" iconStyle={{ color: "white" }} onPress={() => {
                                if (flash === "off") {
                                    setFlash("on")
                                } else {
                                    setFlash("off")
                                }
                            }} />
                                <Text>OFF</Text>
                            </View>
                        )}
                    </View>
                    <View style={{ position: "absolute", width: "100%", paddingTop: responsiveHeight(80) }}>
                        <View style={{ flexDirection: "row", justifyContent: "space-evenly", paddingBottom: 20 }}>
                            <Text style={Styles.videoText} onPress={() => { setPhotoShoot(false) }}>Video</Text>
                            <Text style={Styles.videoText} onPress={() => { setPhotoShoot(true) }}>Photo</Text>
                        </View>
                        <View style={{ flexDirection: 'row', width: responsiveWidth(100), justifyContent: "space-evenly", paddingBottom: 30 }}>
                            <View style={{ justifyContent: 'center', alignItems: "center" }}>
                                <TouchableOpacity style={Styles.viewButton} onPress={() => navigation.navigate("ViewGallary")}>
                                    <Image
                                        style={Styles.image}
                                        source={{
                                            uri: `file://'${imageSource}`,
                                        }}
                                    />
                                </TouchableOpacity>
                            </View>
                            <View style={{ justifyContent: 'center', alignItems: "center" }}>
                                <TouchableOpacity style={Styles.captureButton} onPress={() => capturePhoto()}>
                                    <Text style={Styles.captureButtonText}>CAPTURE</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ justifyContent: 'center', alignItems: "center" }}>
                                <TouchableOpacity style={Styles.viewButton} onPress={flipCamera}>
                                    <Icon type='ionicon' name="camera-reverse" iconStyle={[{ color: "#000000c7" }]} style={{}} />
                                </TouchableOpacity>
                            </View>
                        </View>

                    </View>
                </View>
            ) : (<View style={Styles.container}>
                <Camera
                    ref={camera}
                    style={[Styles.camera, { position: "relative" }]}
                    device={device}
                    isActive={isFocused}
                    photo={false}
                    preset="medium"
                    fps={240}
                    video={true}
                    audio={true}
                />
                <View style={{ position: "absolute", paddingBottom: responsiveHeight(90), right: 20 }}>
                    {flash === "off" ? (<View>
                        <Icon type='ionicon' name="flash" iconStyle={{ color: "white" }} style={{ borderRadius: 5 }} onPress={() => {
                            if (flash === "off") {
                                setFlash("on")
                            } else {
                                setFlash("off")
                            }
                        }} />
                        <Text>ON</Text>
                    </View>) : (
                        <View><Icon type='ionicon' name="flash-off" iconStyle={{ color: "white" }} onPress={() => {
                            if (flash === "off") {
                                setFlash("on")
                            } else {
                                setFlash("off")
                            }
                        }} />
                            <Text>OFF</Text>
                        </View>
                    )}
                </View>
                <View style={{ position: "absolute", width: "100%", paddingTop: responsiveHeight(80) }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-evenly", paddingBottom: 20 }}>
                        <Text style={Styles.videoText} onPress={() => { setPhotoShoot(false) }}>Video</Text>
                        <Text style={Styles.videoText} onPress={() => { setPhotoShoot(true) }}>Photo</Text>
                    </View>
                    <View style={{ flexDirection: 'row', width: responsiveWidth(100), justifyContent: "space-evenly", paddingBottom: 20 }}>
                        <View style={{ justifyContent: 'center', alignItems: "center" }}>
                            <TouchableOpacity style={Styles.viewButton} onPress={() => navigation.navigate("ViewGallary")}>
                                <Image
                                    style={Styles.image}
                                    source={{
                                        uri: `file://'${imageSource}`,
                                    }}
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={{ justifyContent: 'center', alignItems: "center" }}>
                            {!isRecording ? (
                                <TouchableOpacity style={Styles.startVideo} onPress={() => { startRecording() }}>
                                    <Text style={Styles.startVideoText}></Text>
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity style={Styles.stopVideo} onPress={() => { stopRecording() }}>
                                    <Text style={Styles.stopVideoText}></Text>
                                </TouchableOpacity>
                            )}

                        </View>
                        <View style={{ justifyContent: 'center', alignItems: "center" }}>
                            <TouchableOpacity style={Styles.viewButton} onPress={flipCamera}>

                                <Icon type='ionicon' name="camera-reverse" iconStyle={[{ color: "#000000c7" }]} style={{}} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>)}

        </View>
    )
}

const Styles = StyleSheet.create({
    container: {
        flex: 3,
        backgroundColor: '#000',
        justifyContent: 'center',
    },
    flashView: { 
        position: "absolute", 
        paddingBottom: responsiveHeight(90), 
        right: 20 
    },
    camera: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    captureButton: {
        width: 70,
        height: 70,
        borderRadius: 40,
        backgroundColor: '#fff',
        marginVertical: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: 'auto',
        aspectRatio: 1 / 1,
        borderRadius: 100
    },
    captureButtonText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
    },
    viewButton: {
        width: 60,
        height: 60,
        borderRadius: 40,
        backgroundColor: '#fff',
        marginVertical: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    viewButtonText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
    },
    startVideo: {
        width: 70,
        height: 70,
        borderRadius: 40,
        backgroundColor: 'red',
        marginVertical: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    startVideoText: {
        height: 60,
        width: 60,
        backgroundColor: 'white',
        borderRadius: 40,
        justifyContent: "center"
    },
    stopVideo: {
        width: 70,
        height: 70,
        borderRadius: 40,
        borderColor: "red",
        borderWidth: 5,
        marginVertical: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    stopVideoText: {
        height: 30,
        width: 30,
        backgroundColor: 'white',
        borderRadius: 40,
        justifyContent: "center"
    },
    videoText: {
        backgroundColor: "#ffffff80",
        padding: 5,
        borderRadius: 20
    }
});

