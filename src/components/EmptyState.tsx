import { View, Text, StyleSheet } from "react-native";

interface Props {
  message: string;
}

const EmptyState = ({ message }: Props) => (
  <View style={styles.container}>
    <Text style={styles.text}>{message}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  text: { color: "#999", fontSize: 16, textAlign: "center", lineHeight: 24 },
});

export default EmptyState;
