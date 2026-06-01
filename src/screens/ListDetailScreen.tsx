import { useEffect, useState } from "react";
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  Modal,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
import { useTodos } from "../hooks/useTodos";
import { TodoPriority } from "../domain/Todo";
import TodoItem from "../components/TodoItem";
import AppButton from "../components/AppButton";
import AppInput from "../components/AppInput";
import LoadingOverlay from "../components/LoadingOverlay";
import EmptyState from "../components/EmptyState";
import { ListsStackParams } from "../navigation/types";

type Route = RouteProp<ListsStackParams, "ListDetail">;

const PRIORITIES: { value: TodoPriority; label: string; color: string }[] = [
  { value: "LOW", label: "Baja", color: "#38a169" },
  { value: "MEDIUM", label: "Media", color: "#d69e2e" },
  { value: "HIGH", label: "Alta", color: "#e53e3e" },
];

const ListDetailScreen = () => {
  const route = useRoute<Route>();
  const { categoryId } = route.params;
  const { todos, loading, fetchTodos, addTodo, removeTodo, toggleTodo } =
    useTodos();

  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TodoPriority>("MEDIUM");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchTodos();
  }, []);

  // Filtrar las tareas de esta lista/categoría
  const categoryTodos = todos.filter((t) =>
    t.categories?.some((c) => c.id === categoryId)
  );

  const completed = categoryTodos.filter((t) => t.completed).length;

  const handleCreate = async () => {
    if (!title.trim()) {
      Alert.alert("Error", "El título es requerido");
      return;
    }
    setSaving(true);
    try {
      await addTodo(title.trim(), description.trim(), [categoryId], priority);
      setTitle("");
      setDescription("");
      setPriority("MEDIUM");
      setShowModal(false);
    } catch {
      Alert.alert("Error", "No se pudo crear la tarea");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert("Eliminar tarea", "¿Estás seguro?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () =>
          removeTodo(id).catch(() =>
            Alert.alert("Error", "No se pudo eliminar la tarea")
          ),
      },
    ]);
  };

  if (loading && todos.length === 0) return <LoadingOverlay />;

  return (
    <View style={styles.container}>
      <View style={styles.summaryBar}>
        <Text style={styles.summaryText}>
          {completed} / {categoryTodos.length} completadas
        </Text>
        {categoryTodos.length > 0 && (
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${
                    Math.round((completed / categoryTodos.length) * 100)
                  }%`,
                },
              ]}
            />
          </View>
        )}
      </View>

      <FlatList
        data={categoryTodos}
        keyExtractor={(t) => t.id}
        renderItem={({ item }) => (
          <TodoItem
            todo={item}
            onToggle={() => toggleTodo(item.id)}
            onDelete={() => handleDelete(item.id)}
          />
        )}
        ListEmptyComponent={
          <EmptyState message={"Sin tareas en esta lista.\n¡Agrega una!"} />
        }
        contentContainerStyle={
          categoryTodos.length === 0 ? styles.flex : styles.list
        }
        refreshing={loading}
        onRefresh={fetchTodos}
      />

      <AppButton
        label="+ Nueva Tarea"
        onPress={() => setShowModal(true)}
        style={styles.fab}
      />

      <Modal visible={showModal} animationType="slide" transparent>
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Nueva Tarea</Text>

            <AppInput
              label="Título *"
              placeholder="¿Qué hay que hacer?"
              value={title}
              onChangeText={setTitle}
            />
            <AppInput
              label="Descripción"
              placeholder="Descripción opcional..."
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
              style={styles.multiline}
            />

            <Text style={styles.sectionLabel}>Prioridad</Text>
            <View style={styles.chipRow}>
              {PRIORITIES.map((p) => (
                <TouchableOpacity
                  key={p.value}
                  style={[
                    styles.chip,
                    { borderColor: p.color },
                    priority === p.value && { backgroundColor: p.color },
                  ]}
                  onPress={() => setPriority(p.value)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      { color: priority === p.value ? "#fff" : p.color },
                    ]}
                  >
                    {p.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <AppButton
              label="Crear Tarea"
              onPress={handleCreate}
              loading={saving}
              style={styles.createBtn}
            />
            <AppButton
              label="Cancelar"
              onPress={() => {
                setTitle("");
                setDescription("");
                setPriority("MEDIUM");
                setShowModal(false);
              }}
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
  summaryBar: {
    backgroundColor: "#5B5FDE",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  summaryText: { color: "#fff", fontSize: 13, fontWeight: "500" },
  progressBar: {
    height: 4,
    backgroundColor: "#ffffff44",
    borderRadius: 2,
    marginTop: 8,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#fff",
    borderRadius: 2,
  },
  fab: { position: "absolute", bottom: 24, left: 16, right: 16 },
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
  multiline: { height: 80, textAlignVertical: "top" },
  sectionLabel: {
    fontSize: 13,
    color: "#555",
    fontWeight: "500",
    marginBottom: 8,
  },
  chipRow: { flexDirection: "row", gap: 8, marginBottom: 16 },
  chip: {
    borderWidth: 1.5,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  chipText: { fontSize: 13, fontWeight: "600" },
  createBtn: { marginTop: 4 },
  cancelBtn: { marginTop: 8 },
});

export default ListDetailScreen;
