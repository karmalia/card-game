import {
  Dimensions,
  ImageBackground,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Image, Stack, Text as TamaguiText } from "tamagui";

import { SafeAreaView } from "react-native-safe-area-context";
import { TouchableOpacity } from "react-native-gesture-handler";
import HomeButtons from "@/components/home-buttons/home-buttons";
import HomeOptions from "@/components/modals/options/options";
import HowToPlay from "@/components/modals/how-to-play";
import GetUsernameModal from "@/components/modals/get-username/get-username";
import AsyncStorage from "@react-native-async-storage/async-storage";
import GradientBackground from "@/components/backgrounds/GradientBackground";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const Index = () => {
  const [instructionsVisible, setInstructuresVisible] = useState(false);
  const [getusername, setGetusername] = useState(false);
  const testOpacity = useSharedValue(0);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      opacity: testOpacity.value,
    };
  });

  useEffect(() => {
    async function checkIfUserExists() {
      const user = await AsyncStorage.getItem("username");
      const isProd = process.env.NODE_ENV === "production";
      if (!user && isProd) {
        setGetusername(true);
      } else {
        console.log("user exists", user);
      }
    }

    checkIfUserExists();

    testOpacity.value = withTiming(1, {
      duration: 1000,
    });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <HomeOptions />

      <Animated.View
        style={[
          {
            position: "absolute",
            top: Dimensions.get("screen").height * 0.1,
            left: 12,
            right: 0,
            zIndex: 1,

            padding: 16,
          },
          animatedStyles,
        ]}
      >
        <TamaguiText
          color="white"
          fontFamily={"DragonSlayer"}
          fontSize={"$12"}
          lineHeight={84}
          textAlign="left"
          letterSpacing={4}
        >
          SPACE CARDS
        </TamaguiText>
      </Animated.View>

      <GetUsernameModal
        visible={getusername}
        onClose={() => setGetusername(false)}
      />
      <HowToPlay
        visible={instructionsVisible}
        onClose={() => setInstructuresVisible(false)}
      />

      <HomeButtons setInstructuresVisible={setInstructuresVisible} />

      <GradientBackground />
    </SafeAreaView>
  );
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "flex-start",
    paddingHorizontal: 24,
    overflow: "hidden",
    height: "100%",
    width: "100%",
  },

  text: {
    color: "white",
    fontSize: 42,
    lineHeight: 84,
    fontWeight: "bold",
    textAlign: "center",
    backgroundColor: "#000000c0",
  },
});

export default Index;
