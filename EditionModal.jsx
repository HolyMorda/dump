import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useTheme } from "../../providers/ThemeProvider";
import { useRef, useState } from "react";
import { savedMeasurementsStorage } from "../../db/Storage";
import Button from "../ui/Button";
import BottomSheet from "../ui/BottomSheet";

// limit number of characters in textInput

const EditionModal = ({
  isVisible,
  onClose,
  pressedItemName,
  pressedItemId,
  savedMeasurements,
}) => {
  const { theme } = useTheme();
  const inputRef = useRef();
  const [text, onChangeText] = useState(pressedItemName);

  const clearAndClose = () => {
    onChangeText("");
    onClose();
  };

  const editionConfirmed = () => {
    const editedMesurements = savedMeasurements.map((measurement) => {
      if (measurement.id == pressedItemId) {
        return { ...measurement, name: text };
      }
      return measurement;
    });

    savedMeasurementsStorage.set(
      "savedMeasurements",
      JSON.stringify(editedMesurements)
    );
    clearAndClose();
  };

  return (
    <KeyboardAvoidingView
      behavior={"height"}
      style={styles.keyboardAvoidingView}
    >
      <BottomSheet
        isVisible={isVisible}
        onClose={clearAndClose}
        header={"Edition"}
        headerColor={theme.backgroundColor}
      >
        <View style={styles.inputContainer}>
          <TextInput
            style={[
              styles.input,
              {
                color: theme.textColor,
                backgroundColor: theme.backgroundColor,
              },
            ]}
            ref={inputRef}
            onLayout={() => inputRef.current.focus()}
            onChangeText={onChangeText}
            value={text}
            keyboardType="default"
            placeholder={pressedItemName}
            placeholderTextColor={theme.inactiveTextColor}
            enterKeyHint="done"
            onSubmitEditing={editionConfirmed}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            onPress={editionConfirmed}
            text="Edit"
            buttonColor={theme.greenColor}
          />
          <Button
            onPress={clearAndClose}
            text="Nope"
            buttonColor={theme.buttonColor}
          />
        </View>
      </BottomSheet>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    position: "absolute",
    width: "100%",
    height: "100%",
    bottom: 0,
  },
  inputContainer: {
  
    padding: 5,
    marginVertical: 15,
  },
  input: {
    height: 40,
    margin: 12,
    borderRadius: 25,
    padding: 10,
    fontSize: 18,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "auto",
    margin: "5%",
    gap: 15,
    marginTop: "auto",
  },
});

export default EditionModal;
