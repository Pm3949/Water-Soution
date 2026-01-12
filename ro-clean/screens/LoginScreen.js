import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useState } from "react";

export default function LoginScreen({ navigation }) {
  const [pin, setPin] = useState("");

  const handleLogin = () => {
    if (pin === "1234") {
      navigation.replace("Dashboard");
    } else {
      alert("Wrong PIN");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>RO Service Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter PIN"
        value={pin}
        onChangeText={setPin}
        keyboardType="numeric"
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
