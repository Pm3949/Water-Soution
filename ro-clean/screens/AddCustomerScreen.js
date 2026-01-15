// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   StatusBar,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
//   Alert,
// } from "react-native";
// import { useState, useContext } from "react";
// import { addCustomer } from "../services/api";
// import { AuthContext } from "../context/AuthContext";

// export default function AddCustomerScreen({ navigation }) {
//   const { token } = useContext(AuthContext);

//   const [name, setName] = useState("");
//   const [phone, setPhone] = useState("");
//   const [address, setAddress] = useState("");
//   const [lastServiceDate, setLastServiceDate] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleAdd = async () => {
//     if (!name || !phone || !address || !lastServiceDate) {
//       return Alert.alert("Required", "All fields are required");
//     }

//     if (!/^\d{4}-\d{2}-\d{2}$/.test(lastServiceDate)) {
//       return Alert.alert("Invalid Date", "Use YYYY-MM-DD format");
//     }

//     setLoading(true);
//     try {
//       await addCustomer(
//         { name, phone, address, lastServiceDate },
//         token
//       );

//       Alert.alert("Success", "Customer added successfully");
//       navigation.goBack();
//     } catch (err) {
//       Alert.alert("Error", "Failed to add customer");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <KeyboardAvoidingView
//       behavior={Platform.OS === "ios" ? "padding" : "height"}
//       style={styles.container}
//     >
//       <StatusBar barStyle="dark-content" />

//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Text style={styles.backButtonText}>← Back</Text>
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Add Customer</Text>
//         <View style={{ width: 60 }} />
//       </View>

//       <ScrollView contentContainerStyle={styles.scrollContent}>
//         <View style={styles.iconContainer}>
//           <Text style={styles.icon}>👤</Text>
//         </View>

//         <Text style={styles.sectionTitle}>Customer Information</Text>

//         <View style={styles.form}>
//           {/* Name */}
//           <View style={styles.inputGroup}>
//             <Text style={styles.label}>Name *</Text>
//             <TextInput
//               placeholder="Customer name"
//               value={name}
//               onChangeText={setName}
//               style={styles.input}
//             />
//           </View>

//           {/* Phone */}
//           <View style={styles.inputGroup}>
//             <Text style={styles.label}>Phone *</Text>
//             <TextInput
//               placeholder="Phone number"
//               value={phone}
//               onChangeText={setPhone}
//               keyboardType="phone-pad"
//               style={styles.input}
//             />
//           </View>

//           {/* Address */}
//           <View style={styles.inputGroup}>
//             <Text style={styles.label}>Address *</Text>
//             <TextInput
//               placeholder="Full address"
//               value={address}
//               onChangeText={setAddress}
//               style={[styles.input, { height: 80 }]}
//               multiline
//             />
//           </View>

//           {/* Last Service */}
//           <View style={styles.inputGroup}>
//             <Text style={styles.label}>Last Service Date *</Text>
//             <TextInput
//               placeholder="YYYY-MM-DD"
//               value={lastServiceDate}
//               onChangeText={setLastServiceDate}
//               style={styles.input}
//             />
//           </View>

//           <View style={styles.infoBox}>
//             <Text>ℹ️ Next service will auto calculate after 90 days</Text>
//           </View>
//         </View>
//       </ScrollView>

//       <View style={styles.footer}>
//         <TouchableOpacity
//           style={[styles.saveButton, loading && styles.buttonDisabled]}
//           onPress={handleAdd}
//           disabled={loading}
//         >
//           <Text style={styles.saveButtonText}>
//             {loading ? "Saving..." : "Save Customer"}
//           </Text>
//         </TouchableOpacity>
//       </View>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#f8fafc",
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingHorizontal: 20,
//     paddingTop: 60,
//     paddingBottom: 20,
//     backgroundColor: "#fff",
//     borderBottomWidth: 1,
//     borderBottomColor: "#e2e8f0",
//   },
//   backButton: {
//     width: 60,
//   },
//   backButtonText: {
//     fontSize: 16,
//     color: "#3b82f6",
//     fontWeight: "600",
//   },
//   headerTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#1e293b",
//   },
//   content: {
//     flex: 1,
//   },
//   scrollContent: {
//     padding: 20,
//   },
//   iconContainer: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     backgroundColor: "#eff6ff",
//     justifyContent: "center",
//     alignItems: "center",
//     alignSelf: "center",
//     marginBottom: 24,
//   },
//   icon: {
//     fontSize: 40,
//   },
//   sectionTitle: {
//     fontSize: 20,
//     fontWeight: "bold",
//     color: "#1e293b",
//     marginBottom: 20,
//   },
//   form: {
//     gap: 20,
//   },
//   inputGroup: {
//     gap: 8,
//   },
//   label: {
//     fontSize: 14,
//     fontWeight: "600",
//     color: "#1e293b",
//   },
//   inputWrapper: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#fff",
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: "#e2e8f0",
//     paddingHorizontal: 16,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.05,
//     shadowRadius: 2,
//     elevation: 1,
//   },
//   inputIcon: {
//     fontSize: 20,
//     marginRight: 12,
//   },
//   input: {
//     flex: 1,
//     paddingVertical: 16,
//     fontSize: 16,
//     color: "#1e293b",
//   },
//   infoBox: {
//     flexDirection: "row",
//     backgroundColor: "#eff6ff",
//     padding: 16,
//     borderRadius: 12,
//     borderLeftWidth: 4,
//     borderLeftColor: "#3b82f6",
//     marginTop: 10,
//   },
//   infoIcon: {
//     fontSize: 16,
//     marginRight: 10,
//   },
//   infoText: {
//     flex: 1,
//     fontSize: 13,
//     color: "#1e40af",
//     lineHeight: 18,
//   },
//   footer: {
//     padding: 20,
//     backgroundColor: "#fff",
//     borderTopWidth: 1,
//     borderTopColor: "#e2e8f0",
//   },
//   saveButton: {
//     backgroundColor: "#1e40af",
//     paddingVertical: 16,
//     borderRadius: 12,
//     alignItems: "center",
//     shadowColor: "#1e40af",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   buttonDisabled: {
//     backgroundColor: "#94a3b8",
//     shadowOpacity: 0,
//   },
//   saveButtonText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
// });
