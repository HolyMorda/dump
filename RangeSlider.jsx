import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  TextInput,
  Pressable,
} from "react-native";
import {
  GestureDetector,
  PanGestureHandler,
  Gesture,
  gestureHandlerRootHOC,
} from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  runOnUI,
  useAnimatedProps,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
  Easing,
  withDelay,
} from "react-native-reanimated";
import Ionicons from "@expo/vector-icons/Ionicons";

//Easing was braking tap animation previously
// make more responsive width on chevrons, make it depend on outside container
//deside between onEnd and onFinalize fo onValue change
//test range on low number of big steps

//needs flex:1 in parent view when used like a component

// make movements of tap and reset smooth

// mb add extra protection from overlaping by addition with fractions in buttons(like +0.1 or 1.1)
// somehow make reset resolve in one place , not in two or find another way
//reset press during animation
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

const WINDOW_WIDTH = Dimensions.get("window").width;
const TRACK_WIDTH = WINDOW_WIDTH * 0.7;
const TRACK_HEIGHT = 5;
const THUMB_SIZE = 18;
const TAP_SLIDING_DURATION = 500;
const SLIDER_ACTIVATION_DELAY = TAP_SLIDING_DURATION + 50;

const formatValueUi = (value) => {
  "worklet";
  return parseFloat(value.toFixed(2));
};
const formatValue = (value) => {
  return parseFloat(value.toFixed(2));
};

