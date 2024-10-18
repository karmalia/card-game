import { Svg, Polyline } from "react-native-svg";

const Icons = {
  Check: (props: any) => {
    return (
      <Svg
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 50 50"
        width="50px"
        height="50px"
        {...props}
      >
        <Polyline
          fill="none"
          stroke="#fff"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit="10"
          points="7,28.852 21.921,42.348 43,9.652 "
        />
      </Svg>
    );
  },
};

export default Icons;
