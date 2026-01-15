import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  Alert,
  Modal,
  TouchableOpacity,
  StatusBar,
  ScrollView,
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

  // Add worker form
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");

  // Reset PIN modal
  const [showResetModal, setShowResetModal] = useState(false);
  const [selectedWorkerId, setSelectedWorkerId] = useState(null);
  const [selectedWorkerName, setSelectedWorkerName] = useState("");
  const [newPin, setNewPin] = useState("");

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

  const handleCreateWorker = async () => {
    if (!name || !phone || !pin) {
      return Alert.alert("Required", "All fields are required");
    }

    if (pin.length < 4) {
      return Alert.alert("Invalid PIN", "PIN must be at least 4 digits");
    }

    try {
      await createWorker({ name, phone, pin }, token);
      setName("");
      setPhone("");
      setPin("");
      setShowAddForm(false);
      loadWorkers();
      Alert.alert("Success", "Worker added successfully");
    } catch {
      Alert.alert("Error", "Failed to add worker");
    }
  };

  const handleDelete = async (id, workerName) => {
    Alert.alert(
      "Delete Worker?",
      `Are you sure you want to delete ${workerName}? This action cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteWorker(id, token);
              loadWorkers();
              Alert.alert("Deleted", "Worker has been removed");
            } catch {
              Alert.alert("Error", "Failed to delete worker");
            }
          },
        },
      ]
    );
  };

  const openResetModal = (id, workerName) => {
    setSelectedWorkerId(id);
    setSelectedWorkerName(workerName);
    setNewPin("");
    setShowResetModal(true);
  };

  const submitResetPin = async () => {
    if (!newPin || newPin.length < 4) {
      return Alert.alert("Invalid PIN", "PIN must be at least 4 digits");
    }

    try {
      await resetWorkerPin(selectedWorkerId, newPin, token);
      Alert.alert("Success", "PIN updated successfully");
      setShowResetModal(false);
    } catch {
      Alert.alert("Error", "Failed to reset PIN");
    }
  };

  const renderWorker = ({ item }) => (
    <View style={styles.workerCard}>
      <View style={styles.workerHeader}>
        <View style={styles.workerAvatar}>
          <Text style={styles.workerAvatarText}>
            {item.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.workerInfo}>
          <Text style={styles.workerName}>{item.name}</Text>
          <View style={styles.workerPhoneRow}>
            <Text style={styles.phoneIcon}>📱</Text>
            <Text style={styles.workerPhone}>{item.phone}</Text>
          </View>
        </View>
      </View>

      <View style={styles.workerActions}>
        <TouchableOpacity
          style={[styles.workerBtn, styles.resetBtn]}
          onPress={() => openResetModal(item._id, item.name)}
        >
          <Text style={styles.resetBtnIcon}>🔒</Text>
          <Text style={styles.workerBtnText}>Reset PIN</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.workerBtn, styles.deleteWorkerBtn]}
          onPress={() => handleDelete(item._id, item.name)}
        >
          <Text style={styles.deleteBtnIcon}>🗑️</Text>
          <Text style={styles.deleteWorkerBtnText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Workers</Text>
          <Text style={styles.headerSubtitle}>
            {workers.length} {workers.length === 1 ? "worker" : "workers"} active
          </Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddForm(true)}
        >
          <Text style={styles.addButtonText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {/* Workers List */}
      {workers.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>👷</Text>
          <Text style={styles.emptyTitle}>No Workers Yet</Text>
          <Text style={styles.emptyText}>
            Add your first worker to help manage customers
          </Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={() => setShowAddForm(true)}
          >
            <Text style={styles.emptyButtonText}>Add Worker</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={workers}
          keyExtractor={(item) => item._id}
          renderItem={renderWorker}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Add Worker Modal */}
      <Modal visible={showAddForm} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Worker</Text>
              <TouchableOpacity onPress={() => setShowAddForm(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              <View style={styles.iconCircle}>
                <Text style={styles.modalIcon}>👷</Text>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Worker Name *</Text>
                <TextInput
                  placeholder="Enter worker name"
                  placeholderTextColor="#94a3b8"
                  value={name}
                  onChangeText={setName}
                  style={styles.modalInput}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Phone Number *</Text>
                <TextInput
                  placeholder="Enter phone number"
                  placeholderTextColor="#94a3b8"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  style={styles.modalInput}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>PIN *</Text>
                <TextInput
                  placeholder="Enter 4-6 digit PIN"
                  placeholderTextColor="#94a3b8"
                  value={pin}
                  onChangeText={setPin}
                  secureTextEntry
                  keyboardType="numeric"
                  maxLength={6}
                  style={styles.modalInput}
                />
                <View style={styles.infoBox}>
                  <Text style={styles.infoIcon}>ℹ️</Text>
                  <Text style={styles.infoText}>
                    Worker will use this PIN to login to the app
                  </Text>
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.cancelBtn]}
                onPress={() => setShowAddForm(false)}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, styles.saveBtn]}
                onPress={handleCreateWorker}
              >
                <Text style={styles.saveBtnText}>Add Worker</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Reset PIN Modal */}
      <Modal visible={showResetModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { maxHeight: 400 }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Reset PIN</Text>
              <TouchableOpacity onPress={() => setShowResetModal(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalContent}>
              <View style={styles.iconCircle}>
                <Text style={styles.modalIcon}>🔒</Text>
              </View>

              <Text style={styles.resetWorkerName}>{selectedWorkerName}</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>New PIN *</Text>
                <TextInput
                  placeholder="Enter new 4-6 digit PIN"
                  placeholderTextColor="#94a3b8"
                  value={newPin}
                  onChangeText={setNewPin}
                  secureTextEntry
                  keyboardType="numeric"
                  maxLength={6}
                  style={styles.modalInput}
                />
                <Text style={styles.inputHint}>
                  Worker will need this new PIN to login
                </Text>
              </View>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.cancelBtn]}
                onPress={() => setShowResetModal(false)}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, styles.saveBtn]}
                onPress={submitResetPin}
              >
                <Text style={styles.saveBtnText}>Update PIN</Text>
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
    backgroundColor: "#8b5cf6",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    shadowColor: "#8b5cf6",
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
  listContent: {
    padding: 16,
  },
  workerCard: {
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
  workerHeader: {
    flexDirection: "row",
    marginBottom: 16,
  },
  workerAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#8b5cf6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  workerAvatarText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  workerInfo: {
    flex: 1,
    justifyContent: "center",
  },
  workerName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 4,
  },
  workerPhoneRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  phoneIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  workerPhone: {
    fontSize: 14,
    color: "#64748b",
  },
  workerActions: {
    flexDirection: "row",
    gap: 8,
  },
  workerBtn: {
    flex: 1,
    flexDirection: "row",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  resetBtn: {
    backgroundColor: "#eff6ff",
  },
  deleteWorkerBtn: {
    backgroundColor: "#fef2f2",
  },
  resetBtnIcon: {
    fontSize: 14,
  },
  deleteBtnIcon: {
    fontSize: 14,
  },
  workerBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e293b",
  },
  deleteWorkerBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#dc2626",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 15,
    color: "#64748b",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
  },
  emptyButton: {
    backgroundColor: "#8b5cf6",
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: "#8b5cf6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  emptyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
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
    maxHeight: "85%",
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
    backgroundColor: "#f3f0ff",
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
  resetWorkerName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1e293b",
    textAlign: "center",
    marginBottom: 20,
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
    backgroundColor: "#8b5cf6",
    shadowColor: "#8b5cf6",
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