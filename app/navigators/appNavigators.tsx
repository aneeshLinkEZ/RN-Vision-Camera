import React from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from "../screens/Home/home";
import Counter from "../screens/counter/counter";
import Camera from "../screens/Camera/Camera";
import ViewGallary from "../screens/gallary/gallary";
import blePlxBluetooth from "../screens/bluetooth/blePlxBluetooth";
import FileSystemHandle from "../screens/fileSystem/fileSystem";
const Stack = createNativeStackNavigator();

function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name='Home' component={Home} options={{ headerShown: false }} />
                <Stack.Screen name='Counter' component={Counter} options={{ headerShown: false }} />
                <Stack.Screen name='Camera' component={Camera} options={{ headerShown: false }} />
                <Stack.Screen name='ViewGallary' component={ViewGallary} options={{ headerShown: true }} />
                <Stack.Screen name='blePlxBluetooth' component={blePlxBluetooth} options={{ headerShown: true }} />
                <Stack.Screen name='FileSystemHandle' component={FileSystemHandle} options={{ headerShown: true }} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}


export default AppNavigator;
