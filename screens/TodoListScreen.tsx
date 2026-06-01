import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "../services/firebase";

interface Props {
  onLogout: () => void;
}

interface Todo {
  id: string;
  text: string;
  done: boolean;
}

const TodoListScreen = ({ onLogout }: Props) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");

  const addTodo = () => {
    if (!input.trim()) return;
    setTodos([...todos, { id: Date.now().toString(), text: input.trim(), done: false }]);
    setInput("");
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((t) => t.id !== id));
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      onLogout();
    } catch {
      Alert.alert("Error", "No se pudo cerrar sesión");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mis tareas</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logout}>Salir</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Nueva tarea..."
          value={input}
          onChangeText={setInput}
        />
        <TouchableOpacity style={styles.addButton} onPress={addTodo}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={todos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.todoItem}>
            <TouchableOpacity onPress={() => toggleTodo(item.id)} style={styles.todoText}>
              <Text style={[styles.todoLabel, item.done && styles.todoDone]}>
                {item.done ? "✓ " : "○ "}{item.text}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteTodo(item.id)}>
              <Text style={styles.deleteBtn}>✕</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No hay tareas. Agrega una arriba.</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 24, paddingTop: 60 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 24 },
  title: { fontSize: 26, fontWeight: "bold" },
  logout: { color: "#5B5FDE", fontSize: 15 },
  inputRow: { flexDirection: "row", marginBottom: 16, gap: 8 },
  input: { flex: 1, borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 12, fontSize: 15 },
  addButton: { backgroundColor: "#5B5FDE", borderRadius: 8, paddingHorizontal: 18, justifyContent: "center" },
  addButtonText: { color: "#fff", fontSize: 24, lineHeight: 28 },
  todoItem: { flexDirection: "row", alignItems: "center", paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#f0f0f0" },
  todoText: { flex: 1 },
  todoLabel: { fontSize: 16 },
  todoDone: { textDecorationLine: "line-through", color: "#aaa" },
  deleteBtn: { color: "#e55", fontSize: 16, paddingLeft: 12 },
  empty: { textAlign: "center", color: "#aaa", marginTop: 40 },
});

export default TodoListScreen;
