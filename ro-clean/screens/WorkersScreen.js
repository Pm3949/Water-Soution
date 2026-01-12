import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  Alert,
  Modal,
} from "react-native";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  getWorkers,
  createWorker,
  deleteWorker,
  resetWorkerPin,
} from "../services/api";

export default function WorkersScreen() {
  const { token } = useContext(AuthContext);

  const [workers, setWorkers] = useState([]);

  // Add worker states
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");

  // Reset PIN modal states
  const [showModal, setShowModal] = useState(false);
  const [selectedWorkerId, setSelectedWorkerId] = useState(null);
  const [newPin, setNewPin] = useState("");

  // Load workers
  const loadWorkers = async () => {
    try {
      const res = await getWorkers(token);
      setWorkers(res.data);
    } catch {
      Alert.alert("Error", "Failed to load workers");
    }
  };

  useEffect(() => {
    loadWorkers();
  }, []);

  // Add worker
  const handleCreateWorker = async () => {
    if (!name || !phone || !pin) {
      return Alert.alert("All fields required");
    }

    try {
      await createWorker({ name, phone, pin }, token);
      setName("");
      setPhone("");
      setPin("");
      loadWorkers();
      Alert.alert("Success", "Worker added");
    } catch {
      Alert.alert("Error", "Failed to add worker");
    }
  };

  // Delete worker
  const handleDelete = async (id) => {
    try {
      await deleteWorker(id, token);
      loadWorkers();
    } catch {
      Alert.alert("Error", "Failed to delete worker");
    }
  };

  // Open reset PIN modal
  const openResetModal = (id) => {
    setSelectedWorkerId(id);
    setNewPin("");
    setShowModal(true);
  };

  // Submit reset PIN
  const submitResetPin = async () => {
    if (!newPin) return Alert.alert("Enter new PIN");

    try {
      await resetWorkerPin(selectedWorkerId, newPin, token);
      Alert.alert("Success", "PIN updated");
      setShowModal(false);
    } catch {
      Alert.alert("Error", "Failed to reset PIN");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Worker Management</Text>

      {/* Add Worker Form */}
      <View style={styles.form}>
        <TextInput
          placeholder="Worker name"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
        <TextInput
          placeholder="Phone"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          style={styles.input}
        />
        <TextInput
          placeholder="PIN"
          value={pin}
          onChangeText={setPin}
          secureTextEntry
          keyboardType="numeric"
          style={styles.input}
        />
        <Button title="Add Worker" onPress={handleCreateWorker} />
      </View>

      {/* Workers List */}
      <FlatList
        data={workers}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View>
              <Text style={styles.name}>{item.name}</Text>
              <Text>{item.phone}</Text>
            </View>

            <View style={{ gap: 6 }}>
              <Button
                title="Reset PIN"
                onPress={() => openResetModal(item._id)}
              />
              <Button
                title="Delete"
                color="red"
                onPress={() => handleDelete(item._id)}
              />
            </View>
          </View>
        )}
      />

      {/* Reset PIN Modal */}
      <Modal visible={showModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Reset Worker PIN</Text>

            <TextInput
              placeholder="Enter new PIN"
              value={newPin}
              onChangeText={setNewPin}
              secureTextEntry
              keyboardType="numeric"
              style={styles.input}
            />

            <Button title="Submit" onPress={submitResetPin} />
            <View style={{ height: 10 }} />
            <Button
              title="Cancel"
              color="red"
              onPress={() => setShowModal(false)}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  form: { marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#f2f2f2",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: { fontSize: 16, fontWeight: "bold" },

  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalBox: {
    backgroundColor: "white",
    padding: 20,
    width: "80%",
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
});
