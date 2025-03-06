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

const OrderCard = ({ type, date, destination, status }) => {
  return (
    <TouchableOpacity style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <View style={styles.orderType}>
          <Ionicons
            name={
              type === 'ferry' ? 'boat-outline' : 
              type === 'hotel' ? 'bed-outline' :
              type === 'car' ? 'car-outline' : 'compass-outline'
            } 
            size={20} 
            color="#821E26" 
          />
          <Text style={styles.orderTypeText}>
            {type === 'ferry' ? 'Ferry Booking' :
              type === 'hotel' ? 'Hotel Booking' :
              type === 'car' ? 'Car Rental' : 'Attraction'}
          </Text>
        </View>
        <View style={[
          styles.statusBadge, 
          { backgroundColor: 
            status === 'confirmed' ? '#4CAF50' : 
            status === 'pending' ? '#FFC107' : '#F44336' 
          }
        ]}>
          <Text style={styles.statusText}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Text>
        </View>
      </View>
      
      <View style={styles.orderDetails}>
        <Text style={styles.orderDate}>{date}</Text>
        <Text style={styles.orderDestination}>{destination}</Text>
      </View>
      
      <View style={styles.orderFooter}>
        <TouchableOpacity style={styles.viewButton}>
          <Text style={styles.viewButtonText}>View Details</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const OrdersScreen = () => {
  // Sample order data
  const orders = [
    {
      id: 1,
      type: 'ferry',
      date: '7 March 2024',
      destination: 'SG - BTM',
      status: 'confirmed'
    },
    {
      id: 2,
      type: 'hotel',
      date: '25-27 March 2024',
      destination: 'Marina Bay Sands',
      status: 'pending'
    },
  ];

  return (
    <View style={styles.rootContainer}>
      {/* Curved Background */}
      <View style={styles.bgContainer}>
        <LinearGradient
          colors={['#821E26', '#C3485D', '#821E26']}
          style={styles.gradient}
        >
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
          <Text style={styles.headerTitle}>My Orders</Text>
          <TouchableOpacity style={styles.searchButton}>
            <Ionicons name="search" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        
        <ScrollView 
          style={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.filterContainer}>
            <TouchableOpacity style={[styles.filterButton, styles.filterButtonActive]}>
              <Text style={styles.filterButtonTextActive}>All</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterButton}>
              <Text style={styles.filterButtonText}>Upcoming</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterButton}>
              <Text style={styles.filterButtonText}>Completed</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterButton}>
              <Text style={styles.filterButtonText}>Canceled</Text>
            </TouchableOpacity>
          </View>
          
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              type={order.type}
              date={order.date}
              destination={order.destination}
              status={order.status}
            />
          ))}
          {/* if there is no order available*/}
          {orders.length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons name="receipt-outline" size={60} color="#ccc" />
              <Text style={styles.emptyStateText}>No orders yet</Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default OrdersScreen;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  bgContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 200, // Adjust as needed
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
  searchButton: {
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
    paddingTop: 10,
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    justifyContent: 'space-between',
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  filterButtonActive: {
    backgroundColor: '#821E26',
  },
  filterButtonText: {
    color: '#666',
    fontSize: 14,
  },
  filterButtonTextActive: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  orderCard: {
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
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderType: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderTypeText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  orderDetails: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  orderDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  orderDestination: {
    fontSize: 16,
    color: '#333',
  },
  orderFooter: {
    alignItems: 'flex-end',
  },
  viewButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  viewButtonText: {
    color: '#821E26',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
});