import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
  StatusBar,
  ScrollView,
} from "react-native";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  sendReminder,
  markServiceDone,
} from "../services/api";

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
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

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

  const removeCustomer = (id, customerName) => {
    Alert.alert(
      "Delete Customer?", 
      `Are you sure you want to delete ${customerName}?`, 
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteCustomer(id, token);
              loadCustomers();
            } catch (err) {
              Alert.alert("Error", "Failed to delete customer");
            }
          },
        },
      ]
    );
  };

  const markDone = async (id, customerName) => {
    Alert.alert(
      "Mark Service Complete?",
      `Mark service as completed for ${customerName}?\n\nThis will update the next service date.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Mark Done",
          onPress: async () => {
            try {
              await markServiceDone(id, token);
              Alert.alert("Success", "Service marked as completed");
              loadCustomers();
            } catch {
              Alert.alert("Error", "Failed to update service");
            }
          },
        },
      ]
    );
  };

  const remind = async (id, customerName) => {
    Alert.alert(
      "Send Reminder?",
      `Send service reminder to ${customerName}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Send",
          onPress: async () => {
            try {
              await sendReminder(id, token);
              Alert.alert("Success", "Reminder sent successfully");
            } catch {
              Alert.alert("Error", "Failed to send reminder");
            }
          },
        },
      ]
    );
  };

  const filteredCustomers = customers.filter((c) => {
    const searchText = search.toLowerCase();
    const matchesSearch =
      c.name.toLowerCase().includes(searchText) ||
      c.phone.includes(searchText) ||
      (c.address || "").toLowerCase().includes(searchText);

    if (!matchesSearch) return false;

    const next = new Date(c.nextServiceDate || addDays(c.lastServiceDate, 90));
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    next.setHours(0, 0, 0, 0);

    if (filter === "overdue") return next < today;
    if (filter === "today") return next.getTime() === today.getTime();

    return true;
  });

  const getStatusInfo = (nextDate) => {
    const next = new Date(nextDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    next.setHours(0, 0, 0, 0);

    if (next < today) {
      return { label: "OVERDUE", color: "#dc2626", bg: "#fee2e2" };
    } else if (next.getTime() === today.getTime()) {
      return { label: "DUE TODAY", color: "#f59e0b", bg: "#fef3c7" };
    } else {
      return { label: "UPCOMING", color: "#10b981", bg: "#d1fae5" };
    }
  };

  const renderItem = ({ item }) => {
    const status = getStatusInfo(item.nextServiceDate);

    return (
      <View
        style={[
          styles.customerCard,
          status.label === "OVERDUE" && styles.overdueCard,
        ]}
      >
        {/* Customer Info */}
        <View style={styles.customerHeader}>
          <Text style={styles.customerName}>{item.name}</Text>
          <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
            <Text style={[styles.statusText, { color: status.color }]}>
              {status.label}
            </Text>
          </View>
        </View>

        <View style={styles.customerDetails}>
          <View style={styles.detailRow}>
            <Text style={styles.detailIcon}>📱</Text>
            <Text style={styles.detailText}>{item.phone}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailIcon}>📍</Text>
            <Text style={styles.detailText}>{item.address || "No address"}</Text>
          </View>
        </View>

        <View style={styles.dateRow}>
          <View style={styles.dateItem}>
            <Text style={styles.dateLabel}>Last Service</Text>
            <Text style={styles.dateValue}>
              {new Date(item.lastServiceDate).toLocaleDateString("en-IN")}
            </Text>
          </View>
          <View style={styles.dateItem}>
            <Text style={styles.dateLabel}>Next Service</Text>
            <Text style={[styles.dateValue, { color: status.color }]}>
              {new Date(item.nextServiceDate).toLocaleDateString("en-IN")}
            </Text>
          </View>
        </View>

        {/* Action Buttons - NOW WITH TEXT LABELS */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.actionBtn, styles.remindBtn]}
            onPress={() => remind(item._id, item.name)}
          >
            <Text style={styles.actionIcon}>📲</Text>
            <Text style={styles.actionBtnLabel}>Remind</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, styles.doneBtn]}
            onPress={() => markDone(item._id, item.name)}
          >
            <Text style={styles.actionIcon}>✓</Text>
            <Text style={styles.actionBtnLabel}> Service Done</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, styles.editBtn]}
            onPress={() => openEdit(item)}
          >
            <Text style={styles.actionIcon}>✏️</Text>
            <Text style={styles.actionBtnLabel}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, styles.deleteBtn]}
            onPress={() => removeCustomer(item._id, item.name)}
          >
            <Text style={styles.actionIcon}>🗑️</Text>
            <Text style={styles.actionBtnLabel}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Customers</Text>
          <Text style={styles.headerSubtitle}>{customers.length} active</Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={openAdd}>
          <Text style={styles.addButtonText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          placeholder="Search by name, phone, or address"
          placeholderTextColor="#94a3b8"
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterRow}>
        <TouchableOpacity
          style={[styles.filterTab, filter === "all" && styles.filterTabActive]}
          onPress={() => setFilter("all")}
        >
          <Text
            style={[
              styles.filterText,
              filter === "all" && styles.filterTextActive,
            ]}
          >
            All
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterTab,
            filter === "today" && styles.filterTabActive,
          ]}
          onPress={() => setFilter("today")}
        >
          <Text
            style={[
              styles.filterText,
              filter === "today" && styles.filterTextActive,
            ]}
          >
            Due Today
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterTab,
            filter === "overdue" && styles.filterTabActive,
          ]}
          onPress={() => setFilter("overdue")}
        >
          <Text
            style={[
              styles.filterText,
              filter === "overdue" && styles.filterTextActive,
            ]}
          >
            Overdue
          </Text>
        </TouchableOpacity>
      </View>

      {/* Customer List */}
      <FlatList
        data={filteredCustomers}
        keyExtractor={(i) => i._id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>👥</Text>
            <Text style={styles.emptyTitle}>No Customers Found</Text>
            <Text style={styles.emptyText}>
              {search
                ? "Try a different search"
                : "Add your first customer to get started"}
            </Text>
          </View>
        }
      />

      {/* Add/Edit Modal */}
      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingId ? "Edit Customer" : "Add Customer"}
              </Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              <View style={styles.iconCircle}>
                <Text style={styles.modalIcon}>👤</Text>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Name *</Text>
                <TextInput
                  placeholder="Customer name"
                  placeholderTextColor="#94a3b8"
                  value={name}
                  onChangeText={setName}
                  style={styles.modalInput}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Phone *</Text>
                <TextInput
                  placeholder="Phone number"
                  placeholderTextColor="#94a3b8"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  style={styles.modalInput}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Address</Text>
                <TextInput
                  placeholder="Full address"
                  placeholderTextColor="#94a3b8"
                  value={address}
                  onChangeText={setAddress}
                  multiline
                  numberOfLines={3}
                  style={[styles.modalInput, { height: 80, textAlignVertical: "top" }]}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Last Service Date *</Text>
                <TextInput
                  placeholder="YYYY-MM-DD (e.g., 2026-01-15)"
                  placeholderTextColor="#94a3b8"
                  value={lastServiceDate}
                  onChangeText={setLastServiceDate}
                  style={styles.modalInput}
                />
                <View style={styles.infoBox}>
                  <Text style={styles.infoIcon}>ℹ️</Text>
                  <Text style={styles.infoText}>
                    Next service will be calculated after 90 days
                  </Text>
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.cancelBtn]}
                onPress={() => setShowModal(false)}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, styles.saveBtn]}
                onPress={saveCustomer}
              >
                <Text style={styles.saveBtnText}>
                  {editingId ? "Update Customer" : "Save Customer"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1e293b",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 2,
  },
  addButton: {
    backgroundColor: "#1e40af",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    shadowColor: "#1e40af",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    color: "#1e293b",
  },
  filterRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 12,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f1f5f9",
  },
  filterTabActive: {
    backgroundColor: "#1e40af",
  },
  filterText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748b",
  },
  filterTextActive: {
    color: "#fff",
  },
  listContent: {
    padding: 16,
  },
  customerCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  overdueCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#dc2626",
    backgroundColor: "#fef2f2",
  },
  customerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  customerName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e293b",
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "bold",
  },
  customerDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  detailIcon: {
    fontSize: 14,
    marginRight: 8,
    width: 20,
  },
  detailText: {
    fontSize: 14,
    color: "#64748b",
    flex: 1,
  },
  dateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },
  dateItem: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 12,
    color: "#94a3b8",
    marginBottom: 4,
  },
  dateValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e293b",
  },
  actionRow: {
    flexDirection: "row",
    gap: 8,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 54,
  },
  actionIcon: {
    fontSize: 18,
    marginBottom: 2,
  },
  actionBtnLabel: {
    fontSize: 11,
    fontWeight: "600",
    marginTop: 2,
  },
  remindBtn: {
    backgroundColor: "#eff6ff",
  },
  doneBtn: {
    backgroundColor: "#d1fae5",
  },
  editBtn: {
    backgroundColor: "#f1f5f9",
  },
  deleteBtn: {
    backgroundColor: "#fee2e2",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1e293b",
  },
  closeButton: {
    fontSize: 24,
    color: "#64748b",
    width: 30,
    textAlign: "center",
  },
  modalContent: {
    padding: 20,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#eff6ff",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 24,
  },
  modalIcon: {
    fontSize: 40,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 8,
  },
  modalInput: {
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
    color: "#1e293b",
  },
  inputHint: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 6,
  },
  infoBox: {
    flexDirection: "row",
    backgroundColor: "#eff6ff",
    padding: 12,
    borderRadius: 10,
    borderLeftWidth: 3,
    borderLeftColor: "#3b82f6",
    marginTop: 8,
    alignItems: "flex-start",
  },
  infoIcon: {
    fontSize: 14,
    marginRight: 8,
    marginTop: 1,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: "#1e40af",
    lineHeight: 18,
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  cancelBtn: {
    backgroundColor: "#f1f5f9",
  },
  cancelBtnText: {
    color: "#64748b",
    fontWeight: "600",
    fontSize: 15,
  },
  saveBtn: {
    backgroundColor: "#1e40af",
    shadowColor: "#1e40af",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  saveBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
});