import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthProvider } from "./context/AuthContext";

import LoginScreen from "./screens/LoginScreen";
import DashboardScreen from "./screens/DashboardScreen";
import WorkersScreen from "./screens/WorkersScreen";
import CustomersScreen from "./screens/CustomersScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Dashboard" component={DashboardScreen} />
          <Stack.Screen name="Workers" component={WorkersScreen} />
          <Stack.Screen name="Customers" component={CustomersScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}
