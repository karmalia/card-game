import { Dimensions, Text, View, Modal, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import Stars from "./Stars/Stars";
import ConvertToMinuteString from "@/utils/convertToMinuteString";
import calculateTotalScore from "@/utils/calculateTotalScore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import firestore from "@react-native-firebase/firestore";
import useGameStore from "@/stores/game.store";
import useGameScoreStore from "@/stores/game-score.store";
import {
  TopLeft,
  TopRight,
  BottomLeft,
  BottomRight,
} from "@/components/skia-components/corners";

const GameOverModal = () => {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const { resetTime } = useGameScoreStore();
  const { point, populateDeck, gamePhase, restartGame } = useGameStore();
  const { time } = useGameScoreStore();
  const modalWidth = Math.min(Dimensions.get("screen").width * 0.8, 300);
  const modalHeight = Math.min(Dimensions.get("screen").height * 0.8, 400);

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
            height: modalHeight,
            width: modalWidth,
            paddingVertical: 20,
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 20, 0.8)",
            position: "relative",
          }}
        >
          {/* Add custom corners */}
          <TopLeft size={24} variant="edged" color="white" strokeWidth={2} />
          <TopRight size={24} variant="edged" color="white" strokeWidth={2} />
          <BottomLeft size={24} variant="edged" color="white" strokeWidth={2} />
          <BottomRight
            size={24}
            variant="edged"
            color="white"
            strokeWidth={2}
          />

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
                fontFamily: "TrenchThin",
                fontWeight: 600,
                fontSize: 32,
                color: "white",
                letterSpacing: 2,
              }}
            >
              POINT : <Text style={{ letterSpacing: 4 }}>{point}</Text>
            </Text>
            <Text
              style={{
                fontFamily: "TrenchThin",
                fontWeight: 600,
                fontSize: 32,
                color: "white",
                letterSpacing: 2,
              }}
            >
              TIME :{" "}
              <Text style={{ letterSpacing: 4 }}>
                {ConvertToMinuteString(time)}
              </Text>
            </Text>
            <Text
              style={{
                fontFamily: "TrenchThin",
                fontWeight: 600,
                fontSize: 32,
                color: "white",
                letterSpacing: 2,
              }}
            >
              SCORE :{" "}
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
            {/* Home button with corners */}
            <TouchableOpacity
              style={{
                height: 40,
                width: 120,
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
              }}
              onPress={() => {
                populateDeck();
                router.navigate("/");
                setModalVisible(false);
              }}
            >
              <Text
                style={{
                  fontFamily: "TrenchThin",
                  color: "#efefef",
                  fontSize: 28,
                  letterSpacing: 2,
                }}
              >
                HOME
              </Text>

              {/* Add corners to Home button */}
              <TopLeft size={12} variant="box" color="white" strokeWidth={1} />
              <TopRight size={12} variant="box" color="white" strokeWidth={1} />
              <BottomLeft
                size={12}
                variant="box"
                color="white"
                strokeWidth={1}
              />
              <BottomRight
                size={12}
                variant="box"
                color="white"
                strokeWidth={1}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                height: 40,
                width: 120,
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
              }}
              onPress={() => {
                resetTime();
                restartGame();
                setModalVisible(false);
              }}
            >
              <Text
                style={{
                  fontFamily: "TrenchThin",
                  color: "#efefef",
                  fontSize: 28,
                  letterSpacing: 2,
                }}
              >
                REPLAY
              </Text>

              {/* Add corners to Replay button */}
              <TopLeft size={12} variant="box" color="white" strokeWidth={1} />
              <TopRight size={12} variant="box" color="white" strokeWidth={1} />
              <BottomLeft
                size={12}
                variant="box"
                color="white"
                strokeWidth={1}
              />
              <BottomRight
                size={12}
                variant="box"
                color="white"
                strokeWidth={1}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default GameOverModal;
