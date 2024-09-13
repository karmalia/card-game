import { SafeAreaView } from "react-native-safe-area-context";
import { styled } from "tamagui";

const SafeAreaStyled = styled(SafeAreaView, {
  backgroundColor: "transparent",
  position: "relative",
  flex: 1,
  paddingHorizontal: "$2",
  paddingTop: "$4",
  paddingBottom: "$3",
});

export default SafeAreaStyled;
