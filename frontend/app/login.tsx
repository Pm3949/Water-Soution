import { View, Text, TextInput, Button } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import API from "@/src/services/api";

export default function Login() {
  const [pin, setPin] = useState("");

  const login = async () => {
    try {
      await API.post("/auth/login", { pin });
      router.replace("/(tabs)/customers");
    } catch {
      alert("Invalid PIN");
    }
  };

  return (
    <View style={{ padding: 30 }}>
      <Text>Enter PIN</Text>

      <TextInput
        value={pin}
        onChangeText={setPin}
        keyboardType="numeric"
        secureTextEntry
        style={{ borderWidth: 1, padding: 10, marginVertical: 10 }}
      />

      <Button title="Login" onPress={login} />
    </View>
  );
}
