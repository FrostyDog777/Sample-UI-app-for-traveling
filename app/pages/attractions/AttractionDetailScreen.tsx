import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  Dimensions,
  SafeAreaView,
  StatusBar,
  Modal,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import CreditCardPaymentForm from './CreditCardPaymentForm'; //import from credit card form page

const { width, height } = Dimensions.get('window');

// For standalone usage, we'll create a simple cart without Context
interface CartItem {
  id: string;
  attractionId: number;
  title: string;
  date: string;
  adultTickets: number;
  childTickets: number;
  adultPrice: number;
  childPrice: number;
  totalPrice: number;
}

interface AttractionDetailScreenProps {
  route?: { params: { attraction: any } };
  goBack: () => void;
}

interface ReviewProps {
  name: string;
  rating: number;
  date: string;
  comment: string;
}

// Payment Method interface
interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
}

const ImageGallery = ({ images }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  // State to track if images are loading or have errors
  const [imageStates, setImageStates] = useState([
    { loading: true, error: false },
    { loading: true, error: false },
    { loading: true, error: false },
    { loading: true, error: false }
  ]);

  // Direct image URLs for Singapore Zoo from Imgur
  const zooImages = [
    'https://i.imgur.com/N8dhs4i.jpeg',
    'https://i.imgur.com/xeG4hPf.jpeg',
    'https://i.imgur.com/gbMpsGx.jpeg',
    'https://i.imgur.com/uxgVJX8.jpeg'
  ];

  // Update image state (loading or error)
  const updateImageState = (index, update) => {
    setImageStates(prevStates => {
      const newStates = [...prevStates];
      newStates[index] = { ...newStates[index], ...update };
      return newStates;
    });
  };

  // Image component with loading and error handling
  const GalleryImage = ({ index }) => {
    const state = imageStates[index];
    
    return (
      <View style={styles.galleryImage}>
        {state.loading && (
          <View style={[styles.galleryImage, { position: 'absolute', backgroundColor: '#E8F4F8' }]}>
            <Ionicons name="image-outline" size={32} color="#AAA" />
          </View>
        )}
        {state.error ? (
          <View style={[styles.galleryImage, { backgroundColor: '#F8F0F0' }]}>
            <Ionicons name="alert-circle-outline" size={32} color="#999" />
          </View>
        ) : (
          <Image 
            source={{ uri: zooImages[index] }}
            style={{width: '100%', height: '100%'}}
            resizeMode="cover"
            onLoadStart={() => updateImageState(index, { loading: true })}
            onLoadEnd={() => updateImageState(index, { loading: false })}
            onError={() => updateImageState(index, { loading: false, error: true })}
          />
        )}
      </View>
    );
  };

  return (
    <View style={styles.galleryContainer}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
          setActiveIndex(newIndex);
        }}
      >
        {zooImages.map((_, index) => (
          <GalleryImage key={index} index={index} />
        ))}
      </ScrollView>
      
      <View style={styles.paginationDots}>
        {zooImages.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              { backgroundColor: index === activeIndex ? '#821E26' : '#ccc' }
            ]}
          />
        ))}
      </View>
      
      <View style={styles.imageCounter}>
        <Text style={styles.imageCounterText}>
          {activeIndex + 1}/{zooImages.length}
        </Text>
      </View>
    </View>
  );
};

const Review: React.FC<ReviewProps> = ({ name, rating, date, comment }) => {
  return (
    <View style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <View style={styles.reviewUser}>
          <View style={styles.reviewAvatar}>
            <Text style={styles.reviewAvatarText}>{name.charAt(0)}</Text>
          </View>
          <View>
            <Text style={styles.reviewName}>{name}</Text>
            <Text style={styles.reviewDate}>{date}</Text>
          </View>
        </View>
        <View style={styles.reviewRating}>
          <Text style={styles.reviewRatingValue}>{rating}</Text>
          <Ionicons name="star" size={14} color="#FFD700" />
        </View>
      </View>
      <Text style={styles.reviewComment}>{comment}</Text>
    </View>
  );
};

