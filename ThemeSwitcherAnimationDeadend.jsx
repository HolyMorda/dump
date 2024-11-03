import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "../../providers/ThemeProvider";
import Feather from "@expo/vector-icons/Feather";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
// if it ends up near the edje mb make it less circled (like language modal)

//mb add littlr padding

//rename toggleTheme its more of a chooseTheme now

// after new architecture mb introduce onLayoutEffect

const DraftH = () => {
  const { toggleTheme, theme } = useTheme();

  const [visible, setVisible] = useState(false);
  const dropdownButton = useRef(null);
  const [dropdownTop, setDropdownTop] = useState(0);
  const [dropdownLeft, setDropdownLeft] = useState(0);

  const modalIconsOrder =
    theme.iconName === "cloud"
      ? [
          { id: 0, iconName: "sun", themeName: "light" },
          { id: 1, iconName: "moon", themeName: "dark" },
          { id: 2, iconName: "cloud", themeName: "gray" },
        ]
      : theme.iconName === "moon"
      ? [
          { id: 0, iconName: "sun", themeName: "light" },
          { id: 1, iconName: "cloud", themeName: "gray" },
          { id: 2, iconName: "moon", themeName: "dark" },
        ]
      : [
          { id: 0, iconName: "cloud", themeName: "gray" },
          { id: 1, iconName: "moon", themeName: "dark" },
          { id: 2, iconName: "sun", themeName: "light" },
        ];

  const openDropdown = () => {
    setVisible(true);
  };

  const toggleDropdown = () => {
    visible ? setVisible(false) : openDropdown();
  };

// change default
  const widthRef = useRef(200);
  const [defaultWidth,setDefaultWidth]=useState(200);


  useEffect(() => {
    dropdownButton.current.measure((_fx, _fy, _w, h, _px, py) => {
      console.log(_w)
      setDropdownTop(py);
      // setDropdownLeft(_px);
      // setDropdownLeft(-_w);
      widthRef.current = _w*3;
      // setDefaultWidth(_w);
      
      // console.log(widthRef.current)
    });

  }, []);

  const chooseThemeAndClose = (themeName) => {
    toggleTheme(themeName);
    // toggleDropdown();
    animatedPressOut();
    console.log(widthRef.current)
  };

  //
  const translateX = useSharedValue(-widthRef.current);

  const reanimatedDropdownStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: translateX.value,
        },
      ],
    };
  });

  const [isOpen,setIsOpen]=useState(false);

  const animatedPress = () => {
    // toggleDropdown();
    // setTimeout(() => {
    //   setVisible(true);
    // }, 100);
    translateX.value = withTiming(0, {
      duration: 500,
    });
    setIsOpen(true);
  };
  const animatedPressOut = () => {
    // toggleDropdown();
    // setTimeout(() => {
    //   setVisible(false);
    // }, 200);
    translateX.value = withTiming(-widthRef.current, {
      duration: 500,
    });
    setIsOpen(false);
  };

  const renderDropdown = () => {
    // if (visible) {
      return (
        <Animated.View style={[styles.dropdown, reanimatedDropdownStyle]}>
          {/* <Modal visible={visible} transparent animationType="none"> */}
          {/* <Pressable
            style={styles.overlay}
            onPress={() => {
              animatedPressOut;
            }}
          > */}
          <View
            style={[
              styles.dropdown,
              {
                // top: dropdownTop,
                // left: dropdownLeft,
                backgroundColor: theme.secondaryBackgroundColor,
              },
            ]}
          >
            {modalIconsOrder.map(({ id, iconName, themeName }) => (
              <ThemeIcon
                key={id}
                name={iconName}
                color={
                  theme.iconName === iconName
                    ? theme.iconColor
                    : theme.inactiveTextColor
                }
                onPress={() => {
                  chooseThemeAndClose(themeName);
                }}
                backgroundColor={theme.secondaryBackgroundColor}
              />
            ))}
          </View>
          {/* </Pressable> */}
          {/* </Modal> */}
        </Animated.View>
      );
    // }
  };

  return (
    <View
      style={[
        styles.mainContainer,
        { backgroundColor: theme.secondaryBackgroundColor },
      ]}
      ref={dropdownButton}
    >
      {renderDropdown()}
      <ThemeIcon
        name={theme.iconName}
        color={theme.iconColor}
        onPress={animatedPress}
        backgroundColor={theme.secondaryBackgroundColor}
      />
      {/* <View style={{ flexDirection: "column" }}>
        <Pressable onPress={animatedPressOut} style={{ marginTop: 100 }}>
          <Text>GRGKREKOIERK</Text>
        </Pressable>
        <Pressable
          onPress={() => {
            setVisible(true);
            console.log(visible);
          }}
          style={{ marginTop: 100 }}
        >
          <Text>visible</Text>
        </Pressable>
      </View> */}
    </View>
  );
};

const ThemeIcon = ({ name, color, backgroundColor, onPress }) => {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.iconContainer, { backgroundColor: backgroundColor }]}
    >
      <Feather name={name} size={28} color={color} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: "gainsboro",
    flexDirection: "row",
    justifyContent: "space-evenly",
    // borderRadius: 105,
    borderTopRightRadius: 105,
    borderBottomRightRadius: 105,
  },
  iconContainer: {
    backgroundColor: "green",
    padding: 6,
    borderRadius: 105,
  },
  text: {
    fontSize: 20,
    fontWeight: "600",
  },
  overlay: {
    flex: 1,
  },
  dropdown: {
    position: "absolute",
    flexDirection: "row",
    borderTopRightRadius: 105,
    borderBottomRightRadius: 105,
    // paddingTop: 4,
    // paddingBottom: 4,
    zIndex: 10,
  },
});

export default DraftH;
