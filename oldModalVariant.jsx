import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  TextInput,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useTheme } from "../../providers/ThemeProvider";
import { useRef, useState } from "react";
import { savedMeasurementsStorage } from "../../db/Storage";
import Button from "../ui/Button";

// choose from overlay in both or different
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
    <Modal animationType="slide" transparent={true} visible={isVisible}>
      <Pressable style={styles.overlay} onPress={clearAndClose}>
        <View
          style={[
            styles.modalContent,
            { backgroundColor: theme.secondaryBackgroundColor },
          ]}
        >
          <Pressable style={styles.overlay}>
            <View
              style={[
                styles.titleContainer,
                { backgroundColor: theme.backgroundColor },
              ]}
            >
              <Text style={[styles.title, { color: theme.textColor }]}>
                Edition
              </Text>
              <Pressable onPress={clearAndClose}>
                <MaterialIcons name="close" color={theme.textColor} size={27} />
              </Pressable>
            </View>

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
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0)",
  },
  modalContent: {
    height: "30%",
    width: "100%",
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
    position: "absolute",
    bottom: 0,
    alignSelf: "center",
  },
  titleContainer: {
    height: "16%",
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 18,
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
