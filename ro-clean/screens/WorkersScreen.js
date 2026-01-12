import { View, Text, FlatList, StyleSheet } from "react-native";

export default function WorkersScreen() {
  const workers = [
    { id: "1", name: "Ramesh", phone: "9876543210" },
    { id: "2", name: "Suresh", phone: "9123456780" },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Workers</Text>

      <FlatList
        data={workers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text>{item.phone}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  card: { backgroundColor: "#fff", padding: 15, marginBottom: 10, borderRadius: 10 },
  name: { fontWeight: "bold", fontSize: 16 },
});
