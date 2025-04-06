import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  BackHandler,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Image, ScrollView } from "tamagui";
import {
  BottomLeft,
  BottomRight,
  TopLeft,
  TopRight,
} from "../skia-components/corners";

type HowToPlayProps = {
  visible: boolean;
  onClose: () => void;
};

// Tutorial content items
const tutorialItems = [
  {
    id: 1,
    text: "At the start of the game, 5 cards are drawn automatically from the deck of 24 cards.",
    image: require("@/assets/how-to-play/game-started-new.jpg"),
  },
  {
    id: 2,
    text: "The goal is to place cards either in a sequence or with the same color to get points.",
    image: require("@/assets/how-to-play/different-color-sequence-new.jpg"),
  },
  {
    id: 3,
    text: "You need to place 3 cards in sequence (like 6-7-8), with the same or different colors. Matching the same color gives higher points.",
    image: require("@/assets/how-to-play/same-color-serialized.jpg"),
  },
  {
    id: 4,
    text: "Another way to points is by placing 3 cards with the same number (like 8-8-8) with different colors.",
    image: require("@/assets/how-to-play/triple-eight-new.jpg"),
  },
  {
    id: 5,
    text: "If no valid play is possible, discard one card by dragging it to the removal slot and draw a new card from the deck.",
    image: require("@/assets/how-to-play/discard-new.jpg"),
  },
  {
    id: 6,
    text: "The game ends when the deck is empty and no more valid plays",
    image: require("@/assets/how-to-play/game-over-new.jpg"),
  },
];

const { height: screenHeight } = Dimensions.get("screen");
const HowToPlay = ({ visible, onClose }: HowToPlayProps) => {
  const translateY = useSharedValue(screenHeight);
  const [scrollHeight, setScrollHeight] = useState(0);
  const zIndex = useSharedValue(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const sharedIndicator = useSharedValue(0);

  if (visible) {
    translateY.value = withTiming(0, { duration: 300 });
    zIndex.value = withTiming(1, { duration: 300 });
  } else {
    zIndex.value = withTiming(0, { duration: 300 });
    translateY.value = withTiming(screenHeight, { duration: 300 });
  }

  const animatedBackgroundStyle = useAnimatedStyle(() => ({
    zIndex: zIndex.value,
  }));

  const animatedModalStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    zIndex: zIndex.value,
  }));

  const animatedIndicator = useAnimatedStyle(() => ({
    transform: [{ translateY: sharedIndicator.value * 30 }],
  }));

  // Handle Android back button
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (visible) {
          onClose();
          return true;
        }
        return false;
      }
    );

    return () => backHandler.remove();
  }, [visible, onClose]);

  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    sharedIndicator.value = (offsetY / scrollHeight) * 4;
  };

  return (
    <Animated.View style={[styles.background, animatedBackgroundStyle]}>
      <Animated.View style={[styles.modalContainer, animatedModalStyle]}>
        <TopLeft size={12} variant="edged" strokeWidth={2} />
        <TopRight size={12} variant="edged" strokeWidth={2} />
        <BottomLeft size={12} variant="edged" strokeWidth={2} />
        <BottomRight size={12} variant="edged" strokeWidth={2} />
        <View style={styles.header}>
          <Text style={styles.modalTitle}>How to Play</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <View style={styles.closeButtonContainer}>
              <TopLeft size={8} variant="box" strokeWidth={1} />
              <TopRight size={8} variant="box" strokeWidth={1} />
              <BottomLeft size={8} variant="box" strokeWidth={1} />
              <BottomRight size={8} variant="box" strokeWidth={1} />
              <Text style={styles.closeButtonText}>X</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.contentContainer}>
          <Animated.View style={[styles.scrollIndicator, animatedIndicator]} />

          <ScrollView
            style={styles.modalContent}
            showsVerticalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            ref={scrollViewRef}
            onContentSizeChange={(_, height) => setScrollHeight(height)}
          >
            {/* Map through tutorial items */}
            {tutorialItems.map((item) => (
              <View key={item.id} style={styles.tutorialItem}>
                <Text style={styles.modalText}>
                  {item.id}. {item.text}
                </Text>
                <View style={styles.imageContainer}>
                  <Image
                    source={item.image}
                    style={{ width: "100%", height: "100%" }}
                    objectFit="contain"
                  />
                </View>
              </View>
            ))}

            {/* Footer message */}
            <View style={styles.footer}>
              <Text style={styles.modalText}>
                That is all you need to know to play the game.
              </Text>
              <Text style={styles.modalText}>
                {"Good luck and have fun playing : )"}
              </Text>
            </View>
          </ScrollView>
        </View>
      </Animated.View>
    </Animated.View>
  );
};

export default HowToPlay;

const styles = StyleSheet.create({
  background: {
    position: "absolute",
    top: 0,
    left: 0,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    height: Dimensions.get("window").height * 0.8,
    width: Dimensions.get("window").width * 0.6,
    backgroundColor: "rgba(0, 0, 20, 0.8)",
    overflow: "hidden",
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    borderBottomColor: "white",
    borderBottomWidth: 1,
    alignItems: "center",
    padding: 20,
  },
  contentContainer: {
    position: "relative",
    paddingTop: 5,
    paddingBottom: 15,
  },
  scrollIndicator: {
    width: 12,
    height: 100,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "white",
    position: "absolute",
    right: 5,
    top: 25,
    zIndex: 12,
    marginBottom: 10,
  },
  modalContent: {
    width: "100%",
    height: "100%",
    gap: 0,
    paddingVertical: 10,
    display: "flex",
    flexDirection: "column",
    paddingHorizontal: 40,
  },
  tutorialItem: {
    marginBottom: 10,
  },
  imageContainer: {
    width: "100%",
    height: 200,
    marginBottom: 20,
  },
  footer: {
    height: 160,
  },
  modalTitle: {
    fontFamily: "TrenchThin",
    fontSize: 30,
    letterSpacing: 2,
    color: "white",
  },
  modalText: {
    marginTop: 10,
    fontSize: 22,
    marginBottom: 15,
    textAlign: "left",
    color: "white",
    fontFamily: "TrenchThin",
  },
  closeButton: {
    position: "absolute",
    top: 15,
    right: 15,
  },
  closeButtonContainer: {
    width: 40,
    height: 40,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 22,
    color: "white",
    fontFamily: "TrenchThin",
  },
});
