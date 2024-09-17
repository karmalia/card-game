import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import "react-native-reanimated";
import tamaguiConfig from "@/tamagui.config";
import { TamaguiProvider, Text } from "tamagui";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Inter: require("@tamagui/font-inter/otf/Inter-Medium.otf"),
    InterBold: require("@tamagui/font-inter/otf/Inter-Bold.otf"),
    DragonSlayer: require("@/assets/fonts/dragon-slayer/dragon-slayer.otf"),
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView>
      <TamaguiProvider config={tamaguiConfig}>
        <RootLayoutNav />
      </TamaguiProvider>
    </GestureHandlerRootView>
  );
}

function RootLayoutNav() {
  const router = useRouter();

  React.useEffect(() => {
    router.push("/gamescreen");
  }, []);

  return (
    <>
      <Text
        style={{
          position: "absolute",
          color: "black",
          fontFamily: "monospace",
          top: 12,
          fontSize: 12,
          left: 140,
          zIndex: 10,
          opacity: 0.5,
        }}
      >
        Alpha: 0.0.2
      </Text>
      <StatusBar hidden />
      <Stack initialRouteName="home/index">
        <Stack.Screen
          name="gamescreen/index"
          options={{ headerShown: false }}
        />
        <Stack.Screen name="home/index" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}
