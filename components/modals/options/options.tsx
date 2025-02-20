import {
  Dimensions,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useContext, useEffect, useId, useState } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Checkbox, Image, Label, Stack } from "tamagui";
import Icons from "@/components/icons";
import { usePathname, useRouter } from "expo-router";
import { TouchableOpacity } from "react-native-gesture-handler";

import useGameStore from "@/stores/game.store";

import { Sounds, useSound } from "@/stores/SoundProvider";
import useGameScoreStore from "@/stores/game-score.store";

const { height } = Dimensions.get("window");

const checkboxSize = Dimensions.get("window").width * 0.025;

const Options = () => {
  const { gameSounds, setVolumeForSounds } = useSound();
  const [optionsVisible, setOptionsVisible] = useState(false);
  const router = useRouter();
  const { populateDeck, setGamePhase, restartGame } = useGameStore();
  const { resetTime } = useGameScoreStore();
  const { playSound } = useContext(Sounds)!;
  const musicId = useId();
  const soundsId = useId();
  const pathname = usePathname();

  function handleNavigation(type: "home" | "restart") {
    switch (type) {
      case "home":
        playSound("clickDefault");
        populateDeck();
        setGamePhase(0);
        router.navigate("/");

        break;
      case "restart":
        playSound("clickDefault");
        restartGame();
        resetTime();
        break;
      default:
        console.log("Error: Invalid navigation type");
        break;
    }
    setOptionsVisible(false);
  }

  const opacity = useSharedValue(0);
  const translateY = useSharedValue(height);
  const zIndex = useSharedValue(0);

  if (optionsVisible) {
    opacity.value = withTiming(0.5, { duration: 300 });
    translateY.value = withTiming(0, { duration: 300 });
    zIndex.value = withTiming(10, { duration: 300 });
  } else {
    zIndex.value = withTiming(0, { duration: 300 });
    opacity.value = withTiming(0, { duration: 300 });
    translateY.value = withTiming(height, { duration: 300 });
  }

  const animatedBackgroundStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    zIndex: zIndex.value,
  }));

  const animatedModalStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    zIndex: zIndex.value,
  }));

  useEffect(() => {
    if (optionsVisible) {
      setOptionsVisible(false);
    }
  }, [pathname]);

  return (
    <>
      <View
        style={{
          position: "absolute",
          top: 14,
          right: 0,
          zIndex: 20,
        }}
      >
        <Stack
          borderRadius="$4"
          justifyContent="center"
          alignItems="center"
          marginHorizontal="$4"
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              playSound("clickSoundSeven");
              setOptionsVisible((prev) => !prev);
            }}
          >
            {optionsVisible ? (
              <Stack
                style={{
                  borderWidth: 2,
                  borderColor: "white",
                  justifyContent: "center",
                  alignItems: "center",
                  height: Dimensions.get("window").width * 0.065,
                  width: Dimensions.get("window").width * 0.065,
                }}
              >
                <Text
                  style={{
                    fontFamily: "DragonSlayer",
                    color: "white",
                    fontSize: Dimensions.get("window").width * 0.05,
                  }}
                >
                  X
                </Text>
              </Stack>
            ) : (
              <Image
                style={{
                  height: Dimensions.get("window").width * 0.065,
                  width: Dimensions.get("window").width * 0.065,
                }}
                resizeMethod="auto"
                source={require("@/assets/icons/settings3.png")}
              />
            )}
          </TouchableOpacity>
        </Stack>
      </View>
      <Animated.View style={[styles.background, animatedBackgroundStyle]} />
      <Animated.View style={[styles.modalContainer, animatedModalStyle]}>
        <ImageBackground
          source={require("@/assets/modals/options-modal2.png")}
          resizeMethod="auto"
          resizeMode="stretch"
        >
          <View style={styles.modalContent}>
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <Text style={styles.modalTitle}>OPTIONS</Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                gap: 12,
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text style={styles.modalOptionText}>SOUNDS</Text>
              <Checkbox
                size={"$4"}
                id={soundsId}
                checked={gameSounds.status}
                onCheckedChange={() => {
                  console.log("gameSounds.status", gameSounds.status);
                  setVolumeForSounds(!gameSounds.status);
                }}
                display="none"
              />

              <ImageBackground
                resizeMode="contain"
                source={require("@/assets/icons/panel-checkbox.png")}
              >
                <Label style={styles.modalLabel} htmlFor={soundsId} />
                {gameSounds && (
                  <View style={styles.checkboxContainer}>
                    <Icons.Check width={checkboxSize} height={checkboxSize} />
                  </View>
                )}
              </ImageBackground>
            </View>

            {pathname === "/gamescreen" && handleNavigation && (
              <Stack
                direction="ltr"
                marginVertical="$4"
                flexDirection="row"
                display="flex"
              >
                <View style={styles.optionsButton}>
                  <TouchableOpacity onPress={() => handleNavigation("home")}>
                    <Text style={styles.optionsText}>HOME</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.optionsButton}>
                  <TouchableOpacity onPress={() => handleNavigation("restart")}>
                    <Text style={styles.optionsText}>RESTART</Text>
                  </TouchableOpacity>
                </View>
              </Stack>
            )}
            {pathname === "/" && (
              <Pressable
                style={styles.closeButton}
                onPress={() => {
                  playSound("clickSoundSeven");
                  setOptionsVisible(false);
                }}
                hitSlop={10}
              >
                <Text style={styles.closeButtonText}>CLOSE</Text>
              </Pressable>
            )}
          </View>
        </ImageBackground>
      </Animated.View>
    </>
  );
};

