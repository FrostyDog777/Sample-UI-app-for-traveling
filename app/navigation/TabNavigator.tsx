import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { BottomNavigation } from "react-native-paper"; //provide the UI component at the bottom of the screen
import { Ionicons } from "@expo/vector-icons";
import DashboardScreen from "../DashboardScreen";
import DealsScreen from "../tabs/deals";
import OrdersScreen from "../tabs/orders";
import ProfileScreen from "../tabs/profile";
import AttractionScreen from "../pages/attractions/attraction";

// Create a global state to track which screen to show
let currentDashboardScreen = "dashboard";

const setCurrentDashboardScreen = (screenName) => {
  currentDashboardScreen = screenName;
};

// Create a wrapper component for dashboard tab that handles internal navigation
const DashboardNavigator = () => {
  const [screen, setScreen] = useState(currentDashboardScreen);

  // Update local state when global state changes
  React.useEffect(() => {
    const interval = setInterval(() => {
      if (currentDashboardScreen !== screen) {
        setScreen(currentDashboardScreen);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [screen]);

  // Render the appropriate screen based on the current state
  if (screen === "attraction") {
    return <AttractionScreen goBack={() => {
      setCurrentDashboardScreen("dashboard");
      setScreen("dashboard");
    }} />;
  }

  return <DashboardScreen navigateTo={(screenName) => {
    setCurrentDashboardScreen(screenName);
    setScreen(screenName);
  }} />;
};

//Provides the tab bar UI component at the bottom of the screen and also manages tab switching behavior
export default function BottomTabNavigator() {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "dashboard", title: "Home", icon: "home-outline" },
    { key: "deals", title: "Deals", icon: "pricetag-outline" },
    { key: "orders", title: "Orders", icon: "receipt-outline" },
    { key: "profile", title: "Profile", icon: "person-outline" },
  ]);

  //to redirect them to pages from each respectively
  const renderScene = BottomNavigation.SceneMap({
    dashboard: DashboardNavigator,
    deals: DealsScreen,
    orders: OrdersScreen,
    profile: ProfileScreen,
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
      activeColor="#821E26"
      inactiveColor="#848884"
      barStyle={styles.barStyle}
      renderIcon={({ route, color }) => (
        <Ionicons name={route.icon} size={24} color={color} />
      )}
    />
  );
}

const styles = StyleSheet.create({
  barStyle: {
    backgroundColor: "#fff",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    borderTopWidth: 1,
    borderTopColor: "rgba(0, 0, 0, 0.1)",
  },
});