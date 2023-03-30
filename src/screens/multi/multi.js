import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import MATSButton from '../../components/MATSButton/MATSButton'
import BlePlxBluetooth1 from '../../nativeApi/bluetooth/blePlxBluetooth1'
import BlePlxBluetooth2 from '../../nativeApi/bluetooth/blePlxBluetooth2'

const Multi = ({ navigator }) => {
    return (
        <SafeAreaView style={{flex:1}}>
            <BlePlxBluetooth1 />
            <BlePlxBluetooth2 />
        </SafeAreaView>
    )
}

export default Multi

const styles = StyleSheet.create({})