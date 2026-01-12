import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  sendReminder,
} from "../services/api";

export default function CustomersScreen() {
  const { token } = useContext(AuthContext);

  const [customers, setCustomers] = useState([]);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form fields
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      const res = await getCustomers(token);
      setCustomers(res.data);
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Failed to load customers");
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setName("");
    setPhone("");
    setAddress("");
    setShowModal(true);
  };

  const openEditModal = (customer) => {
    setEditingId(customer._id);
    setName(customer.name);
    setPhone(customer.phone);
    setAddress(customer.address || "");
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!name || !phone) {
      return Alert.alert("Name and phone required");
    }

    try {
      if (editingId) {
        await updateCustomer(editingId, { name, phone, address }, token);
      } else {
        await createCustomer({ name, phone, address }, token);
      }

      setShowModal(false);
      loadCustomers();
    } catch (err) {
      Alert.alert("Error", "Failed to save customer");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCustomer(id, token);
      loadCustomers();
    } catch {
      Alert.alert("Error", "Failed to delete");
    }
  };

  const handleReminder = async (id) => {
    try {
      await sendReminder(id, token);
      Alert.alert("Success", "Reminder sent");
    } catch {
      Alert.alert("Error", "Failed to send reminder");
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.name}</Text>
      <Text>📞 {item.phone}</Text>
      {item.address ? <Text>📍 {item.address}</Text> : null}

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.blueBtn}
          onPress={() => handleReminder(item._id)}
        >
          <Text style={styles.btnText}>Reminder</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.grayBtn}
          onPress={() => openEditModal(item)}
        >
          <Text style={styles.btnText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.redBtn}
          onPress={() => handleDelete(item._id)}
        >
          <Text style={styles.btnText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addButton} onPress={openAddModal}>
        <Text style={{ color: "#fff", fontWeight: "bold" }}>+ Add Customer</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Customers</Text>

      <FlatList
        data={customers}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
      />

      {/* Add/Edit Modal */}
      <Modal visible={showModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>
              {editingId ? "Edit Customer" : "Add Customer"}
            </Text>

            <TextInput
              placeholder="Name"
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
              placeholder="Address"
              value={address}
              onChangeText={setAddress}
              style={styles.input}
            />

            <TouchableOpacity style={styles.blueBtn} onPress={handleSave}>
              <Text style={styles.btnText}>Save</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.redBtn}
              onPress={() => setShowModal(false)}
            >
              <Text style={styles.btnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#f8fafc" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },

  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  name: { fontSize: 18, fontWeight: "bold" },

  actions: {
    flexDirection: "row",
    gap: 6,
    marginTop: 10,
  },

  addButton: {
    backgroundColor: "#16a34a",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },

  blueBtn: {
    backgroundColor: "#2563eb",
    padding: 8,
    borderRadius: 6,
  },
  grayBtn: {
    backgroundColor: "#64748b",
    padding: 8,
    borderRadius: 6,
  },
  redBtn: {
    backgroundColor: "#dc2626",
    padding: 8,
    borderRadius: 6,
  },
  btnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },

  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalBox: {
    backgroundColor: "#fff",
    padding: 20,
    width: "85%",
    borderRadius: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
});
