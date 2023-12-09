// ScannerScreen.js
import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from 'expo-file-system';

export default function ScannerScreen({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [showImageOptions, setShowImageRecognitionButton] = useState(false);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getBarCodeScannerPermissions();
    setShowImageRecognitionButton(true);
  }, []);

  const handleImageRecognition = async (useCamera) => {
    let result;
    if (useCamera) {
      result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, 
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });
} else {
  result = await ImagePicker.launchImageLibraryAsync({
    // Gallery options
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 0.5,
  });
}

    if (!result.canceled) {
      const asset = result.assets[0];
      if (asset) {
        const base64 = await FileSystem.readAsStringAsync(asset.uri, { encoding: 'base64' });
        const imageBase64 = `data:image/jpeg;base64,${base64}`;
        navigation.navigate("Learn", { imageBase64: imageBase64 });
      }
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
  <View style={styles.container}>
  {showImageOptions && (
    <>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleImageRecognition(true)} // Capture new image
      >
        <Text style={styles.buttonText}>Capture & Analyze a Meal</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleImageRecognition(false)} // Upload from gallery
      >
        <Text style={styles.buttonText}>Upload & Analyze a Meal</Text>
      </TouchableOpacity>
    </>
  )}
</View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    padding: 10,
    margin: 20,
    backgroundColor: "green",
    borderRadius: 5,
    elevation: 3,
    shadowOffset: { width: 2, height: 2 },
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  imageRecognitionButton: {
    position: "absolute", // Set absolute positioning
    left: 0, // Align to the left of the screen
    right: 0, // Align to the right of the screen
    margin: 20, // Margin still applied for spacing
    padding: 10,
    backgroundColor: "green",
    borderRadius: 5,
    elevation: 3,
    shadowOffset: { width: 2, height: 2 },
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 3,
    alignSelf: "center", // This will center the button horizontally
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
  loadingMessageContainer: {
    position: "absolute", // Absolute position
    top: 0, // Cover the whole screen
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center", // Center children vertically
    alignItems: "center", // Center children horizontally
    backgroundColor: "rgba(0, 0, 0, 0.7)", // Semi-transparent black
    zIndex: 1, // Ensure it's on top
  },
  loadingMessageText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
});

