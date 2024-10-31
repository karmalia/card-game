import { Dimensions } from "react-native";

function getCardDimension() {
  const { width: screenWidth } = Dimensions.get("window");
  const cardWidth = screenWidth * 0.11;
  const aspectRatio = 1.5;
  const cardHeight = cardWidth * aspectRatio;
  return { cardWidth, cardHeight };
}

export default getCardDimension;
