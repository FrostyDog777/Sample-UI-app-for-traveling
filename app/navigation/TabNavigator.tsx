import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { BottomNavigation } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import DashboardScreen from "../DashboardScreen"; // Import DashboardScreen or Home
import DealsScreen from "../tabs/deals";
import OrdersScreen from "../tabs/orders";
import ProfileScreen from "../tabs/profile";

export default function BottomTabNavigator() {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "dashboard", title: "Home", icon: "home-outline" },
    { key: "deals", title: "Deals", icon: "pricetag-outline" },
    { key: "orders", title: "Orders", icon: "receipt-outline" },
    { key: "profile", title: "Profile", icon: "person-outline" },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    dashboard: DashboardScreen,
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
