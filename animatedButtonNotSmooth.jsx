import { Pressable, StyleSheet, Text, View } from "react-native";
import { forwardRef } from "react";
import { useTheme } from "../../providers/ThemeProvider";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const Button = forwardRef(
  ({ text, buttonColor, onPress, ...pressableProps }, ref) => {
    const { theme } = useTheme();
    const isPressed = useSharedValue(false);

    const handlePress = () => {
      onPress();
      isPressed.value = true;
      console.log(true);
    };

    const handleRelease = () => {
      isPressed.value = false;
      console.log(false);
    };
// add black overlay
    const animatedButtonStyle = useAnimatedStyle(() => {

      return {
        elevation: isPressed.value ? 2 : 4,
        // opacity: isPressed.value ? 0.95 : 1,
        transform: [
          {
            scale: isPressed.value ? 0.98 : 1,
          },
        ],

      };
    });

    return (
      <AnimatedPressable
        ref={ref}
        {...pressableProps}
        onPressIn={handlePress}
        onPressOut={handleRelease}
        style={[
          styles.button,
          styles.shadow,
          animatedButtonStyle,
          {
            // elevation: isPressed.value ? 0 : 10,
            backgroundColor: buttonColor,
            shadowColor: theme.inactiveTextColor,

          },
        ]}
      >

        <Text style={[styles.text, { color: theme.buttonTextColor }]}>
          {text}
        </Text>

      </AnimatedPressable>
    );
  }
);

export default Button;

const styles = StyleSheet.create({
  button: {
    flex: 1,
    padding: 10,
    alignItems: "center",
    borderRadius: 100,
    marginVertical: 10,
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
  },
  shadow: {
    
    // elevation:10,
  },
});


// previous 

import { Pressable, StyleSheet, Text, View } from "react-native";
import { forwardRef } from "react";
import { useTheme } from "../../providers/ThemeProvider";

const Button = forwardRef(({ text, buttonColor, ...pressableProps }, ref) => {
  const { theme } = useTheme();

  return (
    <Pressable
      ref={ref}
      {...pressableProps}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: pressed ? "#F29057" : buttonColor,
        },
      ]}
    >
      <Text style={[styles.text, { color: theme.buttonTextColor }]}>
        {text}
      </Text>
    </Pressable>
  );
});

export default Button;

const styles = StyleSheet.create({
  button: {
    flex: 1,
    padding: 10,
    alignItems: "center",
    borderRadius: 100,
    marginVertical: 10,
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
  },
});
