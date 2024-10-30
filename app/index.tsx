import { Dimensions, ImageBackground, StyleSheet, Text } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Stack, Text as TamaguiText, View } from "tamagui";

import { SafeAreaView } from "react-native-safe-area-context";
import HomeButtons from "@/components/home-buttons/home-buttons";
import Options from "@/components/modals/options/options";
import HowToPlay from "@/components/modals/how-to-play";
import GetUsernameModal from "@/components/modals/get-username/get-username";
import SpaceBackground from "@/components/backgrounds/SpaceBackground";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Leaderboard from "@/components/modals/leaderboard/leaderboard";
import { Sounds } from "@/stores/SoundProvider";

const Index = () => {
  const [instructionsVisible, setInstructuresVisible] = useState(false);
  const [leaderboardVisible, setLeaderboardVisible] = useState(false);
  const { loading } = useContext(Sounds)!;
  const testOpacity = useSharedValue(0);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      opacity: testOpacity.value,
    };
  });

  useEffect(() => {
    testOpacity.value = withTiming(1, { duration: 1000 });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
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
          letterSpacing={8}
        >
          SPACE CARDS
        </TamaguiText>
      </Animated.View>
      <SpaceBackground />
      {!loading && (
        <>
          <Options />

          <GetUsernameModal />
          <HowToPlay
            visible={instructionsVisible}
            onClose={() => setInstructuresVisible(false)}
          />
          <Leaderboard
            visible={leaderboardVisible}
            onClose={() => setLeaderboardVisible(false)}
          />

          <HomeButtons
            setInstructuresVisible={setInstructuresVisible}
            setLeaderboardVisible={setLeaderboardVisible}
          />
        </>
      )}
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
});

export default Index;
