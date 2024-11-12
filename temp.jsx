import { View, Text, StyleSheet } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useIlluminances } from "../../providers/IlluminancesProvider";
import Button from "../ui/Button";
import { useTheme } from "../../providers/ThemeProvider";
import RangeSlider from "../ui/RangeSlider";
import { preferencesStorage } from "../../db/Storage";
import { useTranslation } from "react-i18next";
import BottomSheet from "../ui/BottomSheet";
// clean duplicated or unused slider props

const DEFAULT_CALIBRATION_COEFFICIENT = 1;

const CalibrationCoefficient = ({
  isCalibrationModalVisible,
  toggleCalibrationModal,
}) => {
  const { theme } = useTheme();
  const { addCalibrationCoefficient } = useIlluminances();
  const { t } = useTranslation();

  const closeModal = () => {
    const identifyPreferedCalibrationCoefficient = preferencesStorage.contains(
      "preferedCalibrationCoefficient"
    )
      ? preferencesStorage.getNumber("preferedCalibrationCoefficient")
      : DEFAULT_CALIBRATION_COEFFICIENT;
    addCalibrationCoefficient(identifyPreferedCalibrationCoefficient);
    console.log(identifyPreferedCalibrationCoefficient)
    toggleCalibrationModal();
  };

  const identifyPreferedCalibrationCoefficient = preferencesStorage.contains(
    "preferedCalibrationCoefficient"
  )
    ? preferencesStorage.getNumber("preferedCalibrationCoefficient")
    : DEFAULT_CALIBRATION_COEFFICIENT;

  const [calibrationCoefficient, setCalibrationCoefficient] = useState(
    identifyPreferedCalibrationCoefficient
  );
  const [isReseted, setIsReseted] = useState(true);
  const [
    calibrationCoefficientStateUpdater,
    setCalibrationCoefficientStateUpdater,
  ] = useState(0);

  // mb safer to set it for number , or not;
  const calibrationCoefficientRef = useRef(calibrationCoefficient);
  //may be make isReseted false by default and then autotoggle it back
  const save = () => {
    preferencesStorage.set(
      "preferedCalibrationCoefficient",
      calibrationCoefficient
    );
    toggleCalibrationModal();
  };
  const reset = () => {
    setCalibrationCoefficient(DEFAULT_CALIBRATION_COEFFICIENT);
    preferencesStorage.set(
      "preferedCalibrationCoefficient",
      DEFAULT_CALIBRATION_COEFFICIENT
    );
    setIsReseted(!isReseted);
  };

  //couldn`t use state/setState(range ui lags 1 step behind for some reason).
  //mb i was assigning newly created state and not the value itsel , like in recent another similar case
  const calibrationCoefficientSetter = (sliderValue) => {
    calibrationCoefficientRef.current = sliderValue;
    //for useEffect dependency to trigger calibrationCoefficient change(+100 to avoid random equity with pressInstanceCounterRef from slider(in case of wich one slider update will be missed)) .
    setCalibrationCoefficientStateUpdater(
      calibrationCoefficientStateUpdater + 100
    );
  };

  const calibrationCoefficientSetterForButtons = (
    sliderValue,
    pressInstanceCounterRef
  ) => {
    calibrationCoefficientRef.current = sliderValue;
    //for useEffect dependency to trigger calibrationCoefficient change.
    // pressInstanceCounterRef to make longPress work(changing variable outside of function, so it will rerun with different argument)
    setCalibrationCoefficientStateUpdater(pressInstanceCounterRef);
  };

  useEffect(() => {
    setCalibrationCoefficient(calibrationCoefficientRef.current);
    addCalibrationCoefficient(calibrationCoefficientRef.current);
  }, [calibrationCoefficientStateUpdater]);

  return (
    <BottomSheet
      isVisible={isCalibrationModalVisible}
      onClose={closeModal}
      header={"Calibration"}
      headerColor={theme.secondaryBackgroundColor}
    >
      <View style={styles.mainContainer}>
        <View
          style={[
            styles.sliderContainer,
            { backgroundColor: theme.secondaryBackgroundColor },
          ]}
        >
          <RangeSlider
            minBoundary={0.3}
            maxBoundary={3}
            initialValue={calibrationCoefficient}
            step={0.1}
            labelText={"Calibration coefficient: "}
            inactiveTrackColor={theme.buttonColor}
            activeTrackColor={theme.buttonColor}
            thumbColor={theme.buttonColor}
            labelsColor={theme.textColor}
            buttonsColor={theme.buttonColor}
            onValueChange={calibrationCoefficientSetter}
            onValueChangeForButtons={calibrationCoefficientSetterForButtons}
            isReseted={isReseted}
          />
        </View>
        <Text style={[styles.text, { color: theme.textColor }]}>
          {t("calibrationModal.calibrationCoefficient")}{" "}
          {calibrationCoefficient}
        </Text>

        <View style={styles.buttonContainer}>
          <Button
            onPress={save}
            text={t("calibrationModal.saveButton")}
            buttonColor={theme.greenColor}
          />
          <Button
            onPress={reset}
            text={t("calibrationModal.resetButton")}
            buttonColor={theme.buttonColor}
          />
        </View>
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  sliderContainer: {
    flex: 1,
    //not working(works from range slider)
    width: "90%",
    alignSelf: "center",
    marginTop: "auto",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "auto",
    margin: "5%",
    gap: 15,
    marginTop: "auto",
  },
  text: {
    fontSize: 18,
    margin: 8,
  },
});

export default CalibrationCoefficient;
