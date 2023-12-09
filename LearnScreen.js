import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, ScrollView, Animated } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = 'LOGS';

const PulsingPlaceholder = () => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.5,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim]);

  return (
    <Animated.View
      style={[
        styles.nutritionLabelContainer,
        styles.placeholderContainer,
        { opacity: pulseAnim },
      ]}
    >
      <View style={styles.titlePlaceholder} />
      <View style={styles.itemPlaceholder} />
      <View style={styles.itemPlaceholder} />
      <View style={styles.itemPlaceholder} />
      <View style={styles.itemPlaceholder} />
      <View style={styles.itemPlaceholder} />
      <View style={styles.itemPlaceholder} />
      <View style={styles.itemPlaceholder} />
      <View style={styles.itemPlaceholder} />
      <View style={styles.itemPlaceholder} />
      {/* Add more placeholders as needed */}
    </Animated.View>
  );
};

const NutritionLabel = ({ nutritionData }) => {
  const foodName = nutritionData['Food Name'] || 'Nutrition Facts';

  return (
    <View style={styles.nutritionLabelContainer}>
      <Text style={styles.title}>{foodName}</Text>
      {Object.keys(nutritionData).map((key) => (
        key !== 'Food Name' && (
          <View key={key} style={styles.nutritionItem}>
            <Text style={styles.nutritionKey}>{key}</Text>
            <Text style={styles.nutritionValue}>{nutritionData[key]}</Text>
          </View>
        )
      ))}
    </View>
  );
};

export default function LearnScreen({ route }) {
  const [nutritionData, setNutritionData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const imageBase64 = route.params?.imageBase64;

  const parseNutritionData = (text) => {
    const lines = text.split('\n');
    const data = {};
    lines.forEach(line => {
      const [key, value] = line.split(':');
      if (key && value) {
        data[key.trim()] = value.trim();
      }
    });
    return data;
  };

  const fetchItemDetailsFromOpenAI = async (imageBase64) => {
    const openAiApiKey = "";

    const headers = {
      Authorization: `Bearer ${openAiApiKey}`,
      "Content-Type": "application/json",
    };

    const payload = {
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Please recognize all FOOD items in the image and provide a breakdown for each. Format your response as specified, with a separate entry for each food item. Include an estimate for each nutritional component, providing only one value per component without any range. Conclude with the total calorie count NOT kCAL, incorporating all the macronutrients listed in only g or mg respectively.\n\nFor your response ONLY provide:\n- Food Name\n- Serving Size\n- Calories\n- Cholesterol\n- Total Fats\n- Sodium\n- Total Carbohydrate\n- Sugars\n- Protein"             
            },
            {
              type: "image_url",
              image_url: imageBase64,
            },
          ],
        },
      ],
      max_tokens: 300,
    };

    console.log("Request payload to OpenAI:", payload);

    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: headers,
          body: JSON.stringify(payload),
        }
      );
      const jsonResponse = await response.json();

      if (!response.ok) {
        console.error("Error response from OpenAI:", jsonResponse);
        throw new Error(
          `OpenAI API responded with status: ${response.status} and message: ${jsonResponse.error.message}`
        );
      }

      const parsedData = parseNutritionData(jsonResponse.choices[0].message.content);
      setNutritionData(parsedData);
      saveLog({
        image: imageBase64,
        response: jsonResponse.choices[0].message.content
      });
    } catch (error) {
      console.error("Error fetching details from OpenAI:", error);
      alert("Error fetching details: " + error.message);
      setIsLoading(false);
    }
  };

  const saveLog = async (newLog) => {
    try {
      const existingLogsJson = await AsyncStorage.getItem(STORAGE_KEY);
      const existingLogs = existingLogsJson ? JSON.parse(existingLogsJson) : [];
      const updatedLogs = [...existingLogs, newLog];
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLogs));
    } catch (e) {
      console.error("Failed to save logs:", e);
    }
  };

  useEffect(() => {
    // Reset the nutrition data and start loading when a new image is received
    setNutritionData(null);
    setIsLoading(true);

    if (imageBase64) {
      fetchItemDetailsFromOpenAI(imageBase64)
        .then(() => setIsLoading(false))
        .catch((error) => {
          console.error("Error fetching details from OpenAI:", error);
          alert("Error fetching details: " + error.message);
          setIsLoading(false);
        });
    }
  }, [imageBase64]);


  return (
    <ScrollView style={styles.container}>
      {isLoading || !nutritionData ? (
        <PulsingPlaceholder />
      ) : (
        <NutritionLabel nutritionData={nutritionData} />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
  },
  centeredContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  nutritionLabelContainer: {
    alignSelf: 'center',
    backgroundColor: '#FFF',
    padding: 16,
    marginVertical: 20,
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 10,
    width: '90%',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 30,
    marginBottom: 8,
    textAlign: 'center',
  },
  nutritionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    paddingVertical: 4,
  },
  nutritionKey: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  nutritionValue: {
    fontSize: 16,
  },
  placeholderContainer: {
    justifyContent: 'space-around',
  },
  titlePlaceholder: {
    width: '80%',
    height: 30,
    backgroundColor: '#C0C0C0',
    alignSelf: 'center',
  },
  itemPlaceholder: {
    height: 20,
    width: '90%',
    backgroundColor: '#C0C0C0',
    alignSelf: 'center',
    marginVertical: 4,
  },
  // Additional styles can be added here if needed
});