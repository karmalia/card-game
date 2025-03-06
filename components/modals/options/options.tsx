import {
  Animated as RNAnimated, // Using React Native's Animated instead
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useContext, useEffect, useId, useRef, useState } from "react";
import { Checkbox, Label, Stack } from "tamagui";
import Icons from "@/components/icons";
import { usePathname, useRouter } from "expo-router";
import { TouchableOpacity } from "react-native-gesture-handler";
import useGameStore from "@/stores/game.store";
import { Sounds, useSound } from "@/stores/SoundProvider";
import useGameScoreStore from "@/stores/game-score.store";
import {
  BottomLeft,
  BottomRight,
  TopLeft,
  TopRight,
} from "@/components/skia-components/corners";
import { Settings } from "lucide-react-native";

const { height, width } = Dimensions.get("window");

const checkboxSize = width * 0.025;

const Options = () => {
  const { gameSounds, setVolumeForSounds } = useSound();
  const [optionsVisible, setOptionsVisible] = useState(false);
  const router = useRouter();
  const { populateDeck, setGamePhase, restartGame } = useGameStore();
  const { resetTime } = useGameScoreStore();
  const { playSound } = useContext(Sounds)!;

  const soundsId = useId();
  const pathname = usePathname();

  // Animation value for content sliding
  const slideAnimation = useRef(new RNAnimated.Value(height)).current;

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
    closeModal();
  }

  // Function to open modal with animation
  const openModal = () => {
    setOptionsVisible(true);
    RNAnimated.timing(slideAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  // Function to close modal with animation
  const closeModal = () => {
    RNAnimated.timing(slideAnimation, {
      toValue: height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setOptionsVisible(false);
    });
  };

  // Close options when route changes
  useEffect(() => {
    if (optionsVisible) {
      closeModal();
    }
  }, [pathname]);

  return (
    <>
      {/* Settings button */}
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
              openModal();
            }}
            style={{
              padding: 10,
              position: "relative",
              width: 50,
              height: 50,
            }}
          >
            <TopRight size={12} variant="edged" strokeWidth={2} />
            <TopLeft size={12} variant="edged" strokeWidth={2} />
            <BottomLeft size={12} variant="edged" strokeWidth={2} />
            <BottomRight size={12} variant="edged" strokeWidth={2} />
            <Settings width={30} height={30} color={"white"} />
          </TouchableOpacity>
        </Stack>
      </View>

      {/* Native Modal with fixed background */}
      <Modal
        visible={optionsVisible}
        transparent={true}
        animationType="none"
        onRequestClose={() => {
          playSound("clickSoundSeven");
          closeModal();
        }}
        statusBarTranslucent={true}
      >
        {/* Fixed background that appears immediately */}
        <View style={styles.background}>
          {/* Animated content that slides up */}
          <RNAnimated.View
            style={[
              styles.modalContainer,
              { transform: [{ translateY: slideAnimation }] },
            ]}
          >
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>OPTIONS</Text>
                {/* Add corners to the modal */}
                <TopLeft size={16} variant="edged" strokeWidth={2} />
                <TopRight size={16} variant="edged" strokeWidth={2} />
                <BottomLeft size={16} variant="edged" strokeWidth={2} />
                <BottomRight size={16} variant="edged" strokeWidth={2} />
              </View>

              {/* Sound toggle */}
              <View style={styles.optionRow}>
                <Text style={styles.modalOptionText}>SOUNDS</Text>
                <Checkbox
                  size={"$4"}
                  id={soundsId}
                  checked={gameSounds.status}
                  onCheckedChange={() => {
                    setVolumeForSounds(!gameSounds.status);
                  }}
                  display="none"
                />

                <View style={styles.checkboxWrapper}>
                  <Label style={styles.modalLabel} htmlFor={soundsId} />
                  {gameSounds.status && (
                    <View style={styles.checkboxContainer}>
                      <Icons.Check width={checkboxSize} height={checkboxSize} />
                    </View>
                  )}
                </View>
              </View>

              {/* Navigation buttons for game screen */}
              {pathname === "/gamescreen" && (
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
                    <TouchableOpacity
                      onPress={() => handleNavigation("restart")}
                    >
                      <Text style={styles.optionsText}>RESTART</Text>
                    </TouchableOpacity>
                  </View>
                </Stack>
              )}

              {/* Close button for home screen */}
              {pathname === "/" && (
                <Pressable
                  style={styles.closeButton}
                  onPress={() => {
                    playSound("clickSoundSeven");
                    closeModal();
                  }}
                  hitSlop={10}
                >
                  <Text style={styles.closeButtonText}>CLOSE</Text>
                </Pressable>
              )}
            </View>
          </RNAnimated.View>
        </View>
      </Modal>
    </>
  );
};

export default Options;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "rgba(0, 0, 20, 0.8)",
    borderWidth: 1,
    borderColor: "#444",
  },
  modalContent: {
    width: width * 0.4,
    height: height * 0.6,
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.05,
    gap: 12,
    justifyContent: "space-between",
    position: "relative",
  },
  modalHeader: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    position: "relative",
  },
  modalTitle: {
    fontSize: width * 0.05,
    color: "white",
    letterSpacing: 4,
    fontFamily: "TrenchThin",
    flex: 1,
    textAlign: "center",
  },
  optionRow: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    justifyContent: "space-between",
  },
  checkboxWrapper: {
    position: "relative",
    width: width * 0.04,
    height: width * 0.04,
    borderWidth: 1,
    borderColor: "#666",
  },
  modalLabel: {
    width: width * 0.04,
    height: width * 0.04,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    zIndex: 10,
  },
  modalOptionText: {
    fontFamily: "TrenchThin",
    fontSize: width * 0.04,
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
  },
  closeButton: {
    width: width * 0.32,
    padding: 10,
    borderWidth: 2,
    borderColor: "white",
    alignSelf: "center",
  },
  closeButtonText: {
    color: "white",
    fontSize: width * 0.03,
    textAlign: "center",
    fontFamily: "TrenchThin",
  },
  optionsButton: {
    borderColor: "black",
    flex: 1,
  },
  optionsText: {
    fontFamily: "TrenchThin",
    fontSize: 28,
    paddingVertical: 6,
    letterSpacing: 1,
    textAlign: "center",
    color: "white",
  },
});
