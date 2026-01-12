import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useState } from "react";
import { login } from "../services/api";

export default function LoginScreen({ navigation }) {
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");

  const handleLogin = async () => {
    try {
      const res = await login({ phone, pin });

      if (res.data.token) {
        navigation.replace("Dashboard", {
          role: res.data.role,
        });
      }
    } catch (err) {
      alert("Invalid login");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>RO Login</Text>

      <TextInput
        placeholder="Phone"
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />

      <TextInput
        placeholder="PIN"
        style={styles.input}
        value={pin}
        onChangeText={setPin}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f8fafc",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#2563eb",
    padding: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});
