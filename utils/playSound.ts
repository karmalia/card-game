import { Audio } from "expo-av";

export function playSound(sound: Audio.Sound | null) {
  if (sound) {
    try {
      sound.setPositionAsync(0); // Reset position to the start
      sound.playAsync();
    } catch (error) {
      console.log("Error playing sound", error);
    }
  }
}
