import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView, 
  StatusBar,
  Image,
  SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CategoryItem = ({ icon, label, onPress, isActive }) => {
  return (
    <TouchableOpacity 
      style={[styles.categoryItem, isActive && styles.categoryItemActive]} 
      onPress={onPress}
    >
      <View style={[styles.iconContainer, isActive && styles.iconContainerActive]}>
        <Ionicons name={icon} size={24} color={isActive ? "#fff" : "#821E26"} />
      </View>
      <Text style={[styles.categoryLabel, isActive && styles.categoryLabelActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const DashboardScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('ferry');

  const categories = [
    { id: 'ferry', icon: 'boat-outline', label: 'Ferry' },
    { id: 'hotel', icon: 'bed-outline', label: 'Hotel' },
    { id: 'car', icon: 'car-outline', label: 'Car Rental' },
    { id: 'attractions', icon: 'compass-outline', label: 'Attractions' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, Traveler!</Text>
          <Text style={styles.subGreeting}>Where would you like to go?</Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications-outline" size={24} color="#821E26" />
        </TouchableOpacity>
      </View>
      
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search destinations, hotels..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#999"
        />
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="options-outline" size={20} color="#821E26" />
        </TouchableOpacity>
      </View>
      
      {/* Categories */}
      <View style={styles.categoriesContainer}>
        <Text style={styles.sectionTitle}>Travel Options</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
          {categories.map((category) => (
            <CategoryItem
              key={category.id}
              icon={category.icon}
              label={category.label}
              isActive={activeCategory === category.id}
              onPress={() => setActiveCategory(category.id)}
            />
          ))}
        </ScrollView>
      </View>
      
      {/* Featured Section */}
      <View style={styles.featuredContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Deals</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.featuredScroll}
        >
          {/* This would be replaced with actual data */}
          {[1, 2, 3].map((item) => (
            <TouchableOpacity key={item} style={styles.featuredItem}>
              <View style={styles.featuredImageContainer}>
                {/* Placeholder for image */}
                <View style={styles.featuredImagePlaceholder}>
                  <Ionicons name="image-outline" size={30} color="#DEC0C3" />
                </View>
                <View style={styles.featuredBadge}>
                  <Text style={styles.featuredBadgeText}>20% OFF</Text>
                </View>
              </View>
              <View style={styles.featuredContent}>
                <Text style={styles.featuredTitle}>Destination {item}</Text>
                <View style={styles.featuredMeta}>
                  <Ionicons name="location-outline" size={14} color="#666" />
                  <Text style={styles.featuredLocation}>Location {item}</Text>
                </View>
                <View style={styles.featuredPrice}>
                  <Text style={styles.featuredPriceValue}>$199</Text>
                  <Text style={styles.featuredPriceLabel}>/person</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      {/* Popular Destinations */}
      <View style={styles.popularContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Popular Destinations</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.popularScroll}
        >
          {/* This would be replaced with actual data */}
          {[1, 2, 3, 4].map((item) => (
            <TouchableOpacity key={item} style={styles.popularItem}>
              <View style={styles.popularImagePlaceholder}>
                <Ionicons name="image-outline" size={20} color="#DEC0C3" />
              </View>
              <Text style={styles.popularTitle}>City {item}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
    </SafeAreaView>
  );
};

export default DashboardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
  },
  greeting: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#262628',
  },
  subGreeting: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    marginHorizontal: 20,
    paddingHorizontal: 15,
    height: 50,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#333',
  },
  filterButton: {
    width: 35,
    height: 35,
    backgroundColor: '#eee',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoriesContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#262628',
    marginHorizontal: 20,
    marginBottom: 15,
  },
  categoriesScroll: {
    paddingLeft: 15,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 15,
    width: 80,
  },
  categoryItemActive: {
    // Active state styling
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconContainerActive: {
    backgroundColor: '#821E26',
  },
  categoryLabel: {
    fontSize: 14,
    color: '#444',
    textAlign: 'center',
  },
  categoryLabelActive: {
    color: '#821E26',
    fontWeight: 'bold',
  },
  featuredContainer: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 15,
  },
  seeAllText: {
    fontSize: 14,
    color: '#821E26',
    fontWeight: '600',
  },
  featuredScroll: {
    paddingLeft: 20,
  },
  featuredItem: {
    width: 250,
    backgroundColor: '#fff',
    borderRadius: 15,
    marginRight: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  featuredImageContainer: {
    position: 'relative',
  },
  featuredImagePlaceholder: {
    height: 150,
    backgroundColor: '#f9f9f9',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featuredBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#821E26',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  featuredBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  featuredContent: {
    padding: 15,
  },
  featuredTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#262628',
    marginBottom: 5,
  },
  featuredMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featuredLocation: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  featuredPrice: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  featuredPriceValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#821E26',
  },
  featuredPriceLabel: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  popularContainer: {
    marginBottom: 20,
  },
  popularScroll: {
    paddingLeft: 20,
  },
  popularItem: {
    width: 100,
    marginRight: 15,
    alignItems: 'center',
  },
  popularImagePlaceholder: {
    width: 80,
    height: 80,
    backgroundColor: '#f9f9f9',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  popularTitle: {
    fontSize: 14,
    color: '#444',
    textAlign: 'center',
  },
});