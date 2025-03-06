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

//Start
//different color 1-2-3 , same color 1-2-3
//same color 3-3-3
//Discard - Draw
//Score-Timer

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

  const animatedIndicator = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: sharedIndicator.value * 30,
        },
      ],
    };
  });

  // Add this to handle Android back button
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
        <TopLeft size={8} />
        <TopRight size={8} />
        <BottomLeft size={8} />
        <BottomRight size={8} />
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            borderBottomColor: "white",
            borderBottomWidth: 1,
            alignItems: "center",
            padding: 20,
          }}
        >
          <Text style={styles.modalTitle}>How to Play</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <View
              style={{
                width: 40,
                height: 40,
                position: "relative",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TopLeft size={8} />
              <TopRight size={8} />
              <BottomLeft size={8} />
              <BottomRight size={8} />
              <Text
                style={{
                  fontSize: 22,
                  color: "white",
                  fontFamily: "TrenchThin",
                }}
              >
                X
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View
          style={{
            position: "relative",
            paddingTop: 5,
            paddingBottom: 15,
          }}
        >
          <Animated.View
            id={"indicator"}
            style={[
              {
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
              animatedIndicator,
            ]}
          />
          <ScrollView
            style={styles.modalContent}
            showsVerticalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            ref={scrollViewRef}
            onContentSizeChange={(_, height) => setScrollHeight(height)}
          >
            <Text style={styles.modalText}>
              1. At the start of the game, 5 cards are drawn automatically from
              the deck of 24 cards.
            </Text>
            <View
              style={{
                width: "100%",
                height: 200,
                marginBottom: 20,
              }}
            >
              <Image
                source={require("@/assets/how-to-play/game-started-new.png")}
                style={{ width: "100%", height: "100%" }}
                objectFit="contain"
              />
            </View>
            <Text style={styles.modalText}>
              2. The goal is to place cards either in a sequence or with the
              same color to get points.
            </Text>
            <View
              style={{
                width: "100%",
                height: 200,
                marginBottom: 20,
              }}
            >
              <Image
                source={require("@/assets/how-to-play/different-color-sequence-neww.png")}
                style={{ width: "100%", height: "100%" }}
                objectFit="contain"
              />
            </View>
            {/* Dragging A Card */}
            <Text style={styles.modalText}>
              3. You need to place 3 cards in sequence (like 6-7-8), with the
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
                source={require("@/assets/how-to-play/same-color-serialized-new.png")}
                style={{ width: "100%", height: "100%" }}
                objectFit="contain"
              />
            </View>
            {/* Same Color Squence */}
            <Text style={styles.modalText}>
              4. Another way to points is by placing 3 cards with the same
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
                source={require("@/assets/how-to-play/triple-eight-new.png")}
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
                source={require("@/assets/how-to-play/discard-new.png")}
                style={{ width: "100%", height: "100%" }}
                objectFit="contain"
              />
            </View>
            <Text style={styles.modalText}>
              6. The game ends when the deck is empty and no more valid plays
            </Text>
            <View
              style={{
                width: "100%",
                height: 200,
                marginBottom: 20,
              }}
            >
              <Image
                source={require("@/assets/how-to-play/game-over-new.png")}
                style={{ width: "100%", height: "100%" }}
                objectFit="contain"
              />
            </View>
            <View
              style={{
                height: 160,
              }}
            >
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
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    overflow: "hidden",
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
});