const RangeSlider = gestureHandlerRootHOC(
  ({
    minBoundary,
    maxBoundary,
    initialValue,
    step,
    onValueChange,
    onValueChangeForButtons,
    isReseted,
    labelText,
    inactiveTrackColor,
    activeTrackColor,
    thumbColor,
    labelsColor,
    buttonsColor,
  }) => {
    const stepSize = TRACK_WIDTH / ((maxBoundary - minBoundary) / step);
    const thumbPositionX = useSharedValue(
      (stepSize * (initialValue - minBoundary)) / step
    );
    const thumbPreviousPositionX = useSharedValue(
      (stepSize * (initialValue - minBoundary)) / step
    );
    const scaleThumb = useSharedValue(1);

    // const onValueChangeWithDelay = (currentValue) => {
    //   setTimeout(() => {
    //     onValueChange(currentValue);
    //   }, TAP_SLIDING_DURATION);
    // };

    useEffect(() => {
      let thumbPosition = (stepSize * (initialValue - minBoundary)) / step;

      thumbPositionX.value = withTiming(thumbPosition, {
        duration: TAP_SLIDING_DURATION,
        easing: Easing.quad,
      });
      // redundant , coef sets in parent(appearantly not)
      let currentValue = formatValue(
        minBoundary + Math.round(thumbPosition / stepSize) * step
      );
      // onValueChangeWithDelay(currentValue);
      onValueChange(currentValue);
    }, [isReseted]);

    const animatedActiveTrackStyle = useAnimatedStyle(() => {
      return {
        backgroundColor: activeTrackColor,
        height: TRACK_HEIGHT,
        marginTop: -TRACK_HEIGHT,
        borderRadius: TRACK_HEIGHT,
        width: thumbPositionX.value,
        transform: [{ translateX: 0 }],
      };
    });

    const animatedThumbStyle = useAnimatedStyle(() => {
      return {
        transform: [
          {
            translateX: thumbPositionX.value,
          },
          {
            scale: scaleThumb.value,
          },
        ],
      };
    });

    const animatedThumbLabelStyle = useAnimatedStyle(() => {
      return {
        transform: [
          {
            translateX: thumbPositionX.value,
          },
        ],
      };
    });

    const pan = Gesture.Pan()
      .onStart(() => {
        thumbPreviousPositionX.value = thumbPositionX.value;
      })
      .onUpdate((event) => {
        scaleThumb.value = 1.3;
        thumbPositionX.value =
          thumbPreviousPositionX.value + event.translationX < 0
            ? 0
            : thumbPreviousPositionX.value + event.translationX > TRACK_WIDTH
            ? TRACK_WIDTH
            : thumbPreviousPositionX.value + event.translationX;
      })
      .onEnd(() => {
        let thumbPosition =
          Math.round(thumbPositionX.value / stepSize) * stepSize;

        thumbPositionX.value =
          thumbPosition < 0
            ? 0
            : thumbPosition > TRACK_WIDTH
            ? TRACK_WIDTH
            : thumbPosition;

        let uncheckedValue = formatValueUi(
          minBoundary + Math.round(thumbPositionX.value / stepSize) * step
        );

        let currentValue =
          uncheckedValue < minBoundary
            ? minBoundary
            : uncheckedValue > maxBoundary
            ? maxBoundary
            : uncheckedValue;

        scaleThumb.value = 1;
        runOnJS(onValueChange)(currentValue);
      });

    // callback on timing is very helpfull
    // place full calculus inside callback function
    const isSliderAnimationGoing = useSharedValue(false);
    // const onValueChangeTap =(currentValue)=>{
    //   onValueChange(currentValue);
    //   setTimeout(() => {
    //     isSliderAnimationGoing.value = false;
    //   }, 100);
    //   // isSliderAnimationGoing.value = false;
    // }

    const delayedSliderActivation = () => {
      setTimeout(() => {
        isSliderAnimationGoing.value = false;
      }, SLIDER_ACTIVATION_DELAY);
    };

    const tap = Gesture.Tap().onFinalize((event) => {
      if (isSliderAnimationGoing.value === true) return;
      isSliderAnimationGoing.value = true;
      runOnJS(delayedSliderActivation)();
      let thumbPosition = Math.round(event.x / stepSize) * stepSize;

      // let currentValue = formatValueUi(
      //   minBoundary + Math.round(thumbPosition / stepSize) * step
      // );

      // let currentValue =
      //   uncheckedValue < minBoundary
      //     ? minBoundary
      //     : uncheckedValue > maxBoundary
      //     ? maxBoundary
      //     : uncheckedValue;

      thumbPositionX.value = withTiming(
        thumbPosition,
        {
          duration: TAP_SLIDING_DURATION,
          easing: Easing.quad,
        },
        (isFinished) => {
          if (isFinished) {
            const currentValue = formatValueUi(
              minBoundary + Math.round(thumbPosition / stepSize) * step
            );

            runOnJS(onValueChange)(currentValue);
            // runOnJS(onValueChangeTap)(currentValue);
          }
        }
      );
    });

    const propValueLabel = useAnimatedProps(() => {
      let uncheckedValue = formatValueUi(
        minBoundary + Math.round(thumbPositionX.value / stepSize) * step
      );
      const currentValue =
        uncheckedValue < minBoundary
          ? minBoundary
          : uncheckedValue > maxBoundary
          ? maxBoundary
          : uncheckedValue;
      return {
        text: `${currentValue}`,
      };
    });

    // needed to make longPress work(changing argument for function to activate useEffect in parent)
    const pressInstanceCounter = useRef(10);

    const handleIncrementButtonPress = () => {
      let thumbPosition =
        thumbPositionX.value + stepSize > TRACK_WIDTH
          ? TRACK_WIDTH
          : thumbPositionX.value + stepSize;

      //timing
      thumbPositionX.value = withTiming(thumbPosition, {
        duration: 40,
      });
      //no timing
      // thumbPositionX.value = thumbPosition;

      let uncheckedValue = formatValue(
        minBoundary + Math.round(thumbPosition / stepSize) * step
      );

      let currentValue =
        uncheckedValue < maxBoundary ? uncheckedValue : maxBoundary;

      pressInstanceCounter.current = pressInstanceCounter.current + 1;
      onValueChangeForButtons(currentValue, pressInstanceCounter.current);
    };

    const handleDecrementButtonPress = () => {
      let thumbPosition =
        thumbPositionX.value - stepSize <= 0
          ? 0
          : thumbPositionX.value - stepSize;

      //timing
      thumbPositionX.value = withTiming(thumbPosition, {
        duration: 40,
      });
      //no timing
      // thumbPositionX.value = thumbPosition;

      let uncheckedValue = formatValue(
        minBoundary + Math.round(thumbPosition / stepSize) * step
      );

      let currentValue =
        uncheckedValue < minBoundary ? minBoundary : uncheckedValue;
      pressInstanceCounter.current = pressInstanceCounter.current + 1;
      onValueChangeForButtons(currentValue, pressInstanceCounter.current);
    };

    const intervalRef = useRef(null);
    // mb tinker smth to avoid usage of separate function in parent .
    const handleLongDecrementButtonPress = () => {
      intervalRef.current = setInterval(handleDecrementButtonPress, 160);
    };

    const handleLongIncrementButtonPress = () => {
      intervalRef.current = setInterval(handleIncrementButtonPress, 160);
    };

    const handleButtonPressOut = () => {
      if (intervalRef.current != null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    return (
      <View style={styles.sliderContainer}>
        <View style={styles.trackWithButtonsContainer}>
          <Pressable
            onPressIn={handleDecrementButtonPress}
            onLongPress={handleLongDecrementButtonPress}
            onPressOut={handleButtonPressOut}
          >
            <Ionicons
              name="chevron-back-circle-outline"
              size={28}
              color={buttonsColor}
              style={styles.chevron}
            />
          </Pressable>
          <View style={{ margin: 15 }}>
            <GestureDetector gesture={tap}>
              <View>
                <View
                  style={[
                    styles.inactiveTrack,
                    { backgroundColor: inactiveTrackColor },
                  ]}
                />
                <Animated.View style={animatedActiveTrackStyle} />
              </View>
            </GestureDetector>

            <View>
              <AnimatedTextInput
                defaultValue={initialValue.toString()}
                editable={false}
                style={[
                  styles.thumbLabel,
                  animatedThumbLabelStyle,
                  { color: labelsColor },
                ]}
                animatedProps={propValueLabel}
              />
              <GestureDetector gesture={pan}>
                <Animated.View
                  style={[
                    styles.thumb,
                    animatedThumbStyle,
                    { backgroundColor: thumbColor },
                  ]}
                />
              </GestureDetector>
            </View>
          </View>
          <Pressable
            onPressIn={handleIncrementButtonPress}
            onLongPress={handleLongIncrementButtonPress}
            onPressOut={handleButtonPressOut}
          >
            <Ionicons
              name="chevron-forward-circle-outline"
              size={28}
              color={buttonsColor}
              style={styles.chevron}
            />
          </Pressable>
        </View>

        {/* mb  better with to fixed , so boundaries would be of a similar size */}
        <View style={styles.boundariesContainer}>
          <Text style={[styles.boundariesText, { color: labelsColor }]}>
            {minBoundary.toFixed(1)}
          </Text>
          <Text style={[styles.boundariesText, { color: labelsColor }]}>
            {maxBoundary.toFixed(1)}
          </Text>
        </View>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  sliderContainer: {
    flex: 1,
    width: "100%",
    padding: 10,
    alignItems: "center",
    marginTop: 20,
  },
  trackWithButtonsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  // make responsive positioning for label somehow
  thumbLabel: {
    fontSize: 16,
    position: "absolute",
    // placing text in the center of big box and centering the box by pushing it by half its size by margin
    width: "100%",
    textAlign: "center",
    marginLeft: -TRACK_WIDTH / 2,
    //
    marginTop: -20 / 2 - TRACK_HEIGHT / 2 - 30,
  },
  boundariesContainer: {
    width: TRACK_WIDTH,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  boundariesText: {
    fontSize: 16,
  },
  inactiveTrack: {
    width: TRACK_WIDTH,
    height: TRACK_HEIGHT,
    borderRadius: TRACK_HEIGHT,
    opacity: 0.4,
  },
  thumb: {
    position: "absolute",
    height: THUMB_SIZE,
    width: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    marginTop: -THUMB_SIZE / 2 - TRACK_HEIGHT / 2,
    marginLeft: -THUMB_SIZE / 2,
  },
  chevron: {},
});

export default RangeSlider;
