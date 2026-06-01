import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { registerUser } from "../data/authService";
import AppInput from "../components/AppInput";
import AppButton from "../components/AppButton";
import { AuthStackParams } from "../navigation/types";

type Nav = NativeStackNavigationProp<AuthStackParams, "Register">;

// El backend valida: mayús, minús, número, carácter especial, mínimo 8 chars
const isPasswordValid = (pw: string) =>
  pw.length >= 8 &&
  /[A-Z]/.test(pw) &&
  /[a-z]/.test(pw) &&
  /[0-9]/.test(pw) &&
  /[^A-Za-z0-9]/.test(pw);

const RegisterScreen = () => {
  const navigation = useNavigation<Nav>();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password) {
      Alert.alert("Error", "Todos los campos son requeridos");
      return;
    }
    if (!isPasswordValid(password)) {
      Alert.alert(
        "Contraseña inválida",
        "Debe tener mínimo 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial."
      );
      return;
    }

    setLoading(true);
    try {
      await registerUser(email.trim(), password, name.trim());
      // La navegación ocurre automáticamente vía onAuthStateChanged
    } catch (error: any) {
      if (error.response) {
        Alert.alert(
          "Error",
          error.response.data?.message ?? "Error del servidor"
        );
      } else if (error.request) {
        Alert.alert("Error de red", "No se pudo conectar al servidor");
      } else if (error.code === "auth/email-already-in-use") {
        Alert.alert("Error", "Este correo ya está registrado");
      } else {
        Alert.alert("Error", error.message ?? "No se pudo crear la cuenta");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>Crear cuenta</Text>
          <Text style={styles.subtitle}>Completa los datos para registrarte</Text>
        </View>

        <View style={styles.form}>
          <AppInput
            label="Nombre completo"
            placeholder="Juan Pérez"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
          <AppInput
            label="Correo electrónico"
            placeholder="tu@correo.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <AppInput
            label="Contraseña"
            placeholder="Mín. 8 caracteres, mayús, número, especial"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <AppButton
            label="Crear cuenta"
            onPress={handleRegister}
            loading={loading}
            style={styles.registerBtn}
          />

          <TouchableOpacity
            style={styles.loginLink}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.loginText}>
              ¿Ya tienes cuenta?{" "}
              <Text style={styles.loginTextBold}>Inicia sesión</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: "#fff" },
  container: { flexGrow: 1, justifyContent: "center", padding: 28 },
  header: { alignItems: "center", marginBottom: 40 },
  logo: { fontSize: 56, marginBottom: 8 },
  title: { fontSize: 32, fontWeight: "800", color: "#222", letterSpacing: -0.5 },
  subtitle: { fontSize: 15, color: "#888", marginTop: 6 },
  form: {},
  registerBtn: { marginTop: 8 },
  loginLink: { marginTop: 20, alignItems: "center" },
  loginText: { fontSize: 14, color: "#888" },
  loginTextBold: { color: "#5B5FDE", fontWeight: "700" },
});

export default RegisterScreen;
