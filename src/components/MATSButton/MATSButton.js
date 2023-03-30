import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Button } from '@rneui/base'
import MATSText from '../MATSText.js/MATSText'
import BlePlxBluetooth from '../../nativeApi/bluetooth/blePlxBluetooth1'

const MATSButton = () => {
  return (
    <View>
      <Button title={"MATSButton"}/>
    </View>
  )
}

export default MATSButton

const styles = StyleSheet.create({})