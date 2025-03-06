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
  FlatList,
  Dimensions,
  SafeAreaView,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AttractionDetailScreen from './AttractionDetailScreen';

const { width, height } = Dimensions.get('window');

// Define props for AttractionScreen
interface AttractionScreenProps {
  goBack: () => void;
}

interface CategoryFilterProps {
  title: string;
  isActive: boolean;
  onPress: () => void;
}

interface AttractionData {
  id: number;
  title: string;
  location: string;
  rating: number;
  price?: number;
  numberOfReviews: number;
  category: string;
  imageUrl?: string;  // Add imageUrl field
  description?: string;
  openingHours?: string;
  duration?: string;
  highlights?: string[];
  includes?: string[];
  excludes?: string[];
}

interface AttractionCardProps {
  title: string;
  location: string;
  rating: number;
  price?: number;
  numberOfReviews: number;
  imageUrl?: string;  // Add imageUrl prop
  onPress: () => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ title, isActive, onPress }) => {
  return (
    <TouchableOpacity 
      style={[
        styles.filterChip,
        isActive && styles.activeFilterChip,
      ]}
      onPress={onPress}
    >
      <Text style={[
        styles.filterChipText,
        isActive && styles.activeFilterChipText,
      ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

// A component to handle image loading and errors
const AttractionImage = ({ imageUrl }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  if (!imageUrl) {
    return (
      <View style={styles.placeholderImage}>
        <Ionicons name="image-outline" size={32} color="#CCC" />
      </View>
    );
  }

  return (
    <View style={styles.attractionImage}>
      {isLoading && (
        <View style={[styles.placeholderImage, { position: 'absolute', zIndex: 1 }]}>
          <ActivityIndicator size="small" color="#821E26" />
        </View>
      )}
      {hasError ? (
        <View style={styles.placeholderImage}>
          <Ionicons name="alert-circle-outline" size={32} color="#CCC" />
        </View>
      ) : (
        <Image 
          source={{ uri: imageUrl }}
          style={{ width: '100%', height: '100%', borderRadius: 8 }}
          onLoadStart={() => setIsLoading(true)}
          onLoadEnd={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
        />
      )}
    </View>
  );
};

const AttractionCard: React.FC<AttractionCardProps> = ({ 
  title, 
  location, 
  rating,
  price,
  numberOfReviews,
  imageUrl,  // Add imageUrl prop
  onPress 
}) => {
  return (
    <TouchableOpacity style={styles.attractionCard} onPress={onPress}>
      {/* Use AttractionImage component with imageUrl */}
      <AttractionImage imageUrl={imageUrl} />
      <View style={styles.attractionDetails}>
        <Text style={styles.attractionTitle}>{title}</Text>
        <Text style={styles.attractionLocation}>
          <Ionicons name="location-outline" size={12} color="#666" />
          {' '}{location}
        </Text>
        <View style={styles.ratingRow}>
          <View style={styles.ratingBadge}>
            <Text style={styles.ratingBadgeText}>{rating}</Text>
          </View>
          <Text style={styles.reviewsText}>{numberOfReviews} reviews</Text>
        </View>
        {price && (
          <Text style={styles.priceText}>
            From <Text style={styles.priceBold}>${price}</Text>/person
          </Text>
        )}
      </View>
      <TouchableOpacity style={styles.favoriteButton}>
        <Ionicons name="heart-outline" size={22} color="#821E26" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const AttractionScreen: React.FC<AttractionScreenProps> = ({ goBack }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedAttraction, setSelectedAttraction] = useState<AttractionData | null>(null);

  const filters = [
    'All', 'Nature', 'Beach', 'Culture', 'Adventure', 'Playground', 'Shopping'
  ];

  const attractions: AttractionData[] = [
    {
      id: 1,
      title: "Singapore Zoo",
      location: "Singapore",
      rating: 4.9,
      price: 40,
      numberOfReviews: 412,
      category: "Nature",
      imageUrl: "https://i.imgur.com/N8dhs4i.jpeg", // Singapore Zoo Image link
      description: "Get up close and personal with the animal kingdom at the award-winning Singapore Zoo. This 26-hectare wildlife park, nestled within the lush Mandai rainforest, is home to over 2,400 animals from 300 species.",
      openingHours: "8:30 AM - 6:00 PM | Daily",
      duration: "3-4 hours",
      highlights: [
        "See over 2,400 animals in naturalistic habitats",
        "Watch the famous Orangutan free-ranging exhibit",
        "Enjoy the award-winning 'breakfast with orangutans' program",
        "Hop on the guided tram for an educational ride through the zoo",
        "Experience animal feeding sessions throughout the day"
      ],
      includes: [
        "Zoo admission ticket",
        "Access to all exhibits and shows",
        "Free-ranging tram rides"
      ],
      excludes: [
        "Hotel transfers",
        "Food and beverages",
        "Optional experiences",
        "Breakfast with orangutans (separate ticket required)"
      ]
    },
    {
      id: 2,
      title: "Adventure Cove Waterpark",
      location: "Singapore",
      rating: 4.7,
      price: 30,
      numberOfReviews: 328,
      category: "Adventure",
      imageUrl: "https://i.imgur.com/8pRbLcc.jpeg", // image for Adventure Cove SG
    },
    {
      id: 3,
      title: "Singapore Beach City Cycling Tour",
      location: "Singapore",
      rating: 4.8,
      price: 85,
      numberOfReviews: 276,
      category: "Beach",
      imageUrl: "https://i.imgur.com/i8EBOYO.jpeg", // image for singapore beach
    },
    {
      id: 4,
      title: "National Gallery Singapore",
      location: "Singapore",
      rating: 4.8,
      price: 20,
      numberOfReviews: 301,
      category: "Culture",
      imageUrl: "https://i.imgur.com/JMnlVW7.jpeg", // image for SG nation museum
    },
  ];

  const filteredAttractions = activeFilter === 'All' 
    ? attractions 
    : attractions.filter(item => item.category === activeFilter);

    //for data handling
  const handleAttractionPress = (attraction: AttractionData) => {
    // Set the selected attraction to show the detail screen
    setSelectedAttraction(attraction);
  };

  // If an attraction is selected, show the detail screen
  if (selectedAttraction) {
    return (
      <AttractionDetailScreen 
        route={{ params: { attraction: selectedAttraction } }} 
        goBack={() => setSelectedAttraction(null)} 
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Gradient Background */}
      <LinearGradient
        colors={['#821E26', '#C3485D']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={goBack}
          >
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Attractions</Text>
          <TouchableOpacity style={styles.mapButton}>
            <Ionicons name="map-outline" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Search Input */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#666" />
          <TextInput 
            style={styles.searchInput}
            placeholder="Search attractions"
            value={searchQuery} //for storing the search input text
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
        </View>
      </LinearGradient>

      {/* Filter Categories */}
      <View style={styles.filterContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {filters.map((filter) => (
            <CategoryFilter 
              key={filter}
              title={filter}
              isActive={activeFilter === filter}
              onPress={() => setActiveFilter(filter)}
            />
          ))}
        </ScrollView>
      </View>

      {/* Attractions List with FlatList component */}
      <FlatList
        data={filteredAttractions}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.attractionsContainer}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <AttractionCard
            title={item.title}
            location={item.location}
            rating={item.rating}
            price={item.price}
            numberOfReviews={item.numberOfReviews}
            imageUrl={item.imageUrl}  // Pass the imageUrl with imgur link
            onPress={() => handleAttractionPress(item)}
          />
        )}
        ListFooterComponent={<View style={styles.listFooter} />}
      />
    </SafeAreaView>
  );
};

export default AttractionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  header: {
    paddingTop: 40,
    paddingBottom: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  mapButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  filterContainer: {
    marginTop: 16,
  },
  filterScroll: {
    paddingHorizontal: 16,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#F0F0F0',
  },
  activeFilterChip: {
    backgroundColor: '#821E26',
  },
  filterChipText: {
    color: '#555',
    fontSize: 14,
    fontWeight: '500',
  },
  activeFilterChipText: {
    color: '#FFFFFF',
  },
  attractionsContainer: {
    padding: 16,
  },
  attractionCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 3,
    elevation: 2,
    padding: 12,
  },
  attractionImage: {
    width: 90,
    height: 90,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  attractionDetails: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  attractionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  attractionLocation: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingBadge: {
    backgroundColor: '#FFD700',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 8,
  },
  ratingBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  reviewsText: {
    fontSize: 12,
    color: '#666',
  },
  priceText: {
    fontSize: 13,
    color: '#666',
  },
  priceBold: {
    fontWeight: 'bold',
    color: '#333',
  },
  favoriteButton: {
    padding: 8,
  },
  listFooter: {
    height: 80,
  },
});