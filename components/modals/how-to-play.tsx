import {
  Dimensions,
  ImageBackground,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import React from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Image, ScrollView } from "tamagui";

type OptionsProps = {
  visible: boolean;
  onClose: () => void;
  handleNavigation?: (type: "home" | "restart") => void;
};
const { height } = Dimensions.get("window");

const HowToPlay = ({ visible, onClose, handleNavigation }: OptionsProps) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(height);
  const zIndex = useSharedValue(0);

  if (visible) {
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

  return (
    <>
      <Animated.View style={[styles.background, animatedBackgroundStyle]} />
      <Animated.View style={[styles.modalContainer, animatedModalStyle]}>
        <ImageBackground
          source={require("@/assets/modals/options-modal.png")}
          resizeMethod="auto"
          resizeMode="stretch"
        >
          <View style={styles.container}>
            <ScrollView style={styles.modalContent}>
              <Text style={styles.modalTitle}>How to Play</Text>
              <Text style={styles.modalText}>
                1. At the start of the game, 5 cards are drawn automatically
                from the deck of 24 cards.
              </Text>
              <View
                style={{
                  width: "100%",
                  height: 200,
                  marginBottom: 20,
                }}
              >
                <Image
                  source={require("@/assets/how-to-play/game-started.jpg")}
                  style={{ width: "100%", height: "100%" }}
                  objectFit="contain"
                />
              </View>
              <Text style={styles.modalText}>
                2. The goal is to place cards either in a sequence or with the
                same color to score points.
              </Text>
              <View
                style={{
                  width: "100%",
                  height: 200,
                  marginBottom: 20,
                }}
              >
                <Image
                  source={require("@/assets/how-to-play/different-color-serialized.jpg")}
                  style={{ width: "100%", height: "100%" }}
                  objectFit="contain"
                />
              </View>
              {/* Dragging A Card */}
              <Text style={styles.modalText}>
                3. You need to place 3 cards in sequence (like 3-4-5), with the
                same or different colors. Matching the same color gives higher
                points.
              </Text>
              <View
                style={{
                  width: "100%",
                  height: 200,
                  marginBottom: 20,
                }}
              >
                <Image
                  source={require("@/assets/how-to-play/same-color-serialized.jpg")}
                  style={{ width: "100%", height: "100%" }}
                  objectFit="contain"
                />
              </View>
              {/* Same Color Squence */}
              <Text style={styles.modalText}>
                4. Another way to score is by placing 3 cards with the same
                number (like 8-8-8) with different colors.
              </Text>
              <View
                style={{
                  width: "100%",
                  height: 200,
                  marginBottom: 20,
                }}
              >
                <Image
                  source={require("@/assets/how-to-play/triple-eight.jpg")}
                  style={{ width: "100%", height: "100%" }}
                  objectFit="contain"
                />
              </View>

              <Text style={styles.modalText}>
                5. If no valid play is possible, discard one card by dragging it
                to the removal slot and draw a new card from the deck.
              </Text>
              <View
                style={{
                  width: "100%",
                  height: 200,
                  marginBottom: 20,
                }}
              >
                <Image
                  source={require("@/assets/how-to-play/delete-card.jpg")}
                  style={{ width: "100%", height: "100%" }}
                  objectFit="contain"
                />
              </View>
              <Text style={styles.modalText}>
                That is all you need to know to play the game.
              </Text>
              <Text style={styles.modalText}>
                Good luck and have fun playing!
              </Text>
            </ScrollView>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text
              style={{
                fontFamily: "DragonSlayer",
                fontSize: 30,
              }}
            >
              X
            </Text>
          </TouchableOpacity>
        </ImageBackground>
      </Animated.View>
    </>
  );
};

export default HowToPlay;

const styles = StyleSheet.create({
  background: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "black",
  },
  container: {
    flex: 1,
    paddingVertical: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    position: "absolute",
    maxWidth: Dimensions.get("window").width * 0.6,
    backgroundColor: "transparent",
    borderRadius: 10,
    alignSelf: "center",
    top: "20%",
  },
  modalContent: {
    width: "100%",
    gap: 0,
    display: "flex",
    flexDirection: "column",
    paddingHorizontal: 40,

    height: Dimensions.get("window").height * 0.6,
  },
  modalTitle: {
    fontFamily: "DragonSlayer",
    fontSize: 30,
    letterSpacing: 1,
    marginBottom: 20,
    textAlign: "center",
  },
  modalText: {
    fontSize: 18,
    marginBottom: 15,
    textAlign: "left",
  },
  closeButton: {
    position: "absolute",
    top: 20,
    right: 30,
  },
  closeButtonText: {
    color: "black",
    fontSize: 20,
    fontWeight: "bold",
  },
});
