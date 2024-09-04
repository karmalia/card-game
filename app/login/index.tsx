import { StyleSheet } from "react-native";
import React from "react";
import { Button, Text, View } from "tamagui";
import { useRouter } from "expo-router";

const Index = () => {
  const router = useRouter();
  return (
    <View
      style={{
        flex: 1,
        padding: 20,
      }}
    >
      <Button onPress={() => router.navigate("/gamescreen")}>Go To Game</Button>
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({});
