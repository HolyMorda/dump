import React, { useState, useRef } from "react";
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
import Button from "../ui/Button";
import { useIlluminances } from "../../providers/IlluminancesProvider";
import { dateIdentifier } from "../../utils/helperFunctions";
import { savedMeasurementsStorage } from "../../db/Storage";
import { defaultMeasurements } from "../../constants/defaultMeasurements";
import uuid from "react-native-uuid";
import { useTranslation } from "react-i18next";

// limit number of characters in textInput

const MeasurementSavingModal = ({ isVisible, onClose }) => {
  const inputRef = useRef();
  const [text, onChangeText] = useState("");

  const { theme } = useTheme();
  const { illuminances } = useIlluminances();
  const { t } = useTranslation();

  const clearAndClose = () => {
    onChangeText("");
    onClose();
  };

  const saveMeasurement = () => {
    const date = new Date();
    const currentDate = date.toLocaleDateString();
    const currentTime = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const MeasurementId = uuid.v4();

    const savedMeasurement = {
      name: text,
      date: currentDate,
      time: currentTime,
      illuminance: illuminances,
      id: MeasurementId,
    };

    const savedMeasurements = savedMeasurementsStorage.contains(
      "savedMeasurements"
    )
      ? JSON.parse(savedMeasurementsStorage.getString("savedMeasurements"))
      : defaultMeasurements;

    savedMeasurementsStorage.set(
      "savedMeasurements",
      JSON.stringify([...savedMeasurements, savedMeasurement])
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
          <Pressable>
            <View
              style={[
                styles.titleContainer,
                { backgroundColor: theme.secondaryBackgroundColor },
              ]}
            >
              <Text style={[styles.title, { color: theme.textColor }]}>
                {t("measurementSavingModal.title")}
              </Text>
              <Pressable onPress={clearAndClose}>
                <MaterialIcons name="close" color={theme.textColor} size={30} />
              </Pressable>
            </View>

            {/* 
            ref={inputRef}
            onLayout={()=> inputRef.current.focus()} 
            instead of autoFocus , which doesn`t work 
            */}

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
              placeholder={t("measurementSavingModal.textInputPlaceholder")}
              placeholderTextColor={theme.inactiveTextColor}
              enterKeyHint="done"
              onSubmitEditing={saveMeasurement}
            />

            <View style={styles.buttonContainer}>
              <Button
                onPress={saveMeasurement}
                text={t("measurementSavingModal.saveButton")}
                buttonColor={theme.buttonColor}
              />
            </View>
            {/* Content here */}
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  // overlay2: {
  //   flex: 1,
  //     },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0)",
  },
  modalContent: {
    // height: "35%",
    width: "100%",
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
    position: "absolute",
    bottom: 0,
    alignSelf: "center",
  },
  titleContainer: {
    // height: "16%",
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    margin: 5,
    marginBottom: 0,
    fontSize: 22,
  },
  //mb make withot border just with color like in unit changer
  input: {
    height: 40,
    margin: 12,
    // borderWidth: 1,
    borderRadius: 25,
    padding: 10,
    fontSize: 18,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "auto",
    margin: "5%",
    marginTop: 0,
    marginBottom: "auto",
  },
});

export default MeasurementSavingModal;
