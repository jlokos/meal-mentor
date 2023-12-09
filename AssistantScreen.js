import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

export default function AssistantScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.webviewWrapper}>
        <WebView
          source={{ uri: 'https://chat.openai.com/g/g-LlCyUd3aW-meal-mentor' }}
          style={styles.webview}
          sharedCookiesEnabled={true} // For iOS
          thirdPartyCookiesEnabled={true} // For Android
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  webviewWrapper: {
    flex: 1,
    overflow: 'hidden', // This will hide any part of the webview that goes outside the bounds of the wrapper
  },
  webview: {
    flex: 1,
    marginTop: -100, // Negative margin to "trim" the top of the WebView content
  },
});
