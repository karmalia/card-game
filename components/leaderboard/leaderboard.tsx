import { Dimensions, StyleSheet, Text, View } from "react-native";
import React from "react";
import { FlatList } from "react-native-gesture-handler";

type Props = {};

const leaderboardData = [
  { id: "1", name: "Player 1", points: 1200 },
  { id: "2", name: "Player 2", points: 1100 },
  { id: "3", name: "Player 3", points: 1000 },
  { id: "4", name: "Player 4", points: 900 },
  { id: "5", name: "Player 5", points: 800 },
  { id: "6", name: "Player 6", points: 700 },
  { id: "7", name: "Player 7", points: 600 },
  { id: "8", name: "Player 8", points: 500 },
  { id: "9", name: "Player 9", points: 400 },
  { id: "10", name: "Player 10", points: 300 },
];

const renderItem = ({ item, index }: any) => (
  <View style={styles.row}>
    <Text style={styles.position}>{index + 1}</Text>
    <Text style={styles.name}>{item.name}</Text>
    <Text style={styles.points}>{item.points}</Text>
  </View>
);

const Leaderboard = (props: Props) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>LEADERBOARD</Text>
      </View>
      <FlatList
        data={leaderboardData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default Leaderboard;

const fontSize = 8;
const fontFamily = "DragonSlayer";
const styles = StyleSheet.create({
  container: {
    height: "27%",
    marginTop: Dimensions.get("window").height * 0.18,
    marginHorizontal: "8%",
    backgroundColor: "white",
  },
  header: {
    textAlign: "center",
    borderBottomColor: "#ccc",
  },
  headerText: {
    fontSize: 12,
    fontFamily,
    textAlign: "center",
    letterSpacing: 1,
    textDecorationLine: "underline",
  },
  row: {
    flexDirection: "row",
    paddingVertical: 1,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  position: {
    flex: 0.5,
    fontSize,
    fontFamily,
  },
  name: {
    flex: 2,
    fontSize,
    fontFamily,
  },
  points: {
    flex: 1,
    fontSize,
    fontFamily,
  },
});
