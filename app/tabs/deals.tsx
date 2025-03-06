import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  StatusBar,
  SafeAreaView,
  Dimensions,
  TouchableOpacity
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';

const { width } = Dimensions.get('window');

const DealsScreen = () => {
  return (
    <View style={styles.rootContainer}>
      {/* Curved Background */}
      <View style={styles.bgContainer}>
        {/*Create the combination of Gradient color*/}
        <LinearGradient
          colors={['#821E26', '#C3485D', '#821E26']}
          style={styles.gradient}
        >
          {/*This SVG path creates a curve that smoothly transitions from the colored header to the white content area.*/}
          <Svg
            height={40}
            width={width}
            style={styles.curvedEdge}
            viewBox={`0 0 ${width} 40`}
          >
            <Path
              d={`M0 0 L${width} 0 L${width} 30 Q${width/2} 60 0 30 Z`}
              fill="white"
            />
          </Svg>
        </LinearGradient>
      </View>

      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#821E26" />

        <View style={styles.header}>
          <Text style={styles.headerTitle}>Deals</Text>
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="options-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.contentBox}>
            <Text style={styles.contentTitle}>Special Offers</Text>
            <Text style={styles.contentText}>Check back soon for special travel deals!</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default DealsScreen;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  //absolute positioning for the background container and stacks other elements on top of it
  bgContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 200, // Adjust to 200 to make it pretty <3
  },
  gradient: {
    flex: 1,
    width: '100%',
  },
  curvedEdge: {
    position: 'absolute',
    bottom: 0,
  },
  container: {
    flex: 1,
    paddingTop: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  contentBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  contentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  contentText: {
    fontSize: 14,
    color: '#666',
  },
});