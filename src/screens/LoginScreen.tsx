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
import { loginUser } from "../data/authService";
import AppInput from "../components/AppInput";
import AppButton from "../components/AppButton";
import { AuthStackParams } from "../navigation/types";

type Nav = NativeStackNavigationProp<AuthStackParams, "Login">;

const LoginScreen = () => {
  const navigation = useNavigation<Nav>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Ingresa tu correo y contraseña");
      return;
    }
    setLoading(true);
    try {
      await loginUser(email.trim(), password);
      // La navegación ocurre automáticamente vía onAuthStateChanged en AuthContext
    } catch (error: any) {
      if (error.response) {
        Alert.alert("Error", error.response.data?.message ?? "Error del servidor");
      } else if (error.request) {
        Alert.alert("Error de red", "No se pudo conectar al servidor");
      } else {
        Alert.alert("Error", "Correo o contraseña incorrectos");
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
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.title}>TodoList</Text>
          <Text style={styles.subtitle}>Inicia sesion para continuar</Text>
        </View>

        <View style={styles.form}>
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
            placeholder="Contrasena"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <AppButton
            label="Iniciar sesión"
            onPress={handleLogin}
            loading={loading}
            style={styles.loginBtn}
          />

          <TouchableOpacity
            style={styles.registerLink}
            onPress={() => navigation.navigate("Register")}
          >
            <Text style={styles.registerText}>
              ¿No tienes cuenta?{" "}
              <Text style={styles.registerTextBold}>Regístrate</Text>
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
  loginBtn: { marginTop: 8 },
  registerLink: { marginTop: 20, alignItems: "center" },
  registerText: { fontSize: 14, color: "#888" },
  registerTextBold: { color: "#5B5FDE", fontWeight: "700" },
});

export default LoginScreen;
