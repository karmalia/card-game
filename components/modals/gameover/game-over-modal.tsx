import { Dimensions, ImageBackground, Modal, Text, View } from "react-native";
import React from "react";

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
  withDelay,
} from "react-native-reanimated";
import useGameStore from "@/stores/game.store";
import { Button, ScrollView } from "tamagui";
import Leaderboard from "@/components/leaderboard/leaderboard";
import { green } from "react-native-reanimated/lib/typescript/reanimated2/Colors";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useRouter } from "expo-router";

function getScore(score: number) {
  if (score < 300) {
    return "bronze";
  } else if (score >= 300 && score <= 399) {
    return "silver";
  } else if (score >= 400) {
    return "gold";
  } else {
    return "bronze";
  }
}

const GameOverModal = ({
  restartGame,
  setGameOver,
}: {
  restartGame: () => void;
  setGameOver: (value: boolean) => void;
}) => {
  const router = useRouter();
  const sharedOpacity = useSharedValue(0);
  const sharedWidth = useSharedValue(0);
  const sharedHeight = useSharedValue(0);
  const { score, populateDeck } = useGameStore();
  const modalWidth = Math.min(Dimensions.get("screen").width * 0.3, 250);
  const modalHeight = Math.min(Dimensions.get("screen").height * 0.8, 300);

  React.useEffect(() => {
    sharedOpacity.value = withTiming(1, {
      duration: 200,
      easing: Easing.linear,
    });
    sharedHeight.value = withDelay(
      200,
      withTiming(modalHeight, {
        duration: 200,
        easing: Easing.bounce,
      })
    );
    sharedWidth.value = withDelay(
      200,
      withTiming(modalWidth, {
        duration: 200,
        easing: Easing.bounce,
      })
    );
  }, []);

  const ModalBg = {
    bronze: require("@/assets/modals/OneStarModal.png"),
    silver: require("@/assets/modals/TwoStarModal.png"),
    gold: require("@/assets/modals/ThreeStarModal.png"),
  };

  const wrapperAnimated = useAnimatedStyle(() => ({
    opacity: sharedOpacity.value,
  }));
  const scoreBoardAnimated = useAnimatedStyle(() => ({
    width: sharedWidth.value,
    height: sharedHeight.value,
  }));
  return (
    <Animated.View
      style={[
        wrapperAnimated,
        {
          width: Dimensions.get("window").width,
          height: Dimensions.get("window").height,
          backgroundColor: "rgba(0,0,0,0.4)",
          position: "absolute",
          top: 0,
          left: 0,

          justifyContent: "center",
          alignItems: "center",
        },
      ]}
    >
      <Animated.View
        style={[
          {
            backgroundColor: "transparent",
            width: 0,
            height: 0,
            elevation: 50,
            shadowColor: "rgba(255,255,255,1)",
            shadowOffset: {
              width: 12,
              height: 12,
            },
            shadowOpacity: 1,
            shadowRadius: 2,
            padding: 0,
          },
          scoreBoardAnimated,
        ]}
      >
        <ImageBackground
          source={ModalBg[getScore(score)]}
          resizeMode="stretch"
          style={{
            height: "100%",
            width: "100%",
            position: "relative",
          }}
        >
          <Leaderboard />
          <View
            style={{
              position: "absolute",
              bottom: 0,

              height: "40%",

              width: "100%",
            }}
          >
            <Text
              style={{
                fontFamily: "DragonSlayer",
                fontWeight: 600,
                height: 40,
                textAlignVertical: "center",
                fontSize: 22,
                color: "white",
                textAlign: "center",
              }}
            >
              SCORE {score}
            </Text>

            <View
              style={{
                paddingTop: 14,

                paddingHorizontal: 20,
                flexDirection: "row",
                borderColor: "red",
                justifyContent: "center",
                gap: 14,
              }}
            >
              <ImageBackground
                source={require("@/assets/buttons/modalbutton.png")}
                resizeMethod="auto"
                resizeMode="stretch"
                style={{
                  width: 70,
                  height: 40,
                }}
              >
                <TouchableOpacity
                  style={{
                    paddingTop: 6,

                    height: "100%",
                  }}
                  onPress={() => {
                    populateDeck();
                    router.navigate("/");
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "DragonSlayer",
                      color: "#efefef",
                      textShadowColor: "rgba(0,0,0,0.4)",
                      textShadowRadius: 1,
                      textShadowOffset: {
                        width: 1,
                        height: 1,
                      },

                      letterSpacing: 1,
                      fontSize: 17,
                      textAlign: "center",
                    }}
                  >
                    HOME
                  </Text>
                </TouchableOpacity>
              </ImageBackground>
              <ImageBackground
                source={require("@/assets/buttons/modalbutton.png")}
                resizeMethod="auto"
                resizeMode="stretch"
                style={{
                  width: 70,
                  height: 40,
                }}
              >
                <TouchableOpacity
                  style={{
                    paddingTop: 6,

                    height: "100%",
                  }}
                  onPress={restartGame}
                >
                  <Text
                    style={{
                      fontFamily: "DragonSlayer",
                      color: "#efefef",
                      textShadowColor: "rgba(0,0,0,0.4)",
                      textShadowRadius: 1,
                      textShadowOffset: {
                        width: 1,
                        height: 1,
                      },

                      letterSpacing: 1,
                      fontSize: 17,
                      textAlign: "center",
                    }}
                  >
                    REPLAY
                  </Text>
                </TouchableOpacity>
              </ImageBackground>
            </View>
          </View>
        </ImageBackground>
      </Animated.View>
    </Animated.View>
  );
};

export default GameOverModal;
