import { Button } from "@rneui/base";
import React from "react";
import { View } from "react-native";
import { BleManager } from 'react-native-ble-plx';



export default function blePlxBluetooth({ navigation }) {

    const startScan =()=>{
        console.log("Hi");
    }

    return (
        <View>
            <Button title={"Scan"} onPress={() => { startScan() }} />
        </View>
    )
}