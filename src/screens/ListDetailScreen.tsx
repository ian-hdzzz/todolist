import { useEffect, useState } from "react";
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  Modal,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
import { useTodos } from "../hooks/useTodos";
import { Todo, TodoPriority } from "../domain/Todo";
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

const extractError = (e: any): string => {
  const data = e?.response?.data;
  if (!data) return e?.message ?? "Error al guardar la tarea";
  if (typeof data === "string") return data;
  return data.message ?? data.detail ?? data.error ?? JSON.stringify(data);
};

const ListDetailScreen = () => {
  const route = useRoute<Route>();
  const { categoryId } = route.params;
  const { todos, loading, fetchTodos, addTodo, editTodo, removeTodo, toggleTodo } =
    useTodos();

  const [showModal, setShowModal] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TodoPriority>("MEDIUM");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchTodos();
  }, []);

  const categoryTodos = todos.filter((t) =>
    t.categories?.some((c) => c.id === categoryId)
  );
  const completed = categoryTodos.filter((t) => t.completed).length;

  const resetForm = () => {
    setEditingTodo(null);
    setTitle("");
    setDescription("");
    setPriority("MEDIUM");
  };

  const openCreate = () => {
    resetForm();
    setShowModal(true);
  };

  const openEdit = (todo: Todo) => {
    setEditingTodo(todo);
    setTitle(todo.title);
    setDescription(todo.description ?? "");
    setPriority(todo.priority);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert("Error", "El titulo es requerido");
      return;
    }
    setSaving(true);
    try {
      if (editingTodo) {
        await editTodo(editingTodo.id, {
          title: title.trim(),
          description: description.trim(),
          priority,
          categories: [categoryId],
        });
      } else {
        await addTodo(title.trim(), description.trim(), [categoryId], priority);
      }
      resetForm();
      setShowModal(false);
    } catch (e: any) {
      Alert.alert("Error", extractError(e));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert("Eliminar tarea", "¿Estas seguro?", [
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
                { width: `${Math.round((completed / categoryTodos.length) * 100)}%` },
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
            onEdit={() => openEdit(item)}
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
        onPress={openCreate}
        style={styles.fab}
      />

      <Modal visible={showModal} animationType="slide" transparent>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={styles.overlay}>
            <View style={styles.modal}>
              <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                <Text style={styles.modalTitle}>
                  {editingTodo ? "Editar Tarea" : "Nueva Tarea"}
                </Text>

                <AppInput
                  label="Titulo *"
                  placeholder="¿Que hay que hacer?"
                  value={title}
                  onChangeText={setTitle}
                />
                <AppInput
                  label="Descripcion"
                  placeholder="Descripcion opcional..."
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
                  label={editingTodo ? "Guardar cambios" : "Crear Tarea"}
                  onPress={handleSave}
                  loading={saving}
                  style={styles.createBtn}
                />
                <AppButton
                  label="Cancelar"
                  onPress={() => {
                    resetForm();
                    setShowModal(false);
                  }}
                  variant="outline"
                  style={styles.cancelBtn}
                />
              </ScrollView>
            </View>
          </View>
        </KeyboardAvoidingView>
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
  progressFill: { height: "100%", backgroundColor: "#fff", borderRadius: 2 },
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
    maxHeight: "90%",
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
