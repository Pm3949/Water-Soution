import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  RefreshControl,
} from "react-native";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { getCustomers } from "../services/api";

const addDays = (date, days) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

export default function DashboardScreen({ navigation }) {
  const { token, user, logout } = useContext(AuthContext);

  const [total, setTotal] = useState(0);
  const [dueToday, setDueToday] = useState(0);
  const [dueWeek, setDueWeek] = useState(0);
  const [overdue, setOverdue] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

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

  const onRefresh = async () => {
    setRefreshing(true);
    await loadStats();
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Dashboard</Text>
          <Text style={styles.headerSubtitle}>
            Welcome, {user?.name || "User"}
          </Text>
        </View>

        <TouchableOpacity onPress={logout}>
          <Text style={{ color: "red" }}>Logout</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Stats Cards */}
        <View style={styles.statsGrid}>
          {/* Total Customers */}
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Text style={styles.statIcon}>👥</Text>
            </View>
            <Text style={styles.statLabel}>Total Customers</Text>
            <Text style={styles.statValue}>{total}</Text>
          </View>

          {/* Due Today */}
          <View style={[styles.statCard, styles.todayCard]}>
            <View style={styles.statIconContainer}>
              <Text style={styles.statIcon}>⏰</Text>
            </View>
            <Text style={styles.statLabel}>Due Today</Text>
            <Text style={[styles.statValue, styles.todayValue]}>
              {dueToday}
            </Text>
          </View>

          {/* Due This Week */}
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Text style={styles.statIcon}>📅</Text>
            </View>
            <Text style={styles.statLabel}>Due This Week</Text>
            <Text style={styles.statValue}>{dueWeek}</Text>
          </View>

          {/* Overdue */}
          <View style={[styles.statCard, styles.overdueCard]}>
            <View style={styles.statIconContainer}>
              <Text style={styles.statIcon}>⚠️</Text>
            </View>
            <Text style={styles.statLabel}>Overdue</Text>
            <Text style={[styles.statValue, styles.overdueValue]}>
              {overdue}
            </Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate("Customers")}
          >
            <View style={styles.actionIconContainer}>
              <Text style={styles.actionIcon}>📋</Text>
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>View Customers</Text>
              <Text style={styles.actionSubtitle}>
                Manage customer list & services
              </Text>
            </View>
            <Text style={styles.actionArrow}>›</Text>
          </TouchableOpacity>

          {user?.role === "owner" && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate("Workers")}
            >
              <View style={styles.actionIconContainer}>
                <Text style={styles.actionIcon}>👷</Text>
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>Manage Workers</Text>
                <Text style={styles.actionSubtitle}>
                  Add & manage worker accounts
                </Text>
              </View>
              <Text style={styles.actionArrow}>›</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
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
  logoutButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#f1f5f9",
    borderRadius: 8,
  },
  logoutText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748b",
  },
  scrollContent: {
    padding: 20,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    minWidth: "47%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  todayCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#f59e0b",
    backgroundColor: "#fffbeb",
  },
  overdueCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#dc2626",
    backgroundColor: "#fef2f2",
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f8fafc",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  statIcon: {
    fontSize: 20,
  },
  statLabel: {
    fontSize: 13,
    color: "#64748b",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1e293b",
  },
  todayValue: {
    color: "#f59e0b",
  },
  overdueValue: {
    color: "#dc2626",
  },
  actionsSection: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 16,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
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
  actionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#eff6ff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  actionIcon: {
    fontSize: 24,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: 13,
    color: "#64748b",
  },
  actionArrow: {
    fontSize: 24,
    color: "#94a3b8",
    marginLeft: 8,
  },
});