// Payment Method Card Component
const PaymentMethodCard = ({ method, isSelected, onSelect }) => {
  return (
    <TouchableOpacity
      style={[
        styles.paymentMethodCard,
        isSelected && styles.selectedPaymentMethodCard
      ]}
      onPress={() => onSelect(method.id)}
    >
      <View style={styles.paymentMethodContent}>
        <View style={styles.paymentMethodIconContainer}>
          {method.icon}
        </View>
        <Text style={styles.paymentMethodName}>
          {method.name}
        </Text>
      </View>
      
      {isSelected && (
        <View style={styles.checkmarkContainer}>
          <Ionicons name="checkmark-circle" size={20} color="#821E26" />
        </View>
      )}
    </TouchableOpacity>
  );
};

// Cart Item Component (for the checkout modal)
const CartItem = ({ item, onRemove }) => {
  return (
    <View style={styles.cartItem}>
      <View style={styles.cartItemInfo}>
        <Text style={styles.cartItemTitle}>{item.title}</Text>
        <Text style={styles.cartItemDetails}>
          Date: {item.date}, {item.adultTickets > 0 && `${item.adultTickets} Adult${item.adultTickets > 1 ? 's' : ''}`} 
          {item.childTickets > 0 && item.adultTickets > 0 && ', '}
          {item.childTickets > 0 && `${item.childTickets} Child${item.childTickets > 1 ? 'ren' : ''}`}
        </Text>
      </View>
      <View style={styles.cartItemPriceRow}>
        <Text style={styles.cartItemPrice}>${item.totalPrice}</Text>
        <TouchableOpacity onPress={() => onRemove(item.id)} style={styles.removeButton}>
          <Ionicons name="close-circle" size={22} color="#F44336" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const AttractionDetailScreen: React.FC<AttractionDetailScreenProps> = ({ route, goBack }) => {
  // Local cart state for standalone use
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isWishlisted, setIsWishlisted] = useState(false);
  
  const [selectedDate, setSelectedDate] = useState(null);
  const [adultTickets, setAdultTickets] = useState(1);
  const [childTickets, setChildTickets] = useState(0);
  
  // Checkout state
  const [checkoutModalVisible, setCheckoutModalVisible] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  
  // Credit card payment form state
  const [creditCardModalVisible, setCreditCardModalVisible] = useState(false);

  // Available payment methods with custom icons and colors
  const paymentMethods: PaymentMethod[] = [
    { 
      id: 'credit-card', 
      name: 'Credit Card', 
      icon: (
        <View style={styles.creditCardIcon}>
          <View style={[styles.ccCircle, {backgroundColor: '#EB001B'}]} />
          <View style={[styles.ccCircle, {backgroundColor: '#F79E1B', marginLeft: -8}]} />
        </View>
      ),
      color: '#EB001B'
    },
    { 
      id: 'paypal', 
      name: 'PayPal', 
      icon: <View style={[styles.paymentIcon, {backgroundColor: '#0070E0'}]}><Text style={{color: '#FFFFFF', fontWeight: 'bold'}}>P</Text></View>,
      color: '#0070E0'
    },
    { 
      id: 'bank-transfer', 
      name: 'Bank Transfer', 
      icon: <Ionicons name="business-outline" size={22} color="#666666" />,
      color: '#666666'
    },
    { 
      id: 'apple-pay', 
      name: 'Apple Pay', 
      icon: <View style={[styles.paymentIcon, {backgroundColor: '#000000'}]}><Ionicons name="logo-apple" size={18} color="#FFFFFF" /></View>,
      color: '#000000'
    }
  ];

  // Example dates for booking
  const dates = [
    { day: 'Mon', date: '10', month: 'Mar', price: 40 },
    { day: 'Tue', date: '11', month: 'Mar', price: 40 },
    { day: 'Wed', date: '12', month: 'Mar', price: 40 },
    { day: 'Thu', date: '13', month: 'Mar', price: 38 },
    { day: 'Fri', date: '14', month: 'Mar', price: 45 },
    { day: 'Sat', date: '15', month: 'Mar', price: 50 },
    { day: 'Sun', date: '16', month: 'Mar', price: 50 },
  ];

  // Get the attraction data from route params or use default data
  const attraction = route?.params?.attraction || {
    id: 1,
    title: "Singapore Zoo",
    location: "Singapore",
    rating: 4.9,
    price: 40,
    numberOfReviews: 412,
    category: "Nature",
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
    ]
  };

  // Example reviews
  const reviews = [
    { 
      name: 'Sarah Chen', 
      rating: 5, 
      date: 'January 2025', 
      comment: 'Amazing experience! The animals are well cared for and the habitats are beautiful and spacious. The orangutan exhibit was our favorite part.' 
    },
    { 
      name: 'John Miller', 
      rating: 4, 
      date: 'February 2025', 
      comment: 'Great family day out. The kids loved it, especially the feeding sessions. Gets crowded on weekends though.' 
    },
    { 
      name: 'Aisha Rahman', 
      rating: 5, 
      date: 'December 2024', 
      comment: 'One of the best zoos I\'ve visited. Very clean and the animals have large, natural enclosures. The tram is convenient for getting around.' 
    }
  ];

  const decreaseAdultTickets = () => {
    if (adultTickets > 0) {
      setAdultTickets(adultTickets - 1);
    }
  };

  const increaseAdultTickets = () => {
    setAdultTickets(adultTickets + 1);
  };

  const decreaseChildTickets = () => {
    if (childTickets > 0) {
      setChildTickets(childTickets - 1);
    }
  };

  const increaseChildTickets = () => {
    setChildTickets(childTickets + 1);
  };

  // Calculate total price
  const calculateTotal = () => {
    if (selectedDate === null) return 0;
    
    const basePrice = dates[selectedDate].price;
    const childPrice = Math.round(basePrice * 0.7); // Children pay 70% of adult price
    
    return (basePrice * adultTickets) + (childPrice * childTickets);
  };

  const getTotalCartPrice = () => {
    return cartItems.reduce((total, item) => total + item.totalPrice, 0);
  };

  const totalPrice = calculateTotal();
  const hasTickets = (adultTickets + childTickets) > 0;

  // Add item to cart
  const addToCart = (item) => {
    setCartItems([...cartItems, item]);
  };

  // Remove item from cart
  const removeFromCart = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  // Clear cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Toggle wishlist status
  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
  };

  // Handle add to cart
  const handleAddToCart = () => {
    if (selectedDate === null || !hasTickets) return;

    const basePrice = dates[selectedDate].price;
    const childPrice = Math.round(basePrice * 0.7);
    
    const dateString = `${dates[selectedDate].date} ${dates[selectedDate].month}`;
    
    const cartItem = {
      id: `${attraction.id}-${dateString}-${Date.now()}`, // Create a unique ID
      attractionId: attraction.id,
      title: attraction.title,
      date: dateString,
      adultTickets,
      childTickets,
      adultPrice: basePrice,
      childPrice,
      totalPrice,
    };
    
    addToCart(cartItem);
    Alert.alert(
      "Added to Cart",
      `${attraction.title} tickets have been added to your cart.`,
      [
        { 
          text: "Continue Shopping", 
          onPress: () => {
            // Reset selections
            setSelectedDate(null);
            setAdultTickets(1);
            setChildTickets(0);
          }
        },
        { 
          text: "View Cart", 
          onPress: () => setCheckoutModalVisible(true)
        }
      ]
    );
  };

  // Handle select payment method
  const handleSelectPaymentMethod = (id) => {
    setSelectedPaymentMethod(id);
  };

  // Handle proceed to checkout
  const handleProceedToCheckout = () => {
    if (!selectedPaymentMethod) {
      Alert.alert("Please Select Payment Method", "Please select a payment method to continue.");
      return;
    }
    
    // If credit card is selected, show the credit card form
    if (selectedPaymentMethod === 'credit-card') {
      setCheckoutModalVisible(false);
      setCreditCardModalVisible(true);
    } else {
      // For other payment methods, proceed normally
      Alert.alert(
        "Processing Payment",
        `Processing payment via ${paymentMethods.find(m => m.id === selectedPaymentMethod)?.name}. Please wait...`,
        [
          { 
            text: "OK", 
            onPress: () => {
              setTimeout(() => {
                Alert.alert(
                  "Payment Successful!",
                  "Your tickets have been booked successfully. You will receive a confirmation email shortly.",
                  [
                    { 
                      text: "OK", 
                      onPress: () => {
                        clearCart();
                        setCheckoutModalVisible(false);
                      }
                    }
                  ]
                );
              }, 1500);
            }
          }
        ]
      );
    }
  };

  // Handle credit card payment submission
  const handleCreditCardSubmission = () => {
    Alert.alert(
      "Payment Successful!",
      "Your tickets have been booked successfully. You will receive a confirmation email shortly.",
      [
        { 
          text: "OK", 
          onPress: () => {
            clearCart();
            setCreditCardModalVisible(false);
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.wishlistButton} onPress={toggleWishlist}>
            <Ionicons 
              name={isWishlisted ? "heart" : "heart-outline"} 
              size={24} 
              color={isWishlisted ? "#FF385C" : "#821E26"} 
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.cartButton} onPress={() => setCheckoutModalVisible(true)}>
            <Ionicons name="cart-outline" size={24} color="#821E26" />
            {cartItems.length > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartItems.length}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Gallery */}
        <ImageGallery images={[1, 2, 3, 4]} />
        
        {/* Attraction Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.title}>{attraction.title}</Text>
          
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={16} color="#666" />
            <Text style={styles.location}>{attraction.location}</Text>
          </View>
          
          <View style={styles.ratingRow}>
            <View style={styles.ratingBadge}>
              <Text style={styles.ratingText}>{attraction.rating}</Text>
            </View>
            <Text style={styles.reviewCount}>
              {attraction.numberOfReviews} reviews
            </Text>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{attraction.category}</Text>
            </View>
          </View>

          <View style={styles.detailsRow}>
            <View style={styles.detailItem}>
              <Ionicons name="time-outline" size={18} color="#666" />
              <Text style={styles.detailText}>{attraction.openingHours}</Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="hourglass-outline" size={18} color="#666" />
              <Text style={styles.detailText}>{attraction.duration}</Text>
            </View>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{attraction.description}</Text>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Highlights</Text>
            {attraction.highlights.map((highlight, index) => (
              <View key={index} style={styles.highlightItem}>
                <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                <Text style={styles.highlightText}>{highlight}</Text>
              </View>
            ))}
          </View>
          
          <View style={styles.rowSection}>
            <View style={styles.fullSection}>
              <Text style={styles.sectionTitle}>Includes</Text>
              {attraction.includes.map((item, index) => (
                <View key={index} style={styles.includeItem}>
                  <Ionicons name="checkmark" size={16} color="#4CAF50" />
                  <Text style={styles.includeText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select Date</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.datesContainer}
            >
              {dates.map((item, index) => (
                <TouchableOpacity 
                  key={index}
                  style={[
                    styles.dateCard,
                    selectedDate === index && styles.selectedDateCard
                  ]}
                  onPress={() => setSelectedDate(index)}
                >
                  <Text style={[
                    styles.dateDay,
                    selectedDate === index && styles.selectedDateText
                  ]}>{item.day}</Text>
                  <Text style={[
                    styles.dateNumber,
                    selectedDate === index && styles.selectedDateText
                  ]}>{item.date}</Text>
                  <Text style={[
                    styles.dateMonth,
                    selectedDate === index && styles.selectedDateText
                  ]}>{item.month}</Text>
                  <Text style={[
                    styles.datePrice,
                    selectedDate === index && styles.selectedDateText
                  ]}>${item.price}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          
          {selectedDate !== null && (
            <View style={styles.section}>
              <View style={styles.ticketHeader}>
                <Text style={styles.sectionTitle}>Tickets</Text>
                <View style={styles.ticketTypeContainer}>
                  <View style={styles.ticketType}>
                    <View>
                      <Text style={styles.ticketTypeLabel}>Adult</Text>
                      <Text style={styles.ticketPrice}>${selectedDate !== null ? dates[selectedDate].price : 0}</Text>
                    </View>
                    <View style={styles.ticketControls}>
                      <TouchableOpacity 
                        style={styles.ticketButton} 
                        onPress={decreaseAdultTickets}
                      >
                        <Ionicons name="remove" size={18} color="#666" />
                      </TouchableOpacity>
                      <Text style={styles.ticketCount}>{adultTickets}</Text>
                      <TouchableOpacity 
                        style={styles.ticketButton}
                        onPress={increaseAdultTickets}
                      >
                        <Ionicons name="add" size={18} color="#666" />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={styles.ticketType}>
                    <View>
                      <Text style={styles.ticketTypeLabel}>Child</Text>
                      <Text style={styles.ticketPrice}>${selectedDate !== null ? Math.round(dates[selectedDate].price * 0.7) : 0}</Text>
                    </View>
                    <View style={styles.ticketControls}>
                      <TouchableOpacity 
                        style={styles.ticketButton} 
                        onPress={decreaseChildTickets}
                      >
                        <Ionicons name="remove" size={18} color="#666" />
                      </TouchableOpacity>
                      <Text style={styles.ticketCount}>{childTickets}</Text>
                      <TouchableOpacity 
                        style={styles.ticketButton}
                        onPress={increaseChildTickets}
                      >
                        <Ionicons name="add" size={18} color="#666" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          )}
          
          <View style={styles.section}>
            <View style={styles.reviewsHeader}>
              <Text style={styles.sectionTitle}>Reviews</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>See all</Text>
              </TouchableOpacity>
            </View>
            
            {reviews.map((review, index) => (
              <Review
                key={index}
                name={review.name}
                rating={review.rating}
                date={review.date}
                comment={review.comment}
              />
            ))}
          </View>
        </View>
      </ScrollView>
      
      {/* Bottom Bar with Add to Cart Button */}
      <View style={styles.bottomBar}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Total Price</Text>
          <Text style={styles.price}>${totalPrice}</Text>
          {(adultTickets > 0 || childTickets > 0) && (
            <Text style={styles.priceBreakdown}>
              {adultTickets > 0 && `${adultTickets} Adult${adultTickets > 1 ? 's' : ''}`}
              {childTickets > 0 && (adultTickets > 0 ? `, ${childTickets} Child${childTickets > 1 ? 'ren' : ''}` : `${childTickets} Child${childTickets > 1 ? 'ren' : ''}`)}
            </Text>
          )}
        </View>
        <TouchableOpacity 
          style={styles.bookButton}
          disabled={selectedDate === null || !hasTickets}
          onPress={handleAddToCart}
        >
          <LinearGradient
            colors={selectedDate !== null && hasTickets ? ['#821E26', '#C3485D'] : ['#CCCCCC', '#AAAAAA']}
            style={styles.bookButtonGradient}
          >
            <Text style={styles.bookButtonText}>Add to Cart</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Checkout Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={checkoutModalVisible}
        onRequestClose={() => setCheckoutModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Your Cart</Text>
              <TouchableOpacity onPress={() => setCheckoutModalVisible(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            {/* Cart Items */}
            <ScrollView style={styles.cartItemsContainer}>
              {cartItems.length === 0 ? (
                <View style={styles.emptyCartContainer}>
                  <Ionicons name="cart-outline" size={64} color="#CCC" />
                  <Text style={styles.emptyCartText}>Your cart is empty</Text>
                </View>
              ) : (
                cartItems.map((item) => (
                  <CartItem 
                    key={item.id} 
                    item={item} 
                    onRemove={removeFromCart} 
                  />
                ))
              )}
            </ScrollView>

            {/* Total Price */}
            {cartItems.length > 0 && (
              <View style={styles.cartTotalContainer}>
                <Text style={styles.cartTotalLabel}>Total</Text>
                <Text style={styles.cartTotalPrice}>${getTotalCartPrice()}</Text>
              </View>
            )}

            {/* Payment Methods */}
            {cartItems.length > 0 && (
              <View style={styles.paymentMethodsContainer}>
                <Text style={styles.paymentMethodsTitle}>Payment Method</Text>
                <View style={styles.paymentMethodsGrid}>
                  {paymentMethods.map((method) => (
                    <PaymentMethodCard 
                      key={method.id}
                      method={method}
                      isSelected={selectedPaymentMethod === method.id}
                      onSelect={handleSelectPaymentMethod}
                    />
                  ))}
                </View>
              </View>
            )}

            {/* Checkout Button */}
            {cartItems.length > 0 && (
              <TouchableOpacity 
                style={styles.checkoutButton}
                onPress={handleProceedToCheckout}
              >
                <LinearGradient
                  colors={['#821E26', '#C3485D']}
                  style={styles.checkoutButtonGradient}
                >
                  <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>

      {/* Credit Card Payment Form */}
      <CreditCardPaymentForm
        visible={creditCardModalVisible}
        onClose={() => setCreditCardModalVisible(false)}
        onSubmit={handleCreditCardSubmission}
        amount={getTotalCartPrice()}
      />
    </SafeAreaView>
  );
};

export default AttractionDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    zIndex: 10,
  },
  headerRight: {
    flexDirection: 'row',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  wishlistButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  cartButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#821E26',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  galleryContainer: {
    height: 300,
    position: 'relative',
  },
  galleryImage: {
    width: width,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paginationDots: {
    position: 'absolute',
    bottom: 16,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  imageCounter: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  imageCounterText: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  infoContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  location: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  ratingBadge: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
  },
  ratingText: {
    fontWeight: 'bold',
    color: '#333',
  },
  reviewCount: {
    color: '#666',
    marginRight: 12,
  },
  categoryBadge: {
    backgroundColor: '#E8F4F8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  categoryText: {
    color: '#0078A7',
    fontWeight: '500',
  },
  detailsRow: {
    flexDirection: 'row',
    marginBottom: 16,
    justifyContent: 'space-between',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  detailText: {
    marginLeft: 4,
    color: '#666',
    fontSize: 13,
  },
  section: {
    marginBottom: 24,
  },
  rowSection: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  fullSection: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    color: '#444',
  },
  highlightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  highlightText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#444',
    flex: 1,
  },
  includeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  includeText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#444',
  },
  excludeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  excludeText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#444',
  },
  datesContainer: {
    paddingVertical: 8,
  },
  dateCard: {
    width: 70,
    height: 100,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    marginRight: 12,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedDateCard: {
    backgroundColor: '#821E26',
  },
  dateDay: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  dateNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  dateMonth: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  datePrice: {
    fontSize: 12,
    fontWeight: '600',
    color: '#821E26',
  },
  selectedDateText: {
    color: '#FFFFFF',
  },
  ticketHeader: {
    marginBottom: 8,
  },
  ticketTypeContainer: {
    marginTop: 8,
  },
  ticketType: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  ticketTypeLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  ticketPrice: {
    fontSize: 14,
    color: '#821E26',
    marginTop: 2,
  },
  ticketControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ticketButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ticketCount: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 16,
    minWidth: 20,
    textAlign: 'center',
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllText: {
    color: '#821E26',
    fontWeight: '500',
  },
  reviewCard: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewUser: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#821E26',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  reviewAvatarText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  reviewName: {
    fontWeight: '600',
    fontSize: 14,
    color: '#333',
  },
  reviewDate: {
    fontSize: 12,
    color: '#666',
  },
  reviewRating: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFECB3',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  reviewRatingValue: {
    fontWeight: 'bold',
    color: '#333',
    marginRight: 4,
  },
  reviewComment: {
    fontSize: 14,
    lineHeight: 20,
    color: '#444',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  priceContainer: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 12,
    color: '#666',
  },
  price: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  priceBreakdown: {
    fontSize: 11,
    color: '#666',
  },
  bookButton: {
    width: 150,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
  },
  bookButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingBottom: 30,
    maxHeight: height * 0.8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  cartItemsContainer: {
    maxHeight: height * 0.4,
  },
  emptyCartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyCartText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  cartItemInfo: {
    flex: 1,
  },
  cartItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  cartItemDetails: {
    fontSize: 12,
    color: '#666',
  },
  cartItemPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartItemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 12,
  },
  removeButton: {
    padding: 4,
  },
  cartTotalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  cartTotalLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  cartTotalPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  paymentMethodsContainer: {
    paddingVertical: 16,
  },
  paymentMethodsTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 12,
  },
  paymentMethodsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  paymentMethodCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    width: '48%',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  selectedPaymentMethodCard: {
    borderColor: '#821E26',
    borderWidth: 2,
  },
  paymentMethodContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentMethodIconContainer: {
    marginRight: 12,
  },
  paymentIcon: {
    width: 32,
    height: 24,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  creditCardIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 24,
  },
  ccCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  checkmarkContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkoutButton: {
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    marginTop: 16,
    marginBottom: 8,
  },
  checkoutButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  }
});