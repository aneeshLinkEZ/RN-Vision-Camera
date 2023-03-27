import { Button, Overlay, Text } from "@rneui/base";
import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, View, StyleSheet, ScrollView, SafeAreaView, RefreshControl, Modal, FlatList, TextInput } from "react-native";
import { useAppDispatch, useAppSelector } from "../../hooks";
import useBLE from "../../hooks/useBLE";
import {
    responsiveHeight,
    responsiveWidth,
    responsiveFontSize
} from "react-native-responsive-dimensions";


export default function BlePlxBluetooth({ navigation }) {
    // const allDevices : {} = useAppSelector(state => state.bluetooth.bluetooth)    

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

    const showDetailsPopup = () => {
        setShowDetails(!showDetails);
    }

    const {
        requestPermissions,
        scanForDevices,
        connectToDevice,
        disConnect,
        allDevices,
        currentDevices,
        dataMonitoring,
        dataReading,
        isConnected
    } = useBLE();


    useMemo(() => {
        requestPermissions((isGranted: boolean) => {
            // alert("The Android Permission is Granted? " + isGranted)
            if (isGranted) {
                scanForDevices();
            }
        });
    }, [])

    if (allDevices?.length === 0) {
        return <ActivityIndicator size="large" color="" style={Styles.loader} />
    }

    const ModalPopUp = (data: any) => {
        return (<View style={{ width: responsiveWidth(50), justifyContent: "center" }}>
            <Text h4>Device Datails</Text>
            <Text >{device.name}</Text>
            <Text >{device.id}</Text>
            {/* <Text>{device?.serviceData}</Text> */}
            <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                <Button title="Connect" buttonStyle={Styles.connectBtn} onPress={() => { connectToDevice(device.id), toggleOverlay() }} />

                {/* <Button title="Disconnect" buttonStyle={[Styles.connectBtn,{width: 105}]} onPress={() => { disConnect(), toggleOverlay() }} /> */}
            </View>
        </View>)
    }

    const ShowDetailsModal = (data: any) => {
        console.log("deviceDetails", deviceDetails);

        return (<View style={{ width: responsiveWidth(50), justifyContent: "center" }}>
            <Text h4>show Datails</Text>
            <Text >Name : {deviceDetails?.name || "null"}</Text>
            <Text >Id : {deviceDetails?.id || "null"}</Text>
            <Text>serviceUUIDs : {deviceDetails?.serviceUUIDs || "null"}</Text>
            <Text>characteristic : {deviceDetails?.characteristic || "null"}</Text>
            <Button title="Close" buttonStyle={Styles.connectBtn} onPress={showDetailsPopup} />
        </View>)
    }

    const renderItem = ({item}) => {
        console.log(item);
        
        return(
            <View>
            <View style={{ marginBottom: 5, padding: 2, borderWidth: 1, borderColor: 'black' }}>
                <View style={Styles.row}>
                    <View style={{ flexDirection: "column", width: responsiveWidth(50) }}>
                        <Text>Name : {item?.name}   </Text>
                        <Text >Device Id : {item?.id}</Text>
                    </View>
                    <View style={{ flexDirection: "row", width: responsiveWidth(40), justifyContent: "space-between" }}>
                        <Button title={"connect"} onPress={() => { toggleOverlay(), setDevice(item) }} disabled={isConnected} buttonStyle={{ backgroundColor: "green" }} />
                        <Button title={"Show Details"} onPress={() => { showDetailsPopup(), setDeviceDetails(item) }} />
                        <Button buttonStyle={{ backgroundColor: "red" }} title={"disconnect"} onPress={() => { disConnect(item) }} disabled={!isConnected} />
                        <Overlay overlayStyle={Styles.modal} isVisible={visible} onBackdropPress={toggleOverlay}>
                            <ModalPopUp {...item} />
                        </Overlay>
                        <Overlay overlayStyle={Styles.modal} isVisible={showDetails} onBackdropPress={showDetailsPopup}>
                            <ShowDetailsModal {...item} />
                        </Overlay>
                    </View>
                </View>
                <View>
                    <View style={Styles.row}>
                        <Text style={{ marginVertical: 20 }}>Reading Data : </Text>
                        <TextInput
                            style={Styles.input}
                            // onChangeText={onChangeText}
                            placeholder="Reading from Ble Device...."
                            value={dataReading}
                        />
                    </View>
                    <View style={[Styles.row]}>
                        <Text style={{ marginVertical: 20 }}>Monitoring Data : </Text>
                        <TextInput
                            style={Styles.input}
                            placeholder="Monotoring the Ble Device...."
                            // onChangeText={onChangeText}
                            value={dataMonitoring}
                        />
                    </View>
                </View>
            </View>

        </View>
        )
    }



    return (
        <SafeAreaView style={Styles.mainView}>
            <Text h4>BLE-Devices</Text>

            <FlatList
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                data={allDevices}
                keyExtractor={item => item.id}
                renderItem={renderItem}
            />
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
    row: {
        flexDirection: "row"
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
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
        width: 85,
        borderRadius: 5,
        alignSelf: "flex-end",
        marginLeft: 5
    },
    loader: {
        flex: 1,
        justifyContent: "center",
        fontSize: 154
    }
})