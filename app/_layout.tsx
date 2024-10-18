import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import "react-native-reanimated";
import tamaguiConfig from "@/tamagui.config";
import { TamaguiProvider, Text } from "tamagui";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { MusicProvider } from "@/hooks/MusicProvider";
import { BackHandler } from "react-native";
import * as NavigationBar from "expo-navigation-bar";
export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Inter: require("@tamagui/font-inter/otf/Inter-Medium.otf"),
    InterBold: require("@tamagui/font-inter/otf/Inter-Bold.otf"),
    DragonSlayer: require("@/assets/fonts/dragon-slayer/dragon-slayer.otf"),
  });
  NavigationBar.setVisibilityAsync("hidden");

  function handleBackButton() {
    return true;
  }

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", handleBackButton);
    if (loaded) {
      SplashScreen.hideAsync();
    }

    return () => {
      BackHandler.removeEventListener("hardwareBackPress", handleBackButton);
    };
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView>
      <TamaguiProvider config={tamaguiConfig}>
        <MusicProvider>
          <RootLayoutNav />
        </MusicProvider>
      </TamaguiProvider>
    </GestureHandlerRootView>
  );
}

function RootLayoutNav() {
  //if user's first time entering the app, redirect to getname screen

  return (
    <>
      <Text
        style={{
          position: "absolute",
          fontFamily: "monospace",
          top: 12,
          fontSize: 12,
          left: 140,
          zIndex: 10,
          opacity: 0.5,
          color: "white",
        }}
      >
        Alpha: 0.0.4
      </Text>
      <StatusBar hidden />
      <Stack initialRouteName="gamescreen">
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="gamescreen" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}
