import { ImageBackground, Keyboard, StyleSheet, Text } from "react-native";
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
  const { playClickOne } = useContext(Sounds)!;
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
    playClickOne();
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
            height={"$3"}
            width={"$20"}
            alignContent="flex-start"
            justifyContent="center"
            backgroundColor={"transparent"}
            onPress={() => handleAction(button.action)}
            disabled={button.disabled}
          >
            <Text
              style={{
                fontFamily: "DragonSlayer",
                fontSize: 18,
                textAlign: "center",
                letterSpacing: 2,
                elevation: 4,
                textShadowColor: "rgba(0, 0, 0, 0.55)",
                textShadowOffset: { width: 0, height: 1 },
                textShadowRadius: 10,
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
