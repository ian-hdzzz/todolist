import { useEffect, useState, useMemo, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useCategories } from "../hooks/useCategories";
import { useTodos } from "../hooks/useTodos";
import { Todo } from "../domain/Todo";
import * as todoApi from "../data/todoApi";
import AppInput from "../components/AppInput";
import TodoItem from "../components/TodoItem";
import CategoryCard from "../components/CategoryCard";
import EmptyState from "../components/EmptyState";

type Tab = "todos" | "lists";

const SearchScreen = () => {
  const navigation = useNavigation<any>();
  const { categories, fetchCategories } = useCategories();
  const { todos: allTodos, fetchTodos, toggleTodo, removeTodo } = useTodos();

  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<Tab>("todos");
  const [searchResults, setSearchResults] = useState<Todo[]>([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchTodos();
  }, []);

  // Búsqueda en backend con debounce (solo cuando hay query)
  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) {
      setSearchResults([]);
      return;
    }
    setSearching(true);
    try {
      const results = await todoApi.searchTodos(q.trim());
      setSearchResults(results);
    } catch {
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (tab === "todos") doSearch(query);
    }, 400);
    return () => clearTimeout(timer);
  }, [query, tab, doSearch]);

  // Tareas: sin query muestra todas, con query muestra resultados del backend
  const todosToShow = query.trim() ? searchResults : allTodos;

  // Categorías: sin query muestra todas, con query filtra localmente
  const filteredCategories = useMemo(() => {
    if (!query.trim()) return categories;
    const q = query.toLowerCase();
    return categories.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q)
    );
  }, [query, categories]);

  const todoCountFor = (categoryId: string) =>
    allTodos.filter((t) => t.categories?.some((c) => c.id === categoryId)).length;

  return (
    <View style={styles.container}>
      <View style={styles.searchBox}>
        <AppInput
          placeholder="Buscar tareas o listas..."
          value={query}
          onChangeText={setQuery}
          autoCorrect={false}
          style={styles.input}
        />
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, tab === "todos" && styles.tabActive]}
          onPress={() => setTab("todos")}
        >
          <Text style={[styles.tabText, tab === "todos" && styles.tabTextActive]}>
            Tareas
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, tab === "lists" && styles.tabActive]}
          onPress={() => setTab("lists")}
        >
          <Text style={[styles.tabText, tab === "lists" && styles.tabTextActive]}>
            Listas
          </Text>
        </TouchableOpacity>
      </View>

      {tab === "todos" ? (
        <>
          {searching && (
            <ActivityIndicator color="#5B5FDE" style={styles.spinner} />
          )}
          <FlatList
            data={todosToShow}
            keyExtractor={(t) => t.id}
            renderItem={({ item }) => (
              <TodoItem
                todo={item}
                onToggle={() => toggleTodo(item.id)}
                onDelete={() => removeTodo(item.id)}
              />
            )}
            ListEmptyComponent={
              !searching ? (
                <EmptyState
                  message={
                    query.trim()
                      ? "Sin resultados para tareas"
                      : "Sin tareas aun"
                  }
                />
              ) : null
            }
            contentContainerStyle={
              todosToShow.length === 0 ? styles.flex : styles.list
            }
          />
        </>
      ) : (
        <FlatList
          data={filteredCategories}
          keyExtractor={(c) => c.id}
          renderItem={({ item }) => (
            <CategoryCard
              category={item}
              todoCount={todoCountFor(item.id)}
              onPress={() =>
                navigation.navigate("ListsTab", {
                  screen: "ListDetail",
                  params: { categoryId: item.id, categoryTitle: item.name },
                })
              }
            />
          )}
          ListEmptyComponent={
            <EmptyState
              message={
                query.trim() ? "Sin resultados para listas" : "Sin listas aun"
              }
            />
          }
          contentContainerStyle={
            filteredCategories.length === 0 ? styles.flex : styles.list
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f6ff" },
  flex: { flex: 1 },
  searchBox: {
    padding: 16,
    paddingBottom: 4,
    backgroundColor: "#fff",
  },
  input: { marginBottom: 0 },
  tabs: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  tab: { flex: 1, paddingVertical: 12, alignItems: "center" },
  tabActive: { borderBottomWidth: 2, borderBottomColor: "#5B5FDE" },
  tabText: { fontSize: 14, color: "#888", fontWeight: "500" },
  tabTextActive: { color: "#5B5FDE", fontWeight: "700" },
  spinner: { marginTop: 16 },
  list: { padding: 16 },
});

export default SearchScreen;
