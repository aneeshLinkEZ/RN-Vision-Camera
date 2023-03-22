import { Button, Overlay, Text } from "@rneui/base";
import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, View, StyleSheet, ScrollView, SafeAreaView, RefreshControl, Modal, FlatList } from "react-native";
import useBLE from "../../hooks/useBLE";
import {
    responsiveHeight,
    responsiveWidth,
    responsiveFontSize
} from "react-native-responsive-dimensions";


export default function BlePlxBluetooth({ navigation }) {
    const [refreshing, setRefreshing] = useState(false);
    const [visible, setVisible] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [deviceDetails, setDeviceDetails] = useState(false);
    const [device, setDevice] = useState({})

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);

    const toggleOverlay = () => {
        setVisible(!visible);
    };

    const showDetailsPopup=()=>{
        setShowDetails(!showDetails);
    }

    const {
        requestPermissions,
        scanForDevices,
        allDevices,
        connectToDevice,
        currentDevices,
        data
    } = useBLE();

 
    useMemo(() => {
        requestPermissions((isGranted: boolean) => {
            // alert("The Android Permission is Granted? " + isGranted)
            if (isGranted) {
                scanForDevices();
            }
        });
    }, [])

    if (allDevices.length === 0) {
        return <ActivityIndicator size="large" color="" style={Styles.loader} />
    }

    const ModalPopUp = (data: any) => {
           return( <View style={{ width: responsiveWidth(50), justifyContent: "center" }}>
                <Text h4>Device Datails</Text>
                <Text >{device.name}</Text>
                <Text >{device.id}</Text>
                <Text>{device?.serviceData}</Text>
                <Button title="Connect" buttonStyle={Styles.connectBtn} onPress={()=>{connectToDevice(device.id)}} />
            </View>)
    }
    const ShowDetailsModal = (data: any) => {
        return( <View style={{ width: responsiveWidth(50), justifyContent: "center" }}>
             <Text h4>show Datails</Text>
             <Text >Name : {deviceDetails?.name || "null"}</Text>
             <Text >Id : {deviceDetails?.id || "null"}</Text>
             <Text>serviceData : {deviceDetails?.serviceData || "null"}</Text>

             <Text>serviceUUIDs : {deviceDetails?.serviceUUIDs || "null"}</Text>
             <Text>characteristic : {deviceDetails?.characteristic || "null"}</Text>
             <Button title="Close" buttonStyle={Styles.connectBtn} onPress={showDetailsPopup} />
         </View>)
 }



    return (
        <SafeAreaView style={Styles.mainView}>
            <Text h4>BLE-Devices</Text>
            <ScrollView
                contentContainerStyle={Styles.scrollView}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }>

                {
                    allDevices.map((device: Device) => (
                        <View style={{ flexDirection: "row", marginBottom: 5, padding: 2, borderWidth: 1, borderColor: 'black' }}>
                            <View style={{ flexDirection: "row", width: responsiveWidth(50), alignItems: "center" }}>
                                <Text style={{ textAlign: "center" }}>{device.name}</Text>
                                <Text style={{ textAlign: "center" }}>{device.id}</Text>
                            </View>
                            <View style={{ flexDirection: "row", width: responsiveWidth(40), justifyContent: "space-between" }}>
                                <Button title={"connect"} onPress={() => { toggleOverlay(), setDevice(device) }} />
                                <Button title={"Show Details"} onPress={() => { showDetailsPopup(), setDeviceDetails(device)}}/>
                                <Button title={"disconnect"} />
                                <Overlay overlayStyle={Styles.modal} isVisible={visible} onBackdropPress={toggleOverlay}>
                                    <ModalPopUp {...device} />
                                </Overlay>
                                <Overlay overlayStyle={Styles.modal} isVisible={showDetails} onBackdropPress={showDetailsPopup}>
                                    <ShowDetailsModal {...device} />
                                </Overlay>
                            </View>
                        </View>
                    ))
                }
            </ScrollView>

            <Button title={"Scan"} style={{ marginVertical: 10 }} />
        </SafeAreaView >
    )
}

const Styles = StyleSheet.create({
    mainView: {
        flex: 1,
        margin: 10,
        alignItems: 'center'
    },
    scrollView: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20
    },
    modal: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 5,

    },
    connectBtn: {
        width: responsiveWidth(10),
        borderRadius: 5,
        alignSelf: "flex-end"
    },
    loader: {
        flex: 1,
        justifyContent: "center",
        fontSize: 154
    }
})