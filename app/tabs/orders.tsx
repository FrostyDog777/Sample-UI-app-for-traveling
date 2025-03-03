import {StyleSheet, Text, View} from 'react-native'
import React from 'react'

const OrdersScreen =  () => {
    return (
        <View style={styles.container}>
            <Text>orders</Text>
        </View>
    )
}

export default OrdersScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems:'center',
    }
})