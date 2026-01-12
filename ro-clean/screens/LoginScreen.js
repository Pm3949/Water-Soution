import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { useState, useContext } from "react";
import { loginApi } from "../services/api";
import { AuthContext } from "../context/AuthContext";

export default function LoginScreen({ navigation }) {
  const { login } = useContext(AuthContext);

  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");

  const handleLogin = async () => {
    try {
      const res = await loginApi({ phone, pin });
      await login(res.data);
      navigation.replace("Dashboard");
    } catch (err) {
      alert("Invalid login");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>RO Login</Text>

      <TextInput
        placeholder="Phone"
        value={phone}
        onChangeText={setPhone}
        style={styles.input}
        keyboardType="phone-pad"
      />

      <TextInput
        placeholder="PIN"
        value={pin}
        onChangeText={setPin}
        style={styles.input}
        secureTextEntry
      />

      <Button title="Login" onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 6,
  },
});
