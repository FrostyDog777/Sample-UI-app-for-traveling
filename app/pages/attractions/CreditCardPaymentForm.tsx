import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Modal,
    ScrollView,
    Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface CreditCardPaymentFormProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: () => void;
    amount: number;
}

const CreditCardPaymentForm: React.FC<CreditCardPaymentFormProps> = ({
    visible,
    onClose,
    onSubmit,
    amount
}) => {
  // Card details state
    const [cardNumber, setCardNumber] = useState('');
    const [cardHolder, setCardHolder] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [isLoading, setIsLoading] = useState(false);

  // Format card number with spaces
  const formatCardNumber = (text: string) => {
    // Remove all non-digit characters
    const cleaned = text.replace(/\D/g, '');
    // Add a space every 4 digits
    let formatted = '';
    for (let i = 0; i < cleaned.length; i++) {
      if (i > 0 && i % 4 === 0) {
        formatted += ' ';
      }
      formatted += cleaned[i];
    }
    return formatted.slice(0, 19); // 16 digits + 3 spaces
  };

  // Format expiry date as MM/YY
  const formatExpiryDate = (text: string) => {
    // Remove all non-digit characters
    const cleaned = text.replace(/\D/g, '');

    if (cleaned.length >= 3) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    } else if (cleaned.length === 2) {
      return `${cleaned}/`;
    }
    return cleaned;
  };

  // Handle card number change with formatting
  const handleCardNumberChange = (text: string) => {
    setCardNumber(formatCardNumber(text));
  };

  // Handle expiry date change with formatting
  const handleExpiryDateChange = (text: string) => {
    setExpiryDate(formatExpiryDate(text));
  };

  // Check if form is valid
  const isFormValid = () => {
    const isCardNumberValid = cardNumber.replace(/\s/g, '').length === 16;
    const isExpiryDateValid = expiryDate.length === 5;
    const isCvvValid = cvv.length === 3;
    const isCardHolderValid = cardHolder.trim().length > 0;

    return isCardNumberValid && isExpiryDateValid && isCvvValid && isCardHolderValid;
  };

  // Handle form submission
  const handleSubmit = () => {
    if (!isFormValid()) {
      Alert.alert('Invalid Card Details', 'Please check your card information and try again.');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      setIsLoading(false);
      onSubmit();
    }, 1500);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Payment</Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView style={styles.scrollView}>
            {/* Virtual Card Display */}
            <View style={styles.cardPreview}>
              <LinearGradient
                colors={['#1A1A1A', '#333333']}
                style={styles.cardBackground}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.cardContent}>
                  <Text style={styles.cardHolderPreview}>
                    {cardHolder || 'Card Holder'}
                  </Text>

                  <Text style={styles.cardNumberPreview}>
                    {cardNumber || '•••• •••• •••• ••••'}
                  </Text>

                  <View style={styles.cardBottomRow}>
                    <Text style={styles.cardExpiryPreview}>
                      {expiryDate || 'MM/YY'}
                    </Text>
                    <View style={styles.cardLogoContainer}>
                      <View style={styles.cardLogo}>
                        <View style={[styles.cardLogoCircle, { backgroundColor: '#EB001B' }]} />
                        <View style={[styles.cardLogoCircle, { backgroundColor: '#F79E1B', marginLeft: -10 }]} />
                      </View>
                    </View>
                  </View>
                </View>
              </LinearGradient>
              
              <Text style={styles.cardBalanceText}>
                ${amount.toFixed(2)}
              </Text>
            </View>

            {/* Card Details Form */}
            <View style={styles.formContainer}>
              {/* Card Number */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Card Number</Text>
                <TextInput
                    style={styles.input}
                    value={cardNumber}
                    onChangeText={handleCardNumberChange}
                    placeholder="4756 •••• •••• 9018"
                    keyboardType="number-pad"
                    maxLength={19} // 16 digits + 3 spaces
                />
              </View>

              {/* Card Holder */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Card Holder</Text>
                <TextInput
                  style={styles.input}
                  value={cardHolder}
                  onChangeText={setCardHolder}
                  placeholder="Your Name"
                />
              </View>

              {/* Expiry Date and CVV */}
              <View style={styles.rowInputs}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 12 }]}>
                  <Text style={styles.inputLabel}>Expiry Date</Text>
                  <TextInput
                    style={styles.input}
                    value={expiryDate}
                    onChangeText={handleExpiryDateChange}
                    placeholder="MM/YY"
                    keyboardType="number-pad"
                    maxLength={5} // MM/YY
                  />
                </View>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>CVV</Text>
                  <TextInput
                    style={styles.input}
                    value={cvv}
                    onChangeText={setCvv}
                    placeholder="123"
                    keyboardType="number-pad"
                    maxLength={3}
                    secureTextEntry
                  />
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Process Payment Button */}
          <View style={styles.footer}>
            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalAmount}>${amount.toFixed(2)}</Text>
            </View>
            <TouchableOpacity 
              style={styles.processButton}
              onPress={handleSubmit}
              disabled={isLoading}
            >
              <Text style={styles.processButtonText}>
                {isLoading ? 'Processing...' : 'Process Payment'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  content: {
    height: '90%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  scrollView: {
    flex: 1,
  },
  cardPreview: {
    padding: 16,
    alignItems: 'center',
  },
  cardBackground: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    padding: 20,
    marginBottom: 10,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  cardHolderPreview: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  cardNumberPreview: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginVertical: 20,
  },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardExpiryPreview: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  cardLogoContainer: {
    alignItems: 'flex-end',
  },
  cardLogo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardLogoCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  cardBalanceText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  formContainer: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#333',
  },
  rowInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    padding: 16,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 16,
    color: '#666',
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  processButton: {
    backgroundColor: '#821E26',
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  processButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default CreditCardPaymentForm;