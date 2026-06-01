import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Todo } from "../domain/Todo";

const PRIORITY_COLOR: Record<string, string> = {
  HIGH: "#e53e3e",
  MEDIUM: "#d69e2e",
  LOW: "#38a169",
};

const PRIORITY_LABEL: Record<string, string> = {
  HIGH: "Alta",
  MEDIUM: "Media",
  LOW: "Baja",
};

interface Props {
  todo: Todo;
  onToggle: () => void;
  onDelete: () => void;
}

const TodoItem = ({ todo, onToggle, onDelete }: Props) => {
  const priorityColor = PRIORITY_COLOR[todo.priority] ?? "#888";

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.checkArea} onPress={onToggle}>
        <View style={[styles.circle, todo.completed && styles.circleChecked]}>
          {todo.completed && <View style={styles.checkFill} />}
        </View>
      </TouchableOpacity>

      <View style={styles.info}>
        <View style={styles.titleRow}>
          <Text
            style={[styles.title, todo.completed && styles.titleDone]}
            numberOfLines={2}
          >
            {todo.title}
          </Text>
          <View
            style={[styles.priorityBadge, { backgroundColor: priorityColor + "22" }]}
          >
            <Text style={[styles.priorityText, { color: priorityColor }]}>
              {PRIORITY_LABEL[todo.priority] ?? todo.priority}
            </Text>
          </View>
        </View>

        {todo.description ? (
          <Text style={styles.desc} numberOfLines={2}>
            {todo.description}
          </Text>
        ) : null}

        {todo.dueDate ? (
          <Text style={styles.dueDate}>
            Vence: {new Date(todo.dueDate).toLocaleDateString("es-MX")}
          </Text>
        ) : null}

        {todo.categories?.length > 0 && (
          <View style={styles.tagsRow}>
            {todo.categories.map((c) => (
              <View
                key={c.id}
                style={[styles.tag, { backgroundColor: (c.color ?? "#5B5FDE") + "22" }]}
              >
                <Text style={[styles.tagText, { color: c.color ?? "#5B5FDE" }]}>
                  {c.name}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>

      <TouchableOpacity onPress={onDelete} style={styles.deleteBtn}>
        <Text style={styles.deleteText}>X</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginVertical: 4,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  checkArea: { marginRight: 12, marginTop: 2 },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#5B5FDE",
    justifyContent: "center",
    alignItems: "center",
  },
  circleChecked: { backgroundColor: "#5B5FDE", borderColor: "#5B5FDE" },
  checkFill: { width: 10, height: 10, borderRadius: 5, backgroundColor: "#fff" },
  info: { flex: 1 },
  titleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 8,
  },
  title: { fontSize: 15, fontWeight: "500", color: "#222", flex: 1 },
  titleDone: { textDecorationLine: "line-through", color: "#aaa" },
  priorityBadge: {
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignSelf: "flex-start",
  },
  priorityText: { fontSize: 11, fontWeight: "600" },
  desc: { fontSize: 12, color: "#888", marginTop: 3 },
  dueDate: { fontSize: 11, color: "#805ad5", marginTop: 4 },
  tagsRow: { flexDirection: "row", flexWrap: "wrap", gap: 4, marginTop: 6 },
  tag: { borderRadius: 6, paddingHorizontal: 7, paddingVertical: 2 },
  tagText: { fontSize: 11, fontWeight: "600" },
  deleteBtn: { padding: 8 },
  deleteText: { color: "#e53e3e", fontSize: 15, fontWeight: "bold" },
});

export default TodoItem;
