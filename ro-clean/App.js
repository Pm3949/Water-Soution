import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "./screens/LoginScreen";
import DashboardScreen from "./screens/DashboardScreen";
import CustomersScreen from "./screens/CustomersScreen";
import AddCustomerScreen from "./screens/AddCustomerScreen";
import WorkersScreen from "./screens/WorkersScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="Customers" component={CustomersScreen} />
        <Stack.Screen name="AddCustomer" component={AddCustomerScreen} />
        <Stack.Screen name="Workers" component={WorkersScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
