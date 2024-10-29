import { Dimensions, ImageBackground, Text, View } from "react-native";
import React from "react";

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
  withDelay,
} from "react-native-reanimated";
import useGameStore from "@/stores/game.store";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useRouter } from "expo-router";
import Stars from "./Stars/Stars";
import ConvertToMinuteString from "@/utils/convertToMinuteString";
import calculateTotalScore from "@/utils/calculateTotalScore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import firestore from "@react-native-firebase/firestore";

const GameOverModal = ({ restartGame }: { restartGame: () => void }) => {
  const router = useRouter();
  const sharedOpacity = useSharedValue(0);
  const sharedWidth = useSharedValue(0);

  const { point, populateDeck, time, gamePhase } = useGameStore();
  const modalWidth = Math.min(Dimensions.get("screen").width * 0.3, 250);
  const modalHeight = Math.min(Dimensions.get("screen").height * 0.8, 300);

  React.useEffect(() => {
    sharedOpacity.value = withTiming(1, {
      duration: 200,
      easing: Easing.linear,
    });

    sharedWidth.value = withDelay(
      200,
      withTiming(modalWidth, {
        duration: 200,
        easing: Easing.bounce,
      })
    );

    async function checkAndUpdateScore() {
      try {
        const bestScore = await AsyncStorage.getItem("bestScore");
        const userId = await AsyncStorage.getItem("userId");
        const username = await AsyncStorage.getItem("username");
        const totalScore = calculateTotalScore(point, time);

        if (userId) {
          const userRef = firestore().collection("users").doc(userId);

          const userDoc = await userRef.get();
          if (userDoc.exists) {
            const best = bestScore ? JSON.parse(bestScore) : 0;

            if (totalScore > best) {
              await AsyncStorage.setItem(
                "bestScore",
                JSON.stringify(totalScore)
              );

              await userRef.update({
                point,
                time,
                score: totalScore,
              });
            }
          } else {
            console.error("User document not found.");
          }
        } else {
          const newUserRef = await firestore().collection("users").add({
            nickname: username,
            point,
            time,
            score: totalScore,
          });

          // Store the new document ID in AsyncStorage
          await AsyncStorage.setItem("userId", newUserRef.id);
        }
      } catch (error) {
        console.error("Error updating score:", error);
      }
    }

    gamePhase === 3 && checkAndUpdateScore();
  }, [gamePhase]);

  const wrapperAnimated = useAnimatedStyle(() => ({
    opacity: sharedOpacity.value,
  }));
  const scoreBoardAnimated = useAnimatedStyle(() => ({
    width: sharedWidth.value,
  }));
  return (
    <Animated.View
      style={[
        {
          width: Dimensions.get("window").width,
          height: Dimensions.get("window").height,
          position: "absolute",
          top: 0,
          left: 0,

          justifyContent: "center",
          alignItems: "center",
        },
        wrapperAnimated,
      ]}
    >
      <ImageBackground
        source={require("@/assets/modals/TransparentGameover.png")}
        resizeMode="stretch"
        style={{
          height: modalHeight,
          width: modalWidth,
          paddingVertical: 20,
        }}
      >
        <Animated.View
          style={[
            scoreBoardAnimated,
            {
              height: "30%",
            },
          ]}
        >
          <Stars starCount={2} />
        </Animated.View>
        <View
          style={{
            flex: 1,
            justifyContent: "space-around",
            width: "100%",
          }}
        >
          <Text
            style={{
              fontFamily: "DragonSlayer",
              fontWeight: 600,
              textAlignVertical: "center",
              fontSize: 32,
              color: "white",
              textAlign: "center",
              letterSpacing: 2,
            }}
          >
            point{" "}
            <Text
              style={{
                letterSpacing: 4,
              }}
            >
              {point}
            </Text>
          </Text>

          <Text
            style={{
              fontFamily: "DragonSlayer",
              fontWeight: 600,
              textAlignVertical: "center",
              fontSize: 32,
              color: "white",
              textAlign: "center",
              letterSpacing: 2,
            }}
          >
            TIME{" "}
            <Text style={{ letterSpacing: 4 }}>
              {ConvertToMinuteString(time)}
            </Text>
          </Text>
          <Text
            style={{
              fontFamily: "DragonSlayer",
              fontWeight: 600,
              textAlignVertical: "center",
              fontSize: 32,
              color: "white",
              textAlign: "center",
              letterSpacing: 2,
            }}
          >
            SCORE{" "}
            <Text style={{ letterSpacing: 4 }}>
              {calculateTotalScore(point, time)}
            </Text>
          </Text>
        </View>
        <View
          style={{
            paddingTop: 14,

            paddingHorizontal: 20,
            flexDirection: "row",
            justifyContent: "center",
            gap: 18,
          }}
        >
          <TouchableOpacity
            style={{
              height: 40,
              justifyContent: "center",
              alignItems: "center",
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
                fontSize: 28,
                paddingBottom: 2,
                letterSpacing: 2,
              }}
            >
              HOME
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              height: 40,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={restartGame}
          >
            <Text
              style={{
                fontFamily: "DragonSlayer",
                color: "#efefef",
                fontSize: 28,
                paddingBottom: 2,
                letterSpacing: 2,
              }}
            >
              REPLAY
            </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </Animated.View>
  );
};

export default GameOverModal;
