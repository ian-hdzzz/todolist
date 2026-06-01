import { useEffect, useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Modal,
  Text,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useTodos } from "../hooks/useTodos";
import { useCategories } from "../hooks/useCategories";
import { TodoPriority } from "../domain/Todo";
import TodoItem from "../components/TodoItem";
import AppButton from "../components/AppButton";
import AppInput from "../components/AppInput";
import LoadingOverlay from "../components/LoadingOverlay";
import EmptyState from "../components/EmptyState";

const PRIORITIES: { value: TodoPriority; label: string; color: string }[] = [
  { value: "LOW", label: "Baja", color: "#38a169" },
  { value: "MEDIUM", label: "Media", color: "#d69e2e" },
  { value: "HIGH", label: "Alta", color: "#e53e3e" },
];

const HomeScreen = () => {
  const { todos, loading, error, fetchTodos, addTodo, removeTodo, toggleTodo } =
    useTodos();
  const { categories, fetchCategories } = useCategories();

  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TodoPriority>("MEDIUM");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchTodos();
    fetchCategories();
  }, []);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPriority("MEDIUM");
    setSelectedCategoryId(null);
  };

  const handleCreate = async () => {
    if (!title.trim()) {
      Alert.alert("Error", "El titulo es requerido");
      return;
    }
    setSaving(true);
    try {
      const catIds = selectedCategoryId ? [selectedCategoryId] : [];
      await addTodo(title.trim(), description.trim(), catIds, priority);
      resetForm();
      setShowModal(false);
    } catch (e: any) {
      const msg =
        e.response?.data?.message ??
        e.response?.data ??
        e.message ??
        "No se pudo crear la tarea";
      Alert.alert("Error", String(msg));
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

  const pending = todos.filter((t) => !t.completed).length;
  const done = todos.filter((t) => t.completed).length;

  if (loading && todos.length === 0) return <LoadingOverlay />;

  return (
    <View style={styles.container}>
      <View style={styles.summary}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryNum}>{pending}</Text>
          <Text style={styles.summaryLabel}>Pendientes</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryNum}>{done}</Text>
          <Text style={styles.summaryLabel}>Completadas</Text>
        </View>
      </View>

      {error ? <Text style={styles.errorBanner}>{error}</Text> : null}

      <FlatList
        data={todos}
        keyExtractor={(t) => t.id}
        renderItem={({ item }) => (
          <TodoItem
            todo={item}
            onToggle={() => toggleTodo(item.id)}
            onDelete={() => handleDelete(item.id)}
          />
        )}
        ListEmptyComponent={
          <EmptyState message={"Sin tareas aun.\n¡Crea tu primera tarea!"} />
        }
        contentContainerStyle={todos.length === 0 ? styles.flex : styles.list}
        refreshing={loading}
        onRefresh={fetchTodos}
      />

      <AppButton
        label="+ Nueva Tarea"
        onPress={() => setShowModal(true)}
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
                <Text style={styles.modalTitle}>Nueva Tarea</Text>

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

                {categories.length > 0 && (
                  <>
                    <Text style={styles.sectionLabel}>Lista (opcional)</Text>
                    <View style={styles.chipRow}>
                      {[
                        { id: null as string | null, name: "Ninguna" },
                        ...categories,
                      ].map((cat) => (
                        <TouchableOpacity
                          key={cat.id ?? "none"}
                          style={[
                            styles.chip,
                            { borderColor: "#5B5FDE" },
                            selectedCategoryId === cat.id && {
                              backgroundColor: "#5B5FDE",
                            },
                          ]}
                          onPress={() => setSelectedCategoryId(cat.id)}
                        >
                          <Text
                            style={[
                              styles.chipText,
                              {
                                color:
                                  selectedCategoryId === cat.id
                                    ? "#fff"
                                    : "#5B5FDE",
                              },
                            ]}
                          >
                            {cat.name}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </>
                )}

                <AppButton
                  label="Crear Tarea"
                  onPress={handleCreate}
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
  summary: {
    flexDirection: "row",
    backgroundColor: "#5B5FDE",
    paddingVertical: 14,
    justifyContent: "center",
    gap: 40,
  },
  summaryItem: { alignItems: "center" },
  summaryNum: { color: "#fff", fontSize: 22, fontWeight: "800" },
  summaryLabel: { color: "#dde", fontSize: 12, marginTop: 2 },
  summaryDivider: { width: 1, backgroundColor: "#ffffff44" },
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
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 14 },
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

export default HomeScreen;
