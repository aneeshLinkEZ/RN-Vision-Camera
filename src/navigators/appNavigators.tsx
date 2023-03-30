import React from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from "../screens/Home/home";
import Counter from "../screens/counter/counter";
import Camera from "../nativeApi/Camera/RNVCamera";
import ViewGallary from "../screens/gallary/gallary";
import blePlxBluetooth1 from "../nativeApi/bluetooth/blePlxBluetooth1";
import FileSystemHandle from "../nativeApi/fileSystem/fileSystem";
import MATSGrid from "../components/MATSGrid/MATSGrid"
import WebSocketConnection from "../connection/webSocket/webSocket";
import HttpConnection from "../connection/http/httpConnection";
import BlePlxBluetooth2 from "../nativeApi/bluetooth/blePlxBluetooth2";
import Multi from "../screens/multi/multi";

const Stack = createNativeStackNavigator();

function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name='Home' component={Home} options={{ headerShown: false }} />
                <Stack.Screen name='Counter' component={Counter} options={{ headerShown: true }} />
                <Stack.Screen name='Camera' component={Camera} options={{ headerShown: false }} />
                <Stack.Screen name='ViewGallary' component={ViewGallary} options={{ headerShown: true }} />
                <Stack.Screen name='blePlxBluetooth1' component={blePlxBluetooth1} options={{ headerShown: true }} />
                <Stack.Screen name='FileSystemHandle' component={FileSystemHandle} options={{ headerShown: true }} />
                <Stack.Screen name='MATSGrid' component={MATSGrid} options={{ headerShown: true }} />
                <Stack.Screen name='WebSocketConnection' component={WebSocketConnection} options={{ headerShown: true }} />
                <Stack.Screen name='HttpConnection' component={HttpConnection} options={{ headerShown: true }} />
                <Stack.Screen name='BlePlxBluetooth2' component={BlePlxBluetooth2} options={{ headerShown: true }} />
                <Stack.Screen name='Multi' component={Multi} options={{ headerShown: true }} />

            </Stack.Navigator>
        </NavigationContainer>
    )
}


export default AppNavigator;
