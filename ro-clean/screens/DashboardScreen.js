import { View, Text, Button } from "react-native";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function DashboardScreen({ navigation }) {
  const { user, logout } = useContext(AuthContext);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 20 }}>Welcome {user?.name}</Text>
      <Text>Role: {user?.role}</Text>

      {user?.role === "owner" && (
        <Button
          title="Manage Workers"
          onPress={() => navigation.navigate("Workers")}
        />
      )}
      <Button
        title="Customers"
        onPress={() => navigation.navigate("Customers")}
      />

      <Button title="Logout" onPress={logout} />
    </View>
  );
}
