import "../global.css";
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#1a1a2e' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: '700' },
          contentStyle: { backgroundColor: '#16213e' },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)/login" options={{ title: 'Login', presentation: 'modal' }} />
        <Stack.Screen name="log-run" options={{ title: 'Log Run', presentation: 'modal' }} />
        <Stack.Screen name="log-lift" options={{ title: 'Log Lift', presentation: 'modal' }} />
      </Stack>
    </>
  );
}
