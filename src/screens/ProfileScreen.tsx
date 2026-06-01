import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { useAuth } from "../hooks/useAuth";
import { getUserProfile } from "../data/userApi";
import { UserProfileResponse } from "../domain/User";
import AppButton from "../components/AppButton";

const ProfileScreen = () => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState<UserProfileResponse | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    getUserProfile()
      .then(setProfile)
      .catch(() => null); // no bloquear si falla
  }, []);

  const displayName = profile?.name ?? user?.email?.split("@")[0] ?? "Usuario";
  const displayEmail = profile?.email ?? user?.email ?? "";

  const handleLogout = async () => {
    Alert.alert("Cerrar sesión", "¿Estás seguro de que deseas salir?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Salir",
        style: "destructive",
        onPress: async () => {
          setLoggingOut(true);
          try {
            await logout();
          } catch {
            Alert.alert("Error", "No se pudo cerrar sesión");
          } finally {
            setLoggingOut(false);
          }
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Avatar */}
      <View style={styles.avatarSection}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {displayName[0]?.toUpperCase() ?? "U"}
          </Text>
        </View>
        <Text style={styles.name}>{displayName}</Text>
        <Text style={styles.email}>{displayEmail}</Text>
        {profile?.role && (
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>{profile.role}</Text>
          </View>
        )}
      </View>

      {/* Info del usuario */}
      {profile && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Mi cuenta</Text>
          <InfoRow label="ID" value={profile.id.slice(0, 8) + "..."} />
          <InfoRow label="Nombre" value={profile.name} />
          <InfoRow label="Correo" value={profile.email} />
          <InfoRow label="Rol" value={profile.role} />
        </View>
      )}

      {/* Acerca de */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Acerca de la app</Text>
        <InfoRow label="Nombre" value="TodoList App" />
        <InfoRow label="Versión" value="1.0.0" />
        <InfoRow label="Frontend" value="Expo SDK 54 + TypeScript" />
        <InfoRow label="Backend" value="Quarkus 3 + MySQL" />
        <InfoRow label="Auth" value="Firebase Authentication" />
        <InfoRow label="API" value="REST + JWT (Axios)" />
        <InfoRow label="Nav" value="React Navigation v7" />
      </View>

      <AppButton
        label="Cerrar sesión"
        onPress={handleLogout}
        variant="danger"
        loading={loggingOut}
        style={styles.logoutBtn}
      />
    </ScrollView>
  );
};

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue} numberOfLines={1}>
      {value}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f6ff" },
  content: { padding: 24, paddingBottom: 40 },
  avatarSection: { alignItems: "center", marginBottom: 28 },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#5B5FDE",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  avatarText: { color: "#fff", fontSize: 32, fontWeight: "700" },
  name: { fontSize: 20, fontWeight: "700", color: "#222", marginBottom: 2 },
  email: { fontSize: 14, color: "#888", marginBottom: 8 },
  roleBadge: {
    backgroundColor: "#5B5FDE22",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  roleText: { color: "#5B5FDE", fontWeight: "600", fontSize: 13 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#5B5FDE",
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  infoLabel: { fontSize: 14, color: "#666" },
  infoValue: { fontSize: 14, color: "#222", fontWeight: "500", maxWidth: "60%" },
  logoutBtn: { marginTop: 8 },
});

export default ProfileScreen;
