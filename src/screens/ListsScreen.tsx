import { useEffect, useState } from "react";
import {
  View,
  FlatList,
  Modal,
  Text,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useCategories } from "../hooks/useCategories";
import { useTodos } from "../hooks/useTodos";
import { Category } from "../domain/Category";
import CategoryCard from "../components/CategoryCard";
import AppButton from "../components/AppButton";
import AppInput from "../components/AppInput";
import LoadingOverlay from "../components/LoadingOverlay";
import EmptyState from "../components/EmptyState";
import { ListsStackParams } from "../navigation/types";

type Nav = NativeStackNavigationProp<ListsStackParams, "Lists">;

const PALETTE = [
  "#5B5FDE",
  "#e53e3e",
  "#38a169",
  "#d69e2e",
  "#805ad5",
  "#dd6b20",
  "#2b6cb0",
];

const ListsScreen = () => {
  const navigation = useNavigation<Nav>();
  const {
    categories,
    loading,
    error,
    fetchCategories,
    addCategory,
    editCategory,
    removeCategory,
  } = useCategories();
  const { todos, fetchTodos } = useTodos();

  // Modal crear/editar
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState(PALETTE[0]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchTodos();
  }, []);

  const openCreate = () => {
    setEditingCategory(null);
    setName("");
    setDescription("");
    setColor(PALETTE[0]);
    setShowModal(true);
  };

  const openEdit = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setDescription(cat.description ?? "");
    setColor(cat.color ?? PALETTE[0]);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("Error", "El nombre es requerido");
      return;
    }
    setSaving(true);
    try {
      if (editingCategory) {
        await editCategory(editingCategory.id, {
          name: name.trim(),
          description: description.trim(),
          color,
        });
      } else {
        await addCategory(name.trim(), description.trim(), color);
      }
      setShowModal(false);
    } catch {
      Alert.alert("Error", "No se pudo guardar la lista");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id: string, catName: string) => {
    Alert.alert("Eliminar lista", `¿Eliminar "${catName}"?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () =>
          removeCategory(id).catch(() =>
            Alert.alert("Error", "No se pudo eliminar la lista")
          ),
      },
    ]);
  };

  const todoCountFor = (categoryId: string) =>
    todos.filter((t) => t.categories?.some((c) => c.id === categoryId)).length;

  if (loading && categories.length === 0) return <LoadingOverlay />;

  return (
    <View style={styles.container}>
      {error ? <Text style={styles.errorBanner}>{error}</Text> : null}

      <FlatList
        data={categories}
        keyExtractor={(c) => c.id}
        renderItem={({ item }) => (
          <CategoryCard
            category={item}
            todoCount={todoCountFor(item.id)}
            onPress={() =>
              navigation.navigate("ListDetail", {
                categoryId: item.id,
                categoryTitle: item.name,
              })
            }
            onEdit={() => openEdit(item)}
            onDelete={() => handleDelete(item.id, item.name)}
          />
        )}
        ListEmptyComponent={
          <EmptyState message={"Sin listas aun.\n¡Crea tu primera lista!"} />
        }
        contentContainerStyle={
          categories.length === 0 ? styles.flex : styles.list
        }
        refreshing={loading}
        onRefresh={() => {
          fetchCategories();
          fetchTodos();
        }}
      />

      <AppButton
        label="+ Nueva Lista"
        onPress={openCreate}
        style={styles.fab}
      />

      <Modal visible={showModal} animationType="slide" transparent>
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>
              {editingCategory ? "Editar Lista" : "Nueva Lista"}
            </Text>

            <AppInput
              label="Nombre *"
              placeholder="Trabajo, Personal, Estudio..."
              value={name}
              onChangeText={setName}
            />
            <AppInput
              label="Descripción"
              placeholder="Descripción opcional..."
              value={description}
              onChangeText={setDescription}
            />

            <Text style={styles.colorLabel}>Color</Text>
            <View style={styles.colorRow}>
              {PALETTE.map((c) => (
                <TouchableOpacity
                  key={c}
                  style={[
                    styles.colorDot,
                    { backgroundColor: c },
                    color === c && styles.colorSelected,
                  ]}
                  onPress={() => setColor(c)}
                />
              ))}
            </View>

            <AppButton
              label={editingCategory ? "Guardar cambios" : "Crear Lista"}
              onPress={handleSave}
              loading={saving}
              style={styles.createBtn}
            />
            <AppButton
              label="Cancelar"
              onPress={() => setShowModal(false)}
              variant="outline"
              style={styles.cancelBtn}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f6ff" },
  flex: { flex: 1 },
  list: { padding: 16, paddingBottom: 100 },
  fab: { position: "absolute", bottom: 24, left: 16, right: 16 },
  errorBanner: {
    color: "#c53030",
    backgroundColor: "#fff5f5",
    textAlign: "center",
    padding: 10,
    fontSize: 13,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  modal: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 36,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 18,
    color: "#222",
  },
  colorLabel: {
    fontSize: 13,
    color: "#555",
    fontWeight: "500",
    marginBottom: 10,
  },
  colorRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
    flexWrap: "wrap",
  },
  colorDot: { width: 34, height: 34, borderRadius: 17 },
  colorSelected: { borderWidth: 3, borderColor: "#222" },
  createBtn: { marginTop: 4 },
  cancelBtn: { marginTop: 8 },
});

export default ListsScreen;
