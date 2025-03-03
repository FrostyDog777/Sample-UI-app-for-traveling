import {StyleSheet, Text, View} from 'react-native'
import React from 'react'

const DealsScreen =  () => {
    return (
        <View style={styles.container}>
            <Text>deals</Text>
        </View>
    )
}

export default DealsScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems:'center',
    }
})