import { Tabs } from "expo-router";
import { Home, PlusCircle, ClipboardList, User } from "lucide-react-native";

// Kaizen Design System Colors
const CREAM = '#FFFFFF';
const PRIMARY = '#FF6B35';
const MUTED = '#4A4A4A';
const BORDER = '#E8E8E8';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: PRIMARY,
        tabBarInactiveTintColor: MUTED,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: BORDER,
          borderTopWidth: 1,
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        headerStyle: { backgroundColor: CREAM },
        headerTintColor: '#1A1A1A',
        headerTitleStyle: { fontWeight: "600", fontFamily: 'Poppins_600SemiBold' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} strokeWidth={2} />,
        }}
      />
      <Tabs.Screen
        name="log"
        options={{
          title: "Log",
          tabBarIcon: ({ color, size }) => <PlusCircle size={size} color={color} strokeWidth={2} />,
        }}
      />
      <Tabs.Screen
        name="programs"
        options={{
          title: "Programs",
          tabBarIcon: ({ color, size }) => <ClipboardList size={size} color={color} strokeWidth={2} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => <User size={size} color={color} strokeWidth={2} />,
        }}
      />
    </Tabs>
  );
}
