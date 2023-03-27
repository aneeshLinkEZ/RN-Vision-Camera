import React from 'react';
import { View, StyleSheet } from 'react-native'
import { Button, Text } from '@rneui/base'
import { useAppSelector, useAppDispatch } from '../../hooks'
import { setIncrement, setDecrement } from '../../slices/counter/counter';


function Counter ({navigation}){
    const number = useAppSelector(state => state.counder.counter)    

    const dispatch = useAppDispatch()

    const increase=()=>{
        let num = number+1
        dispatch(setIncrement(num))
        }

    const decrease=()=>{
        let num = number-1
        dispatch(setDecrement(num))
    }

    return (
        <View style={styles.mainView}>
            <Text h3>
                Counter
            </Text>
            <Button title={'+'} onPress={() => increase()}/>
            <Text h2>{number}</Text>
            <Button title={'-'} onPress={() => decrease()}/>
            <Button title={'Home'} onPress={() => navigation.navigate('Home')} buttonStyle={{marginTop: 100}}/>
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

export default Counter;