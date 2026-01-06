import { Tabs } from "expo-router";
import { Home, PlusCircle, ClipboardList, User } from "lucide-react-native";
import { colors, typography, shadows } from "~/lib/theme";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary.solid,
        tabBarInactiveTintColor: colors.text.tertiary,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.borderLight,
          borderTopWidth: 1,
          paddingBottom: 8,
          paddingTop: 8,
          height: 80,
          ...shadows.card,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontFamily: 'Poppins_500Medium',
          marginTop: 4,
        },
        headerStyle: {
          backgroundColor: colors.background,
          ...shadows.none,
        },
        headerTintColor: colors.text.primary,
        headerTitleStyle: {
          ...typography.sectionHeader,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Home
              size={24}
              color={color}
              strokeWidth={focused ? 2.5 : 2}
              fill={focused ? color : 'transparent'}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="log"
        options={{
          title: "Log",
          tabBarIcon: ({ color, focused }) => (
            <PlusCircle
              size={24}
              color={color}
              strokeWidth={focused ? 2.5 : 2}
              fill={focused ? color : 'transparent'}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="programs"
        options={{
          title: "Programs",
          tabBarIcon: ({ color, focused }) => (
            <ClipboardList
              size={24}
              color={color}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <User
              size={24}
              color={color}
              strokeWidth={focused ? 2.5 : 2}
              fill={focused ? color : 'transparent'}
            />
          ),
        }}
      />
    </Tabs>
  );
}
