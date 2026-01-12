import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useState } from "react";
import { addCustomer } from "../services/api";

export default function AddCustomerScreen({ navigation }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handleAdd = async () => {
    try {
      await addCustomer({ name, phone });
      alert("Customer added");
      navigation.goBack();
    } catch {
      alert("Failed to add");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Customer</Text>

      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Phone"
        value={phone}
        onChangeText={setPhone}
      />

      <TouchableOpacity style={styles.button} onPress={handleAdd}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
}