export default Options;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  openButtonText: {
    color: "white",
    fontSize: 16,
  },
  background: {
    position: "absolute",
    width: Dimensions.get("window").width,
    height: "100%",
    backgroundColor: "black",
  },
  modalContainer: {
    position: "absolute",
    backgroundColor: "rgba(0, 0, 20, 0.8)",

    alignSelf: "center",
    top: "20%",
  },
  modalContent: {
    width: Dimensions.get("window").width * 0.4,
    height: Dimensions.get("window").height * 0.6,
    paddingHorizontal: Dimensions.get("window").width * 0.04,
    paddingVertical: Dimensions.get("window").height * 0.05,
    gap: 12,
    justifyContent: "space-between",
  },
  modalTitle: {
    fontSize: Dimensions.get("window").width * 0.05,
    color: "white",
    letterSpacing: 4,
    fontFamily: "DragonSlayer",
    flex: 1,
    textAlign: "center",
  },
  modalText: {
    fontSize: Dimensions.get("window").width * 0.04,
    justifyContent: "center",
    alignItems: "center",

    backgroundColor: "transparent",
    zIndex: 10,
  },
  modalLabel: {
    width: Dimensions.get("window").width * 0.04,
    height: Dimensions.get("window").width * 0.04,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    zIndex: 10,
  },
  modalOptionText: {
    fontFamily: "DragonSlayer",
    fontSize: Dimensions.get("window").width * 0.04,
    letterSpacing: 1,
    color: "white",
    flex: 1,
  },
  checkboxContainer: {
    position: "absolute",
    width: checkboxSize + checkboxSize / 2,
    height: checkboxSize + checkboxSize / 2,
    justifyContent: "center",
    alignItems: "center",
    top: 0,
    left: 0,
    zIndex: -10,
  },
  closeButton: {
    padding: 10,
    borderWidth: 2,
    borderColor: "white",
  },
  closeButtonText: {
    color: "white",
    fontSize: Dimensions.get("window").width * 0.03,
    textAlign: "center",
    letterSpacing: 2,
    fontFamily: "DragonSlayer",
  },
  optionsButton: {
    borderColor: "black",
    flex: 1,
  },
  optionsText: {
    fontFamily: "DragonSlayer",
    fontSize: Dimensions.get("window").width * 0.04,
    paddingVertical: 6,
    letterSpacing: 1,
    textAlign: "center",
    color: "white",
  },
});
