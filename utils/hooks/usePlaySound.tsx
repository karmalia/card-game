import React from "react";
import { Audio } from "expo-av";
import AsyncStorage from "@react-native-async-storage/async-storage";

const usePlaySound = () => {
  const [draw, setDraw] = React.useState();
  const [deleteCard, setDeleteCard] = React.useState();
  const [putOn, setPutOn] = React.useState();
  const [pullBack, setPullBack] = React.useState();

  async function playDraw() {
    const { sound } = await Audio.Sound.createAsync(
      require("@/assets/sound-effects/draw-card.wav")
    );
    setDraw(sound);

    await sound.playAsync();
  }

  async function playDelete() {
    const { sound } = await Audio.Sound.createAsync(
      require("@/assets/sound-effects/delete-card.wav")
    );
    setDeleteCard(sound);

    await sound.playAsync();
  }
  async function playPullBack() {
    const { sound } = await Audio.Sound.createAsync(
      require("@/assets/sound-effects/delete-card.wav")
    );
    setPullBack(sound);

    await sound.playAsync();
  }
  async function playPutOn() {
    const { sound } = await Audio.Sound.createAsync(
      require("@/assets/sound-effects/put-on.wav")
    );
    setPutOn(sound);

    await sound.playAsync();
  }

  React.useEffect(() => {
    return () => {
      draw && draw.unloadAsync();
      deleteCard && deleteCard.unloadAsync();
      pullBack && pullBack.unloadAsync();
      putOn && putOn.unloadAsync();
    };
  }, [draw, deleteCard, pullBack, putOn]);

  return {
    playDraw,
    playDelete,
    playPullBack,
    playPutOn,
  };
};

export default usePlaySound;
