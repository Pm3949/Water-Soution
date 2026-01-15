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

// Utility: add days to a date
const addDays = (date, days) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

export default function CustomersScreen() {
  const { token } = useContext(AuthContext);

  const [customers, setCustomers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [lastServiceDate, setLastServiceDate] = useState("");

  // 🔴 Filter state
  const [filter, setFilter] = useState("all"); // all | overdue

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      const res = await getCustomers(token);
      setCustomers(res.data);
    } catch {
      Alert.alert("Error", "Error loading customers");
    }
  };

  const openAdd = () => {
    setEditingId(null);
    setName("");
    setPhone("");
    setAddress("");
    setLastServiceDate("");
    setShowModal(true);
  };

  const openEdit = (c) => {
    setEditingId(c._id);
    setName(c.name);
    setPhone(c.phone);
    setAddress(c.address || "");
    setLastServiceDate(
      c.lastServiceDate
        ? new Date(c.lastServiceDate).toISOString().slice(0, 10)
        : ""
    );
    setShowModal(true);
  };

  const saveCustomer = async () => {
    if (!name || !phone || !lastServiceDate) {
      return Alert.alert("Required", "Fill all required fields");
    }

    try {
      if (editingId) {
        await updateCustomer(
          editingId,
          { name, phone, address, lastServiceDate },
          token
        );
      } else {
        await createCustomer({ name, phone, address, lastServiceDate }, token);
      }

      setShowModal(false);
      loadCustomers();
    } catch {
      Alert.alert("Error", "Failed to save customer");
    }
  };

  const removeCustomer = (id) => {
    Alert.alert("Delete?", "Are you sure you want to delete this customer?", [
      { text: "Cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deleteCustomer(id, token);
          loadCustomers();
        },
      },
    ]);
  };

  const remind = async (id) => {
    try {
      await sendReminder(id, token);
      Alert.alert("Success", "Reminder sent");
    } catch {
      Alert.alert("Error", "Reminder failed");
    }
  };

  // 🔴 FILTER LOGIC
  const filteredCustomers = customers.filter((c) => {
    if (filter === "all") return true;

    const next = addDays(c.lastServiceDate, 90);
    return next < new Date(); // overdue
  });

  const renderItem = ({ item }) => {
    const next = addDays(item.lastServiceDate, 90);
    const overdue = next < new Date();

    return (
      <View style={[styles.card, overdue && styles.overdueCard]}>
        <Text>Name: {item.name}</Text>
        <Text>Phone: {item.phone}</Text>
        <Text>Address: {item.address || "-"}</Text>
        <Text>
          Last Service: {new Date(item.lastServiceDate).toDateString()}
        </Text>
        <Text style={{ color: overdue ? "red" : "black" }}>
          Next Service: {next.toDateString()}
        </Text>

        <View style={styles.row}>
          <TouchableOpacity onPress={() => remind(item._id)}>
            <Text style={styles.btn}>Remind</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => openEdit(item)}>
            <Text style={styles.btn}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => removeCustomer(item._id)}>
            <Text style={[styles.btn, { color: "red" }]}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Add customer */}
      <TouchableOpacity onPress={openAdd}>
        <Text style={styles.add}>+ Add Customer</Text>
      </TouchableOpacity>

      {/* 🔴 FILTER BUTTONS */}
      <View style={styles.filterRow}>
        <TouchableOpacity onPress={() => setFilter("all")}>
          <Text style={[styles.filterBtn, filter === "all" && styles.active]}>
            All
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setFilter("overdue")}>
          <Text
            style={[
              styles.filterBtn,
              filter === "overdue" && styles.active,
              { color: "red" },
            ]}
          >
            Overdue
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredCustomers}
        keyExtractor={(i) => i._id}
        renderItem={renderItem}
      />

      {/* Modal */}
      <Modal visible={showModal}>
        <View style={styles.modal}>
          <Text>Name *</Text>
          <TextInput value={name} onChangeText={setName} style={styles.input} />

          <Text>Phone *</Text>
          <TextInput
            value={phone}
            onChangeText={setPhone}
            style={styles.input}
          />

          <Text>Address</Text>
          <TextInput
            value={address}
            onChangeText={setAddress}
            style={styles.input}
          />

          <Text>Last Service Date *</Text>
          <TextInput
            value={lastServiceDate}
            onChangeText={setLastServiceDate}
            placeholder="YYYY-MM-DD"
            style={styles.input}
          />

          <TouchableOpacity onPress={saveCustomer}>
            <Text style={styles.btn}>Save</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setShowModal(false)}>
            <Text style={styles.btn}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 15 },
  add: { fontSize: 18, color: "blue", marginBottom: 10 },

  filterRow: {
    flexDirection: "row",
    gap: 15,
    marginBottom: 10,
  },
  filterBtn: {
    fontSize: 16,
    color: "blue",
  },
  active: {
    fontWeight: "bold",
    textDecorationLine: "underline",
  },

  card: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  overdueCard: {
    borderColor: "red",
    backgroundColor: "#fff5f5",
  },
  row: {
    flexDirection: "row",
    gap: 10,
    marginTop: 5,
  },
  btn: { color: "blue" },

  modal: { padding: 20 },
  input: {
    borderWidth: 1,
    padding: 8,
    marginBottom: 10,
  },
});
