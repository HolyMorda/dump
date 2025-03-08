import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useRef, useEffect, useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

const RotatingChevron = ({ isRotated, color }) => {
  const rotation = useSharedValue(0);
  const [rotationState, setRotationState] = useState(false);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotateZ: `${rotation.value}deg` }],
    };
  });

  const rotate = () => {
    let rotationValue = isRotated ? -180 : 0;
    rotation.value = withTiming(rotationValue, { duration: 200 });
  };

  useEffect(() => {
    rotate();
    setRotationState(isRotated);
    
  }, [isRotated]);

  return (
    <Animated.View style={animatedStyle}>
      <AntDesign name="down" size={24} color={color} />
    </Animated.View>
  );
};

export default RotatingChevron;

const styles = StyleSheet.create({});
