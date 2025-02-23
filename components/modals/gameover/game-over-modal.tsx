import {
  Dimensions,
  ImageBackground,
  Text,
  View,
  Modal,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import Stars from "./Stars/Stars";
import ConvertToMinuteString from "@/utils/convertToMinuteString";
import calculateTotalScore from "@/utils/calculateTotalScore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import firestore from "@react-native-firebase/firestore";
import useGameStore from "@/stores/game.store";
import useGameScoreStore from "@/stores/game-score.store";

const GameOverModal = () => {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const { resetTime } = useGameScoreStore();
  const { point, populateDeck, gamePhase, restartGame } = useGameStore();
  const { time } = useGameScoreStore();
  const modalWidth = Math.min(Dimensions.get("screen").width * 0.8, 300); // Adjusted modal width
  const modalHeight = Math.min(Dimensions.get("screen").height * 0.8, 400); //Adjusted modal height

  useEffect(() => {
    if (gamePhase === 3) {
      setModalVisible(true);
      checkAndUpdateScore();
    } else {
      setModalVisible(false);
    }
  }, [gamePhase]);

  async function checkAndUpdateScore() {
    try {
      const bestScore = await AsyncStorage.getItem("bestScore");
      const userId = await AsyncStorage.getItem("userId");
      const username = await AsyncStorage.getItem("username");
      const totalScore = calculateTotalScore(point, time);

      if (userId) {
        const userRef = firestore().collection("users").doc(userId);
        try {
          const userDoc = await userRef.get();
          if (userDoc.exists) {
            const best = bestScore ? JSON.parse(bestScore) : 0;
            if (totalScore > best) {
              await AsyncStorage.setItem(
                "bestScore",
                JSON.stringify(totalScore)
              );
              await userRef.update({ point, time, score: totalScore });
            }
          } else {
            throw new Error("User not found in database");
          }
        } catch (error) {
          console.error("Error updating score:", error);
        }
      } else {
        const newUserRef = await firestore().collection("users").add({
          nickname: username,
          point,
          time,
          score: totalScore,
        });
        await AsyncStorage.setItem("userId", newUserRef.id);
      }
    } catch (error) {
      console.error("Error updating score:", error);
    }
  }

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      statusBarTranslucent={true}
      onRequestClose={() => {
        setModalVisible(false);
      }}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      >
        <View
          style={{
            borderWidth: 1,
            borderColor: "white",
            height: modalHeight,
            width: modalWidth,
            paddingVertical: 20,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View style={{ height: "30%", width: "100%", alignItems: "center" }}>
            <Stars starCount={2} />
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: "space-around",
              width: "100%",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontFamily: "DragonSlayer",
                fontWeight: 600,
                fontSize: 32,
                color: "white",
                letterSpacing: 2,
              }}
            >
              point <Text style={{ letterSpacing: 4 }}>{point}</Text>
            </Text>
            <Text
              style={{
                fontFamily: "DragonSlayer",
                fontWeight: 600,
                fontSize: 32,
                color: "white",
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
                fontSize: 32,
                color: "white",
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
              paddingTop: 12,
              paddingHorizontal: 20,
              flexDirection: "row",
              justifyContent: "center",
              gap: 20,
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
                setModalVisible(false);
              }}
            >
              <Text
                style={{
                  fontFamily: "DragonSlayer",
                  color: "#efefef",
                  fontSize: 28,
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
              onPress={() => {
                resetTime();
                restartGame();
                setModalVisible(false);
              }}
            >
              <Text
                style={{
                  fontFamily: "DragonSlayer",
                  color: "#efefef",
                  fontSize: 28,
                  letterSpacing: 2,
                }}
              >
                REPLAY
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default GameOverModal;
