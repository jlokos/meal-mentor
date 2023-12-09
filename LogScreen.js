import React, { useState, useCallback } from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import {
  GestureHandlerRootView,
  Swipeable,
} from "react-native-gesture-handler";

const STORAGE_KEY = "LOGS";

export default function LogScreen() {
  const [logs, setLogs] = useState([]);

  const loadLogs = async () => {
    try {
      const storedLogs = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedLogs) {
        setLogs(JSON.parse(storedLogs));
      }
    } catch (e) {
      Alert.alert("Error", "Failed to load logs.");
    }
  };

  const deleteLog = async (indexToDelete) => {
    try {
      const updatedLogs = logs.filter((_, index) => index !== indexToDelete);
      setLogs(updatedLogs);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLogs));
    } catch (e) {
      Alert.alert("Error", "Failed to delete log.");
    }
  };

  const clearAllLogs = async () => {
    Alert.alert(
      "Clear All Logs",
      "Are you sure you want to permanently delete all logs?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear All",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem(STORAGE_KEY);
              setLogs([]);
            } catch (e) {
              Alert.alert("Error", "Failed to clear logs.");
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  useFocusEffect(
    useCallback(() => {
      loadLogs();
    }, [])
  );

  const renderSwipeableLog = ({ item, index }) => {
    return (
      <Swipeable
        renderRightActions={() => (
          <TouchableOpacity
            onPress={() => {
              Alert.alert(
                "Delete Log",
                "Are you sure you want to delete this log?",
                [
                  { text: "Cancel", style: "cancel" },
                  {
                    text: "Delete",
                    onPress: () => deleteLog(index),
                    style: "destructive",
                  },
                ]
              );
            }}
            style={styles.deleteButton}
          >
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        )}
      >
        <View style={styles.logEntry}>
          <Image source={{ uri: item.image }} style={styles.imagePreview} />
          <Text style={styles.logText}>{item.response}</Text>
        </View>
      </Swipeable>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={clearAllLogs}
            style={styles.clearAllButton}
          >
            <Text style={styles.clearAllButtonText}>Clear All</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={logs}
          renderItem={renderSwipeableLog}
          keyExtractor={(_, index) => String(index)}
          style={styles.container}
        />
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
  },
  clearAllButton: {
    padding: 8,
    backgroundColor: "red",
    borderRadius: 5,
  },
  clearAllButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  logEntry: {
    flexDirection: "row",
    margin: 10,
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 5,
    padding: 10,
  },
  imagePreview: {
    width: 50,
    height: 50,
    marginRight: 10,
    borderRadius: 5,
  },
  logText: {
    flex: 1,
    flexWrap: "wrap",
  },
  deleteButton: {
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    width: 100,
    height: "100%",
  },
  deleteButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
