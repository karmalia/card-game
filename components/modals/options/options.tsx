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
import { Music } from "@/hooks/MusicProvider";
import useGameStore from "@/stores/game.store";

const { height } = Dimensions.get("window");

const Options = () => {
  const [optionsVisible, setOptionsVisible] = useState(false);
  const router = useRouter();
  const { setGamePhase, populateDeck } = useGameStore();
  const musicId = useId();
  const soundsId = useId();
  const pathname = usePathname();

  function handleNavigation(type: "home" | "restart") {
    switch (type) {
      case "home":
        populateDeck();
        setGamePhase(0);
        router.navigate("/");

        break;
      case "restart":
        console.log("restart");
        populateDeck();
        setGamePhase(1);
        break;
    }
    setOptionsVisible(false);
  }

  const { menuMusic, gameSounds, handleMusicChange, handleGameSoundChange } =
    useContext<any>(Music);

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
              setOptionsVisible((prev) => !prev);
            }}
          >
            <Image
              height="$4"
              width="$4"
              resizeMethod="auto"
              source={require("@/assets/icons/settings3.png")}
            />
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
              <Text style={styles.modalText}>OPTIONS</Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                gap: 12,
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{
                  fontFamily: "DragonSlayer",
                  fontSize: 28,
                  letterSpacing: 1,
                  color: "white",
                  flex: 1,
                }}
              >
                MUSIC
              </Text>
              <Checkbox
                size={"$4"}
                id={musicId}
                checked={menuMusic?.isActive}
                onCheckedChange={handleMusicChange}
                display="none"
              />

              <ImageBackground
                resizeMode="contain"
                width={24}
                height={24}
                source={require("@/assets/icons/panel-checkbox.png")}
              >
                <Label
                  style={{
                    width: 24,
                    height: 24,
                    padding: 0,
                    margin: 0,
                    justifyContent: "center",
                    alignItems: "center",

                    backgroundColor: "transparent",
                    zIndex: 10,
                  }}
                  htmlFor={musicId}
                />
                {menuMusic?.isActive && (
                  <View
                    style={{
                      position: "absolute",
                      width: 24,
                      height: 24,
                      justifyContent: "center",
                      alignItems: "center",
                      top: 0,
                      left: 0,
                      zIndex: -10,
                    }}
                  >
                    <Icons.Check width={12} height={12} />
                  </View>
                )}
              </ImageBackground>
            </View>
            <View
              style={{
                flexDirection: "row",
                gap: 12,
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{
                  fontFamily: "DragonSlayer",
                  fontSize: 28,
                  letterSpacing: 1,
                  color: "white",
                  flex: 1,
                }}
              >
                SOUNDS
              </Text>
              <Checkbox
                size={"$4"}
                id={soundsId}
                checked={gameSounds}
                onCheckedChange={handleGameSoundChange}
                display="none"
              />

              <ImageBackground
                resizeMode="contain"
                source={require("@/assets/icons/panel-checkbox.png")}
              >
                <Label
                  style={{
                    width: 24,
                    height: 24,
                    padding: 0,
                    margin: 0,
                    justifyContent: "center",
                    alignItems: "center",

                    backgroundColor: "transparent",
                    zIndex: 10,
                  }}
                  htmlFor={soundsId}
                />
                {gameSounds && (
                  <View
                    style={{
                      position: "absolute",
                      width: 24,
                      height: 24,
                      justifyContent: "center",
                      alignItems: "center",
                      top: 0,
                      left: 0,
                      zIndex: -10,
                    }}
                  >
                    <Icons.Check width={12} height={12} />
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
                onPress={() => setOptionsVisible(false)}
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
    maxWidth: Dimensions.get("window").width * 0.3,
    backgroundColor: "rgba(0, 0, 20, 0.8)",

    alignSelf: "center",
    top: "20%",
  },
  modalContent: {
    width: Dimensions.get("window").width * 0.3,
    height: Dimensions.get("window").height * 0.6,
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 12,
    justifyContent: "space-between",
  },
  modalText: {
    fontSize: 28,
    color: "white",
    letterSpacing: 4,
    fontFamily: "DragonSlayer",
    flex: 1,
    textAlign: "center",
  },
  closeButton: {
    padding: 10,
    borderWidth: 2,
    borderColor: "white",
  },
  closeButtonText: {
    color: "white",
    fontSize: 24,
    textAlign: "center",
    fontFamily: "DragonSlayer",
  },
  optionsButton: {
    borderColor: "black",
    flex: 1,
  },
  optionsText: {
    fontFamily: "DragonSlayer",
    fontSize: 22,
    paddingVertical: 6,
    letterSpacing: 1,
    textAlign: "center",
    color: "white",
  },
});
