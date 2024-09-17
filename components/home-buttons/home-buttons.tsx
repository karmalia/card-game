import { ImageBackground, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Button } from "tamagui";
import { useRouter } from "expo-router";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const menuButtons = [
  {
    title: "START",
    imgUrl: require("@/assets/home/MenuButtonDistortOne.png"),
    action: {
      type: "route",
      value: "/gamescreen",
    },
    disabled: false,
  },
  {
    title: "HOW TO PLAY",
    imgUrl: require("@/assets/home/MenuButtonDistortOne.png"),
    action: {
      type: "modal",
      value: "how-to-play",
    },
    disabled: false,
  },
  {
    title: "LEADERBOARD",
    imgUrl: require("@/assets/home/MenuButtonDistortOne.png"),
    action: {
      type: "modal",
      value: "leaderboard",
    },
    disabled: true,
  },

  {
    title: "CREDITS",
    imgUrl: require("@/assets/home/MenuButtonDistortOne.png"),
    action: {
      type: "modal",
      value: "credits",
    },
    disabled: false,
  },
];

const HomeButtons = () => {
  const router = useRouter();
  const opacity = useSharedValue(0);

  function handleAction(action: any) {
    switch (action.type) {
      case "route":
        router.navigate(action.value);
        break;

      default:
        break;
    }
  }

  React.useEffect(() => {
    opacity.value = withTiming(1, {
      duration: 600,
      easing: Easing.linear,
    });
  }, []);

  const animatedStyles = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        animatedStyles,
        {
          flex: 1,
          gap: 8,
          zIndex: 0,
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
            borderRadius={"$12"}
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
    shadowColor: "black",
    elevation: 70,
    shadowOffset: {
      width: 4,
      height: 4,
    },
    shadowOpacity: 1,
    borderWidth: 1,
    borderColor: "transparent",
  },
});

export default HomeButtons;
