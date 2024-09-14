import { Dimensions, ImageBackground, StyleSheet } from "react-native";
import React from "react";
import { Button, Text, View } from "tamagui";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { TouchableOpacity } from "react-native-gesture-handler";

const menuButtons = [
  {
    title: "START",
    imgUrl: "@/assets/home/MenuButtons.png",
    action: {
      type: "route",
      value: "/gamescreen",
    },
    disabled: false,
  },
  {
    title: "HOW TO PLAY",
    imgUrl: "@/assets/home/MenuButtons.png",
    action: {
      type: "modal",
      value: "how-to-play",
    },
    disabled: false,
  },
  {
    title: "LEADERBOARD",
    imgUrl: "@/assets/home/MenuButtons.png",
    action: {
      type: "modal",
      value: "leaderboard",
    },
    disabled: true,
  },

  {
    title: "CREDITS",
    imgUrl: "@/assets/home/MenuButtons.png",
    action: {
      type: "modal",
      value: "credits",
    },
    disabled: false,
  },
];

const Index = () => {
  const router = useRouter();

  function handleAction(action: any) {
    switch (action.type) {
      case "route":
        router.navigate(action.value);
        break;

      default:
        break;
    }
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      <ImageBackground
        source={require("@/assets/backgrounds/canny_res_00522_.png")}
        resizeMode="stretch"
        style={styles.image}
      >
        <View
          style={{
            height: Dimensions.get("screen").height * 0.45,
          }}
        ></View>
        <View
          style={{
            flex: 1,
            gap: 8,
          }}
        >
          {menuButtons.map((button, index) => (
            <ImageBackground
              source={require("@/assets/home/MenuButtons.png")}
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
                padding="$0"
                margin="$0"
                borderRadius={"$12"}
                overflow="hidden"
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
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    shadowColor: "black",
    elevation: 11,
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.5,
    borderWidth: 2,
    borderColor: "transparent",
  },
  image: {
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "white",
    fontSize: 42,
    lineHeight: 84,
    fontWeight: "bold",
    textAlign: "center",
    backgroundColor: "#000000c0",
  },
});

export default Index;
