import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Category } from "../domain/Category";

interface Props {
  category: Category;
  todoCount?: number;
  onPress: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const CategoryCard = ({
  category,
  todoCount = 0,
  onPress,
  onEdit,
  onDelete,
}: Props) => {
  const color = category.color ?? "#5B5FDE";

  return (
    <TouchableOpacity
      style={[styles.card, { borderLeftColor: color }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={[styles.dot, { backgroundColor: color }]} />
      <View style={styles.info}>
        <Text style={styles.title}>{category.name}</Text>
        {category.description ? (
          <Text style={styles.desc} numberOfLines={1}>
            {category.description}
          </Text>
        ) : null}
      </View>

      <View style={styles.right}>
        <View style={[styles.badge, { backgroundColor: color + "22" }]}>
          <Text style={[styles.badgeText, { color }]}>{todoCount}</Text>
        </View>
        {onEdit && (
          <TouchableOpacity onPress={onEdit} style={styles.actionBtn}>
            <Text style={styles.editText}>Editar</Text>
          </TouchableOpacity>
        )}
        {onDelete && (
          <TouchableOpacity onPress={onDelete} style={styles.actionBtn}>
            <Text style={styles.deleteText}>X</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginVertical: 5,
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  dot: { width: 10, height: 10, borderRadius: 5, marginRight: 12 },
  info: { flex: 1 },
  title: { fontSize: 16, fontWeight: "600", color: "#222" },
  desc: { fontSize: 12, color: "#888", marginTop: 2 },
  right: { flexDirection: "row", alignItems: "center", gap: 4 },
  badge: {
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 4,
    minWidth: 32,
    alignItems: "center",
  },
  badgeText: { fontWeight: "bold", fontSize: 14 },
  actionBtn: { padding: 6 },
  editText: { fontSize: 12, color: "#5B5FDE", fontWeight: "600" },
  deleteText: { color: "#e53e3e", fontSize: 14, fontWeight: "bold" },
});

export default CategoryCard;
