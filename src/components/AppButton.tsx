import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
} from "react-native";

interface Props {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: "primary" | "danger" | "outline";
  style?: ViewStyle;
}

const AppButton = ({
  label,
  onPress,
  loading,
  disabled,
  variant = "primary",
  style,
}: Props) => {
  const bg =
    variant === "danger"
      ? "#e53e3e"
      : variant === "outline"
      ? "transparent"
      : "#5B5FDE";
  const border =
    variant === "outline"
      ? { borderWidth: 1.5, borderColor: "#5B5FDE" }
      : {};
  const textColor = variant === "outline" ? "#5B5FDE" : "#fff";

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: bg },
        border,
        (loading || disabled) && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={loading || disabled}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Text style={[styles.text, { color: textColor }]}>{label}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  text: { fontSize: 16, fontWeight: "600" },
  disabled: { opacity: 0.55 },
});

export default AppButton;
