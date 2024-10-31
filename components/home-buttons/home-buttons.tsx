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
import { Sounds } from "@/stores/SoundProvider";

const menuButtons = [
  {
    title: "START",
    imgUrl: require("@/assets/home/TransparentMenuButton2.png"),
    action: {
      type: "route",
      value: "/gamescreen",
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
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const { playClickDefault } = useContext(Sounds)!;
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
    playClickDefault();
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
        <ImageBackground
          source={button.imgUrl}
          resizeMode="stretch"
          style={[
            styles.button,
            {
              opacity: button.disabled ? 0.6 : 1,
            },
          ]}
          key={button.title + index}
        >
          <Button
            alignContent="flex-start"
            justifyContent="center"
            backgroundColor={"transparent"}
            onPress={() => handleAction(button.action)}
            disabled={button.disabled}
            style={{
              width: Dimensions.get("screen").width * 0.3,
              height: Dimensions.get("screen").height * 0.1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontFamily: "DragonSlayer",
                fontSize: Dimensions.get("screen").height * 0.05,
                textAlign: "center",
                letterSpacing: 2,
                color: "white",
              }}
            >
              {button.title}
            </Text>
          </Button>
        </ImageBackground>
      ))}
    </Animated.View>
  );
};

export const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    borderColor: "transparent",
  },
});

export default HomeButtons;
