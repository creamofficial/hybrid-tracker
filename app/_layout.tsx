import "../global.css";
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';
import { View, ActivityIndicator } from 'react-native';

// Kaizen Design System Colors
const CREAM = '#FFFFFF';
const PRIMARY = '#FF6B35';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: CREAM }}>
        <ActivityIndicator size="large" color={PRIMARY} />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: CREAM },
          headerTintColor: '#1A1A1A',
          headerTitleStyle: { fontWeight: '600', fontFamily: 'Poppins_600SemiBold' },
          contentStyle: { backgroundColor: CREAM },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)/login" options={{ title: 'Login', presentation: 'modal' }} />
        <Stack.Screen name="log-run" options={{ title: 'Log Run', presentation: 'modal', headerShown: false }} />
        <Stack.Screen name="log-lift" options={{ title: 'Log Lift', presentation: 'modal', headerShown: false }} />
      </Stack>
    </>
  );
}
