import { View, Text, FlatList, Button } from "react-native";
import { useEffect, useState } from "react";
import API from "@/src/services/api";

export default function Customers() {
  const [customers, setCustomers] = useState([]);

  const load = async () => {
    const res = await API.get("/customers");
    setCustomers(res.data);
  };

  const sendReminder = async (id: string) => {
    await API.post(`/customers/${id}/send-reminder`);
    alert("Reminder sent");
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <FlatList
      data={customers}
      keyExtractor={(item: any) => item._id}
      renderItem={({ item }) => (
        <View style={{ padding: 15 }}>
          <Text>{item.name}</Text>
          <Text>{item.phone}</Text>
          <Button title="Send Reminder" onPress={() => sendReminder(item._id)} />
        </View>
      )}
    />
  );
}
