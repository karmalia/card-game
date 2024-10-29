import React from "react";
import { Audio } from "expo-av";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { playSound } from "@/utils/playSound";

const usePlaySound = () => {
  const [draw, setDraw] = React.useState();
  const [deleteCard, setDeleteCard] = React.useState();
  const [putOn, setPutOn] = React.useState();
  const [pullBack, setPullBack] = React.useState();
  const [clickSoundOne, setClickSoundOne] = React.useState();
  const [clickSoundTwo, setClickSoundTwo] = React.useState();
  const [clickSoundThree, setClickSoundThree] = React.useState();
  const [clickSoundFour, setClickSoundFour] = React.useState();
  const [clickSoundFive, setClickSoundFive] = React.useState();
  const [clickSoundSix, setClickSoundSix] = React.useState();
  const [clickSoundSeven, setClickSoundSeven] = React.useState();

  async function playClickOne() {
    if (clickSoundOne) playSound(clickSoundOne);
  }

  async function playDraw() {
    if (draw) playSound(draw);
  }

  async function playDelete() {
    if (deleteCard) playSound(deleteCard);
  }
  async function playPullBack() {
    if (pullBack) playSound(pullBack);
  }
  async function playPutOn() {
    if (putOn) playSound(putOn);
  }

  React.useEffect(() => {
    async function loadSounds() {
      const isSoundsOn = await AsyncStorage.getItem("gameSounds");
      if (isSoundsOn === "true") {
        await Audio.Sound.createAsync(
          require("@/assets/sound-effects/click-1.wav")
        ).then(({ sound }) => {
          setClickSoundOne(sound);
        });
        await Audio.Sound.createAsync(
          require("@/assets/sound-effects/click-2.wav")
        ).then(({ sound }) => {
          setClickSoundTwo(sound);
        });
        await Audio.Sound.createAsync(
          require("@/assets/sound-effects/click-3.wav")
        ).then(({ sound }) => {
          setClickSoundThree(sound);
        });
        await Audio.Sound.createAsync(
          require("@/assets/sound-effects/click-4.wav")
        ).then(({ sound }) => {
          setClickSoundFour(sound);
        });
        await Audio.Sound.createAsync(
          require("@/assets/sound-effects/click-5.wav")
        ).then(({ sound }) => {
          setClickSoundFive(sound);
        });
        await Audio.Sound.createAsync(
          require("@/assets/sound-effects/click-6.wav")
        ).then(({ sound }) => {
          setClickSoundSix(sound);
        });
        await Audio.Sound.createAsync(
          require("@/assets/sound-effects/click-7.wav")
        ).then(({ sound }) => {
          setClickSoundSeven(sound);
        });

        await Audio.Sound.createAsync(
          require("@/assets/sound-effects/draw-card.wav")
        ).then(({ sound }) => {
          setDraw(sound);
        });
        await Audio.Sound.createAsync(
          require("@/assets/sound-effects/delete-card.wav")
        ).then(({ sound }) => {
          setDeleteCard(sound);
        });

        await Audio.Sound.createAsync(
          require("@/assets/sound-effects/put-on.wav")
        ).then(({ sound }) => {
          setPutOn(sound);
        });
        await Audio.Sound.createAsync(
          require("@/assets/sound-effects/draw-card.wav")
        ).then(({ sound }) => {
          setPullBack(sound);
        });
      }
    }
    loadSounds();

    return () => {
      draw && draw.unloadAsync();
      deleteCard && deleteCard.unloadAsync();
      pullBack && pullBack.unloadAsync();
      putOn && putOn.unloadAsync();
    };
  }, []);

  return {
    playDraw,
    playDelete,
    playPullBack,
    playPutOn,
    playClickOne,
  };
};

export default usePlaySound;
