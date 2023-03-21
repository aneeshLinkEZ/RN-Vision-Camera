import React from 'react';
import { View, StyleSheet } from 'react-native'
import { Button, Text } from '@rneui/base'


function Home({navigation}){

    return(
        <View style={styles.mainView}>
            <Text h3>
                Home
            </Text>
            <Button title={'Counter'} onPress={() => navigation.navigate('Counter')}/>
            <Button title={'Camera'} onPress={() => navigation.navigate('Camera')}/>
            <Button title={'Bluetooth'} onPress={() => navigation.navigate('Bluetooth')}/>
            <Button title={'blePlxBluetooth'} onPress={() => navigation.navigate('blePlxBluetooth')}/>


        </View>
    )
}

const styles = StyleSheet.create({
    mainView:  {
        flex: 1,
        justifyContent: 'center',
        margin: 10,
        alignItems: 'center'
    }
})

export default Home;