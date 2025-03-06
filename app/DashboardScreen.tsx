import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  StatusBar,
  Image,
  SafeAreaView,
  ImageBackground,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

// Define props for DashboardScreen
interface DashboardScreenProps {
  navigateTo: (screenName: string) => void;
}

const CategoryButton = ({ icon, label, onPress }) => {
  const [isPressed, setIsPressed] = useState(false);

  // Reset the pressed state after a brief period
  useEffect(() => {
    let timer;
    if (isPressed) {
      timer = setTimeout(() => {
        setIsPressed(false);
      }, 300); // Show pressed state for 300ms
    }
    return () => clearTimeout(timer);
  }, [isPressed]);

  const handlePress = () => {
    setIsPressed(true);
    onPress();
  };

  return (
    <TouchableOpacity 
      style={styles.categoryButton} 
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={[
        styles.categoryIconContainer, 
        isPressed && { backgroundColor: '#DEC0C3' }
      ]}>
        <Ionicons 
          name={icon} 
          size={24} 
          color="#FFFFFF" 
        />
      </View>
      <Text style={[
        styles.categoryLabel, 
        isPressed && { color: '#821E26', fontWeight: '600' }
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const DestinationCard = ({ image, title, location, rating, price, duration }) => {
  return (
    <View style={styles.destinationCard}>
      <ImageBackground 
        source={image ? image : require('../assets/images/PlanTravel.png')}
        style={styles.destinationImage}
        imageStyle={{ borderRadius: 12 }}
      >
        <View style={styles.durationBadge}>
          <Text style={styles.durationText}>{duration}</Text>
        </View>
      </ImageBackground>
      <Text style={styles.destinationTitle}>{title}</Text>
      <Text style={styles.destinationLocation}>{location}</Text>
      <View style={styles.ratingContainer}>
        <Ionicons name="star" size={16} color="#FFD700" />
        <Text style={styles.ratingText}>{rating}</Text>
      </View>
      <View style={styles.priceRow}>
        <Text style={styles.priceLabel}>Start from</Text>
        <Text style={styles.priceValue}>$ {price}/pax</Text>
      </View>
    </View>
  );
};

const HotelCard = ({ image, name, location, rating }) => {
  return (
    <View style={styles.hotelCard}>
      <Image 
        source={image ? image : require('../assets/images/PlanTravel.png')}
        style={styles.hotelImage}
      />
      <View style={styles.hotelInfo}>
        <Text style={styles.hotelName}>{name}</Text>
        <Text style={styles.hotelLocation}>{location}</Text>
        <View style={styles.hotelRating}>
          <Ionicons name="star" size={14} color="#FFD700" />
          <Text style={styles.hotelRatingText}>{rating} star hotel</Text>
        </View>
      </View>
    </View>
  );
};

// Ferry Booking Info Card Component
const FerryBookingCard = () => {
  return (
    <View style={styles.ferryCard}>
      <View style={styles.ferryCardHeader}>
        <View style={styles.upcomingBadge}>
          <Text style={styles.upcomingText}>Upcoming</Text>
        </View>
        <Text style={styles.ferryDate}>7 March 2025</Text>
      </View>

      <View style={styles.ferryDetails}>
        <View style={styles.ferryLocation}>
          <Text style={styles.portCode}>Singapore</Text>
          <Text style={styles.portTime}>12:30</Text>
        </View>
        
        <View style={styles.ferryPath}>
          <View style={styles.ferryDuration}>
            <Text style={styles.durationText}>1h 30m</Text>
          </View>
          <View style={styles.ferryLine}></View>
          <Ionicons name="boat" size={20} color="#821E26" style={styles.boatIcon} />
        </View>
        
        <View style={styles.ferryLocation}>
          <Text style={styles.portCode}>Batam</Text>
          <Text style={styles.portTime}>13:30</Text>
        </View>
      </View>
      
      <View style={styles.ferryInfo}>
        <Text style={styles.ferryInfoText}>Majestic Ferry • Economy • Direct</Text>
      </View>
      
      <View style={styles.bookingInfo}>
        <Text style={styles.bookingLabel}>Booking ID</Text>
        <Text style={styles.bookingValue}>HAIYAH</Text>
      </View>
    </View>
  );
};

const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigateTo }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleCategoryPress = (categoryId) => {
    console.log(`${categoryId} button pressed`);
    
    if (categoryId === 'Attractions') {
      // Navigate to the Attractions screen
      navigateTo('attraction');
    } else if (categoryId === 'Ferry') {
      // Navigation for other categories (to be implemented)
      console.log('Ferry navigation will be implemented soon');
    } else if (categoryId === 'Hotels') {
      console.log('Hotels navigation will be implemented soon');
    } else if (categoryId === 'CarRental') {
      console.log('Car Rental navigation will be implemented soon');
    }
  };

  const categories = [
    { id: 'Ferry', icon: 'boat-outline', label: 'Ferry' },
    { id: 'Hotels', icon: 'bed-outline', label: 'Hotels' },
    { id: 'CarRental', icon: 'car-outline', label: 'Car Rental' },
    { id: 'Attractions', icon: 'compass-outline', label: 'Attractions' },
  ];

  const destinations = [
    { 
      id: 1, 
      title: 'Singapore Zoo', 
      location: 'Singapore', 
      rating: 4.9, 
      price: 40, 
      duration: '3D2N' 
    },
    { 
      id: 2, 
      title: 'Singapore National Museum', 
      location: 'Singapore', 
      rating: 4.8, 
      price: 20, 
      duration: '3D2N' 
    },
    { 
      id: 3, 
      title: 'Resort world Sentosa', 
      location: 'SIngapore', 
      rating: 4.8, 
      price: 50, 
      duration: '3D2N' 
    },
  ];

  const hotels = [
    {
      id: 1,
      name: 'Marina Bay Sands',
      location: 'Singapore',
      rating: 5, //rating of what stars hotel
    }
  ];

  return (
    <View style={styles.rootContainer}>
      {/* Layered Curves Background */}
      <View style={styles.bgContainer}>
        <LinearGradient
          colors={['#821E26', '#C3485D', '#821E26']}
          style={styles.gradient}
        >
          <Svg height={280} width={width} style={styles.curveSvg}>
            {/* First Layer Curve - More Subtle */}
            <Path
              d={`M0 140
                  Q${width / 4} 180 ${width / 2} 140
                  Q${width * 3/4} 100 ${width} 140
                  L${width} 280 L0 280 Z`}
              fill="rgba(255, 255, 255, 0.15)"
            />
            
            {/* Second Layer Curve - Medium Opacity */}
            <Path
              d={`M0 180
                  Q${width / 3} 150 ${width * 2/3} 190
                  Q${width * 5/6} 210 ${width} 170
                  L${width} 280 L0 280 Z`}
              fill="rgba(255, 255, 255, 0.3)"
            />
            
            {/* Third Layer Curve - Solid White (Main Content Background) */}
            <Path
              d={`M0 220
                  Q${width / 2} 260 ${width} 200
                  L${width} 280 L0 280 Z`}
              fill="white"
            />
          </Svg>
        </LinearGradient>
      </View>
      
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#821E26" />
        
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hi, Paul</Text>
            {/* Removed points container and medal icon */}
          </View>
          <TouchableOpacity style={styles.avatarContainer}>
            <Image 
              source={require('../assets/images/PlanTravel.png')} 
              style={styles.avatar} 
            />
          </TouchableOpacity>
        </View>
        
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
        </View>
        
        <FerryBookingCard />
        
        <ScrollView 
          style={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.categoriesContainer}>
            <View style={styles.categoriesRow}>
              {categories.map((category) => (
                <CategoryButton
                  key={category.id}
                  icon={category.icon}
                  label={category.label}
                  onPress={() => handleCategoryPress(category.id)}
                />
              ))}
            </View>
          </View>
          
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Attractions nears you 📍</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>See all</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.destinationsContainer}
            >
              {destinations.map((destination) => (
                <DestinationCard
                  key={destination.id}
                  title={destination.title}
                  location={destination.location}
                  rating={destination.rating}
                  price={destination.price}
                  duration={destination.duration}
                />
              ))}
            </ScrollView>
          </View>
          
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Hotels recommendation for you 🏨</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>See all</Text>
              </TouchableOpacity>
            </View>
            
            {hotels.map((hotel) => (
              <HotelCard
                key={hotel.id}
                name={hotel.name}
                location={hotel.location}
                rating={hotel.rating}
              />
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default DashboardScreen;

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
    height: 280, // Height for layered curves
  },
  gradient: {
    flex: 1,
    width: '100%',
  },
  curveSvg: {
    position: 'absolute',
    top: 0,
    left: 0,
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
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#fff',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 16,
    marginTop: 0,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  ferryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  ferryCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  upcomingBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  upcomingText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  ferryDate: {
    fontSize: 14,
    color: '#666',
  },
  ferryDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  ferryLocation: {
    alignItems: 'center',
  },
  portCode: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  portTime: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  ferryPath: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    paddingHorizontal: 10,
  },
  ferryDuration: {
    position: 'absolute',
    top: -10,
  },
  durationText: {
    fontSize: 12,
    color: '#666',
  },
  ferryLine: {
    width: '100%',
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 10,
  },
  boatIcon: {
    position: 'absolute',
  },
  ferryInfo: {
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
    marginBottom: 12,
  },
  ferryInfoText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  bookingInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bookingLabel: {
    fontSize: 14,
    color: '#666',
  },
  bookingValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  contentContainer: {
    flex: 1,
  },
  categoriesContainer: {
    marginTop: 10,
    marginBottom: 20,
  },
  categoriesRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    justifyContent: 'space-evenly',
    width: '100%',
  },
  categoryButton: {
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  categoryIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#821E26',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryLabel: {
    fontSize: 13,
    color: '#666',
  },
  sectionContainer: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAllText: {
    fontSize: 14,
    color: '#821E26',
  },
  destinationsContainer: {
    paddingRight: 16,
  },
  destinationCard: {
    width: 150,
    marginRight: 16,
  },
  destinationImage: {
    height: 120,
    borderRadius: 12,
    marginBottom: 8,
    justifyContent: 'flex-end',
    padding: 8,
  },
  durationBadge: {
    backgroundColor: '#821E26',
    alignSelf: 'flex-end',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  durationText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  destinationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  destinationLocation: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  ratingText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 12,
    color: '#666',
  },
  priceValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  hotelCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  hotelImage: {
    width: 80,
    height: 80,
  },
  hotelInfo: {
    flex: 1,
    padding: 12,
  },
  hotelName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  hotelLocation: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  hotelRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hotelRatingText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
});