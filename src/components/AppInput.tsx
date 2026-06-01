import { Text, View, StyleSheet, TextInput, TextInputProps } from "react-native";

interface Props extends TextInputProps {
  label?: string;
}

const AppInput = ({ label, style, ...rest }: Props) => (
  <View style={styles.wrap}>
    {label ? <Text style={styles.label}>{label}</Text> : null}
    <TextInput
      style={[styles.input, style]}
      placeholderTextColor="#aaa"
      {...rest}
    />
  </View>
);

const styles = StyleSheet.create({
  wrap: { marginBottom: 14 },
  label: {
    fontSize: 13,
    color: "#555",
    marginBottom: 5,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    backgroundColor: "#fafafa",
    color: "#222",
  },
});

export default AppInput;
