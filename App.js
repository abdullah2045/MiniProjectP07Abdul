import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Keyboard,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function App() {
  // 1. STATE MANAGEMENT (P04)
  const [tasks, setTasks] = useState([]);
  const [inputText, setInputText] = useState("");
  const [priority, setPriority] = useState("Sedang"); // Rendah, Sedang, Tinggi
  const [filter, setFilter] = useState("Semua"); // Semua, Aktif, Selesai

  // 2. FITUR CRUD: ADD TASK (P05 & P06)
  const addTask = () => {
    // Validasi Form Input
    if (inputText.trim() === "") {
      Alert.alert("Oops!", "Nama task tidak boleh kosong, ya!");
      return;
    }

    const newTask = {
      id: Date.now().toString(), // keyExtractor yang unik
      text: inputText,
      isDone: false, // Fitur Bonus: Mark as Done
      priority: priority, // Fitur Bonus: Prioritas
    };

    setTasks([...tasks, newTask]);
    setInputText("");
    Keyboard.dismiss();
  };

  // 3. FITUR CRUD: DELETE TASK (P06)
  const deleteTask = (id) => {
    Alert.alert("Hapus Task", "Yakin ingin menghapus task ini?", [
      { text: "Batal", style: "cancel" },
      {
        text: "Hapus",
        style: "destructive",
        onPress: () => setTasks(tasks.filter((t) => t.id !== id)),
      },
    ]);
  };

  // 4. FITUR BONUS: MARK AS DONE
  const toggleDone = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, isDone: !task.isDone } : task,
      ),
    );
  };

  // 5. FITUR BONUS: FILTER & COUNTER
  const completedCount = tasks.filter((t) => t.isDone).length;
  const totalCount = tasks.length;

  const filteredTasks = tasks.filter((task) => {
    if (filter === "Aktif") return !task.isDone;
    if (filter === "Selesai") return task.isDone;
    return true;
  });

  // Komponen List Kosong (P06)
  const ListEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="rocket-outline" size={64} color="#475569" />
      <Text style={styles.emptyText}>Belum ada task di kategori ini.</Text>
      <Text style={styles.emptySubText}>
        Ayo tambahkan task baru untuk memulai!
      </Text>
    </View>
  );

  // Render Item untuk FlatList
  const renderItem = ({ item }) => {
    // Menentukan warna badge berdasarkan prioritas
    let prioColor = "#4ADE80"; // Rendah (Hijau)
    if (item.priority === "Sedang") prioColor = "#FBBF24"; // Sedang (Kuning)
    if (item.priority === "Tinggi") prioColor = "#F87171"; // Tinggi (Merah)

    return (
      <View style={styles.taskCard}>
        <TouchableOpacity
          style={styles.checkbox}
          onPress={() => toggleDone(item.id)}
        >
          <Ionicons
            name={item.isDone ? "checkmark-circle" : "ellipse-outline"}
            size={28}
            color={item.isDone ? "#818CF8" : "#64748B"}
          />
        </TouchableOpacity>

        <View style={styles.taskInfo}>
          <Text style={[styles.taskText, item.isDone && styles.taskTextDone]}>
            {item.text}
          </Text>
          <View style={[styles.badge, { backgroundColor: prioColor + "20" }]}>
            <Text style={[styles.badgeText, { color: prioColor }]}>
              {item.priority}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => deleteTask(item.id)}
          style={styles.deleteBtn}
        >
          <Ionicons name="trash-outline" size={22} color="#EF4444" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          MyTaskList <Text style={styles.rocket}>🚀</Text>
        </Text>
        <Text style={styles.counterText}>
          {completedCount} task selesai dari {totalCount} total
        </Text>
      </View>

      {/* FILTER BUTTONS */}
      <View style={styles.filterContainer}>
        {["Semua", "Aktif", "Selesai"].map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterBtn, filter === f && styles.filterBtnActive]}
            onPress={() => setFilter(f)}
          >
            <Text
              style={[
                styles.filterText,
                filter === f && styles.filterTextActive,
              ]}
            >
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* LIST TASK DINAMIS (P06) */}
      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={ListEmpty}
        showsVerticalScrollIndicator={false}
      />

      {/* FORM INPUT DENGAN KEYBOARD AVOIDING VIEW (P05) */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.inputSection}
      >
        {/* Pilihan Prioritas */}
        <View style={styles.prioritySelector}>
          {["Rendah", "Sedang", "Tinggi"].map((p) => (
            <TouchableOpacity
              key={p}
              style={[styles.prioBtn, priority === p && styles.prioBtnActive]}
              onPress={() => setPriority(p)}
            >
              <Text
                style={[
                  styles.prioText,
                  priority === p && styles.prioTextActive,
                ]}
              >
                {p}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Input Text & Button */}
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Ketik task baru di sini..."
            placeholderTextColor="#64748B"
            value={inputText}
            onChangeText={setInputText}
          />
          <TouchableOpacity style={styles.addBtn} onPress={addTask}>
            <Ionicons name="add" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

// 6. STYLING DENGAN STYLE SHEET & FLEXBOX (P02 & P03)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A", // Slate 900
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: "#1E293B", // Slate 800
    borderBottomWidth: 1,
    borderBottomColor: "#334155",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#F8FAFC",
  },
  rocket: {
    fontSize: 24,
  },
  counterText: {
    color: "#94A3B8",
    marginTop: 5,
    fontSize: 14,
    fontWeight: "500",
  },
  filterContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 15,
    gap: 10,
  },
  filterBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#1E293B",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#334155",
  },
  filterBtnActive: {
    backgroundColor: "#818CF8", // Indigo 400
    borderColor: "#818CF8",
  },
  filterText: {
    color: "#94A3B8",
    fontWeight: "600",
    fontSize: 13,
  },
  filterTextActive: {
    color: "#FFF",
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexGrow: 1,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 80,
  },
  emptyText: {
    color: "#F8FAFC",
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
  },
  emptySubText: {
    color: "#64748B",
    marginTop: 8,
    textAlign: "center",
  },
  taskCard: {
    flexDirection: "row",
    backgroundColor: "#1E293B",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  checkbox: {
    marginRight: 12,
  },
  taskInfo: {
    flex: 1,
  },
  taskText: {
    color: "#F8FAFC",
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  taskTextDone: {
    color: "#64748B",
    textDecorationLine: "line-through",
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  deleteBtn: {
    padding: 8,
  },
  inputSection: {
    backgroundColor: "#1E293B",
    padding: 20,
    paddingBottom: Platform.OS === "ios" ? 40 : 20,
    borderTopWidth: 1,
    borderTopColor: "#334155",
  },
  prioritySelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  prioBtn: {
    flex: 1,
    paddingVertical: 6,
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: "#0F172A",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#334155",
  },
  prioBtnActive: {
    backgroundColor: "#334155",
    borderColor: "#818CF8",
  },
  prioText: {
    color: "#64748B",
    fontSize: 12,
    fontWeight: "600",
  },
  prioTextActive: {
    color: "#818CF8",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    backgroundColor: "#0F172A",
    color: "#F8FAFC",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    fontSize: 15,
    borderWidth: 1,
    borderColor: "#334155",
  },
  addBtn: {
    backgroundColor: "#818CF8",
    padding: 12,
    borderRadius: 12,
    marginLeft: 12,
    justifyContent: "center",
    alignItems: "center",
  },
});
