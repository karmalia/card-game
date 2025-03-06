import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import {
  BottomLeft,
  BottomRight,
  TopLeft,
  TopRight,
} from "@/components/skia-components/corners";
import firestore from "@react-native-firebase/firestore";
import ConvertToMinuteString from "@/utils/convertToMinuteString";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FlatList } from "react-native-gesture-handler";
type LeaderboardProps = {
  visible: boolean;
  onClose: () => void;
};

const romanNumbers = [
  "I",
  "II",
  "III",
  "IV",
  "V",
  "VI",
  "VII",
  "VIII",
  "IX",
  "X",
];

const { height: screenHeight } = Dimensions.get("screen");
const Leaderboard = ({ visible, onClose }: LeaderboardProps) => {
  const [userId, setUserId] = useState<string | null>(null);
  const translateY = useSharedValue(screenHeight);
  const zIndex = useSharedValue(0);
  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const leaderboardData = await firestore()
          .collection("users")
          .orderBy("score", "desc")
          .limit(10)
          .get();

        const playersList = leaderboardData.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        //if it is production, use the data from firestore, else use the dummy data
        if (process.env.NODE_ENV === "production") {
          setPlayers(playersList);
        } else {
          setPlayers(playersList);
        }
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      } finally {
        setLoading(false);
        const userId = await AsyncStorage.getItem("userId");
        setUserId(userId);
      }
    };

    if (visible) {
      fetchLeaderboard();
    }
  }, [visible]);

  const renderHeader = () => (
    <View style={styles.tableHeader}>
      <Text style={styles.headerText}>Rank</Text>
      <Text style={styles.headerText}>Nickname</Text>
      <Text style={styles.headerText}>Point</Text>
      <Text style={styles.headerText}>Time</Text>
      <Text style={styles.headerText}>Score</Text>
    </View>
  );

  const renderRow = ({ item, index }: { item: any; index: number }) => (
    <View key={item.id} style={styles.tableRow}>
      <Text style={styles.rowText}>{romanNumbers[index]}</Text>
      <Text
        style={[
          styles.rowText,
          { color: item.id === userId ? "gold" : "white" },
        ]}
      >
        {item.nickname.slice(0, 9)}
      </Text>
      <Text style={styles.rowText}>{item.point}</Text>
      <Text style={styles.rowText}>{ConvertToMinuteString(item.time)}</Text>
      <Text style={styles.rowText}>{item.score}</Text>
    </View>
  );

  return (
    <>
      <Animated.View style={[styles.background, animatedBackgroundStyle]}>
        <Animated.View style={[styles.modalContainer, animatedModalStyle]}>
          <TopLeft size={8} />
          <TopRight size={8} />
          <BottomLeft size={8} />
          <BottomRight size={8} />
          <Text style={styles.modalTitle}>LEADERBOARD</Text>
          <View style={styles.divider} />
          {loading ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ActivityIndicator size="large" color="white" />
            </View>
          ) : (
            <FlatList
              data={players}
              keyExtractor={(item) => item.id}
              renderItem={renderRow}
              ListHeaderComponent={renderHeader}
              contentContainerStyle={styles.flatListContent}
              scrollEnabled={true}
              style={styles.flatList}
              stickyHeaderIndices={[0]}
            />
          )}

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </>
  );
};

export default Leaderboard;

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
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    overflow: "hidden",
    padding: 12,
    gap: 12,
  },
  modalTitle: {
    fontFamily: "TrenchThin",
    fontSize: 28,
    letterSpacing: 2,
    color: "#efefef",
    textAlign: "center",
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "#888",
  },
  flatList: {
    flex: 1, // Ensures FlatList takes up all available space
  },
  flatListContent: {
    paddingBottom: 20, // Extra padding at the bottom for scrolling
  },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    backgroundColor: "#111",
    borderBottomWidth: 1,
    borderBottomColor: "#888",
  },

  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: "gray",
    overflow: "scroll",
  },
  headerText: {
    fontFamily: "TrenchThin",
    fontSize: 16,
    color: "white",
    letterSpacing: 2,
    width: "20%",
    textAlign: "center",
  },
  rowText: {
    fontFamily: "TrenchThin",
    letterSpacing: 2,
    fontSize: 16,
    color: "white",
    width: "20%",
    textAlign: "center",
  },
  closeButton: {
    alignSelf: "center",
    borderColor: "#888",
    borderWidth: 1,
    width: "100%",
  },
  closeButtonText: {
    color: "#efefef",
    textAlign: "center",
    fontSize: 18,
    fontFamily: "TrenchThin",
    letterSpacing: 2,
    paddingVertical: 8,
  },
});
