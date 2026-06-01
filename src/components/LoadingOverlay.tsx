import { View, ActivityIndicator, StyleSheet } from "react-native";

const LoadingOverlay = () => (
  <View style={styles.container}>
    <ActivityIndicator size="large" color="#5B5FDE" />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f6ff",
  },
});

export default LoadingOverlay;
