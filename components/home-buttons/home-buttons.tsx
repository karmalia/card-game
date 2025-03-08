import {
  Dimensions,
  ImageBackground,
  Keyboard,
  StyleSheet,
  Text,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Button } from "tamagui";
import { useRouter } from "expo-router";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Canvas, Path, Skia } from "@shopify/react-native-skia";
import { Sounds } from "@/stores/SoundProvider";

const menuButtons = [
  {
    title: "START",
    imgUrl: require("@/assets/home/TransparentMenuButton2.png"),
    action: {
      type: "route",
      value: "/loadingscreen",
    },
    disabled: false,
  },
  {
    title: "HOW TO PLAY",
    imgUrl: require("@/assets/home/TransparentMenuButton2.png"),
    action: {
      type: "modal",
      value: "how-to-play",
    },
    disabled: false,
  },
  {
    title: "LEADERBOARD",
    imgUrl: require("@/assets/home/TransparentMenuButton2.png"),
    action: {
      type: "modal",
      value: "leaderboard",
    },
    disabled: false,
  },

  // {
  //   title: "CREDITS",
  //   imgUrl: require("@/assets/home/TransparentMenuButton2.png"),
  //   action: {
  //     type: "modal",
  //     value: "credits",
  //   },
  //   disabled: true,
  // },
];

const HomeButtons = ({
  setInstructuresVisible,
  setLeaderboardVisible,
}: {
  setInstructuresVisible: (value: boolean) => void;
  setLeaderboardVisible: (value: boolean) => void;
}) => {
  const buttonWidth = Dimensions.get("screen").width * 0.3;
  const buttonHeight = Dimensions.get("screen").height * 0.1;
  console.log("buttonWidth", buttonWidth);

  const cornerRadius = 10; // Adjust for corner roundness
  const cornerSize = 20; // Adjust for corner shape size

  const createButtonPath = (width, height) => {
    const path = Skia.Path.Make();
    path.moveTo(0, cornerSize);
    path.lineTo(cornerSize, 0);
    path.lineTo(width - cornerSize, 0);
    path.lineTo(width, cornerSize);
    path.lineTo(width, height - cornerSize);
    path.lineTo(width - cornerSize, height);
    path.lineTo(cornerSize, height);
    path.lineTo(0, height - cornerSize);
    path.close();
    return path;
  };
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const { playSound } = useContext(Sounds)!;
  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setIsKeyboardVisible(true);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setIsKeyboardVisible(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
      // if (buttonSound) buttonSound.unloadAsync();
    };
  }, []);
  const router = useRouter();
  const opacity = useSharedValue(0);

  function handleAction(action: any) {
    playSound("clickDefault");
    if (action.type === "route") {
      router.navigate(action.value);
    }

    if (action.type === "modal") {
      switch (action.value) {
        case "how-to-play":
          setInstructuresVisible(true);

          break;
        case "leaderboard":
          setLeaderboardVisible(true);

          break;
        case "credits":
          break;
        default:
          break;
      }
    }
  }

  useEffect(() => {
    opacity.value = withTiming(1, {
      duration: 600,
      easing: Easing.linear,
    });
  }, []);

  const animatedStyles = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  if (isKeyboardVisible) return null;

  return (
    <Animated.View
      style={[
        animatedStyles,
        {
          flex: 1,
          gap: 8,
          zIndex: 0,
          justifyContent: "flex-end",
          paddingBottom: 16,
        },
      ]}
    >
      {menuButtons.map((button, index) => (
        <Button
          alignContent="flex-start"
          justifyContent="center"
          backgroundColor={"transparent"}
          onPress={() => handleAction(button.action)}
          key={button.title + index}
          disabled={button.disabled}
          unstyled
          style={[
            styles.button,
            {
              width: buttonWidth,
              height: buttonHeight,
              justifyContent: "center",
              alignItems: "center",
              opacity: button.disabled ? 0.6 : 1,
              position: "relative",
            },
          ]}
        >
          <Canvas
            style={{
              position: "absolute",
              width: buttonWidth,
              height: buttonHeight,
            }}
          >
            <Path
              path={createButtonPath(buttonWidth, buttonHeight)}
              color="rgba(255, 255, 255, 0.2)" // Adjust color as needed
            />
          </Canvas>
          <Text style={styles.buttonText}>{button.title}</Text>
        </Button>
      ))}
    </Animated.View>
  );
};

export const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    borderColor: "transparent",
  },
  buttonText: {
    fontFamily: "TrenchThin",
    fontSize: 24,
    textAlign: "center",
    letterSpacing: 2,

    color: "white",
  },
});

export default HomeButtons;
