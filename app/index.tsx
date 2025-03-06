import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import AppIntroSlider from "react-native-app-intro-slider";
import DashboardScreen from "./DashboardScreen";
import BottomTabNavigator from "./navigation/TabNavigator";

//From here onward in this file, everything here is for the onboarding process.
//All images from this are all placeholders except for key 1
const slides = [
  {
    key: "1",
    title: "Plan Your Travel",
    text: "Create your dream trip with ease. Choose a destination, find the perfect place to stay, and create an itinerary that suits your preferences.",
    backgroundColor: "#DEC0C3",
    image: require("../assets/images/PlanTravel.png"), //Onboarding image
  },
  {
    key: "2",
    title: "Get the Best Deal",
    text: "Save time and money by finding the best travel deals. We provide a range of exclusive promotions and discounts to make your trip more affordable.",
    backgroundColor: "#DEC0C3",
    image: require("../assets/images/PlanTravel.png"), //Image placeholder
  },
  {
    key: "3",
    title: "Explore Local Attractions",
    text: "Discover the beauty of local places you may never have visited. Experience local life and enjoy authentic experiences in each destination.",
    backgroundColor: "#DEC0C3",
    image: require("../assets/images/PlanTravel.png"), //Image placeholder
  },
];

//Using React Native intro slider from here
const OnboardingScreen = ({ onFinish }) => {
  return (
    <AppIntroSlider
      data={slides}
      renderItem={({ item, index }) => (
        <View style={[styles.slide, { backgroundColor: item.backgroundColor }]}>
          {item.image && <Image source={item.image} style={styles.image} />}
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.text}>{item.text}</Text>
          {index === slides.length - 1 && (
            <TouchableOpacity style={styles.finishButton} onPress={onFinish}>
              <Text style={styles.buttonText}>Finish</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
      onDone={onFinish}
      showSkipButton={false}
      showNextButton={false}
      showDoneButton={false}
      onSkip={onFinish}
    />
  );
};

export default function App() {
  const [showOnboarding, setShowOnboarding] = useState(true);

  const handleFinish = () => {
    setShowOnboarding(false);
  };

  return showOnboarding ? (
    <OnboardingScreen onFinish={handleFinish} />
  ) : (
    <BottomTabNavigator />
  );
}

const styles = StyleSheet.create({
  slide: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  image: { width: 300, height: 300, resizeMode: "contain", marginTop: -150 },
  title: { fontSize: 32, fontWeight: "bold", color: "#821E26", textAlign: "center", fontFamily: "serif" },
  text: { fontSize: 16, width: 320, color: "#262628", textAlign: "center", marginTop: 40, lineHeight: 30 },
  finishButton: {
    marginTop: 40,
    marginBottom: -120,
    backgroundColor: "#821E26",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: "center",
    width: 350,
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});