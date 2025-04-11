import React from "react";
import { Tabs } from "expo-router";
import { Home, Image as ImageIcon, Settings } from "lucide-react-native";
import Colors from "@/constants/colors";
import CoinBalance from "@/components/CoinBalance";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.secondary,
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: Colors.border,
        },
        headerStyle: {
          backgroundColor: Colors.background,
        },
        headerTitleStyle: {
          fontWeight: "600",
        },
        headerTitleAlign: "left",
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Ghibli AI",
          tabBarLabel: "Home",
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
          headerRight: () => <CoinBalance />,
          headerRightContainerStyle: { paddingRight: 16 },
        }}
      />
      <Tabs.Screen
        name="gallery"
        options={{
          title: "Ghibli AI",
          tabBarLabel: "Gallery",
          tabBarIcon: ({ color }) => <ImageIcon size={24} color={color} />,
          headerRight: () => <CoinBalance />,
          headerRightContainerStyle: { paddingRight: 16 },
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => <Settings size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}