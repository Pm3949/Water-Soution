import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { getCustomers } from "../services/api";

const addDays = (date, days) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

export default function DashboardScreen({ navigation }) {
  const { token, user } = useContext(AuthContext);

  const [total, setTotal] = useState(0);
  const [dueToday, setDueToday] = useState(0);
  const [dueWeek, setDueWeek] = useState(0);
  const [overdue, setOverdue] = useState(0);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const res = await getCustomers(token);
      const customers = res.data;

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      let todayCount = 0;
      let weekCount = 0;
      let overdueCount = 0;

      customers.forEach((c) => {
        const next = addDays(c.lastServiceDate, 90);
        next.setHours(0, 0, 0, 0);

        if (next.getTime() === today.getTime()) todayCount++;
        if (next < today) overdueCount++;

        const diffDays = (next - today) / (1000 * 60 * 60 * 24);
        if (diffDays >= 0 && diffDays <= 7) weekCount++;
      });

      setTotal(customers.length);
      setDueToday(todayCount);
      setDueWeek(weekCount);
      setOverdue(overdueCount);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>

      <View style={styles.card}>
        <Text>Total Customers: {total}</Text>
      </View>

      <View style={styles.card}>
        <Text>Due Today: {dueToday}</Text>
      </View>

      <View style={styles.card}>
        <Text>Due in 7 Days: {dueWeek}</Text>
      </View>

      <View style={styles.card}>
        <Text style={{ color: "red" }}>Overdue: {overdue}</Text>
      </View>

      {/* Buttons */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Customers")}
      >
        <Text style={styles.buttonText}>Go to Customers</Text>
      </TouchableOpacity>

      {user?.role === "owner" && (
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Workers")}
        >
          <Text style={styles.buttonText}>Go to Workers</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 22, marginBottom: 20 },
  card: {
    borderWidth: 1,
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#2563eb",
    padding: 15,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
});
