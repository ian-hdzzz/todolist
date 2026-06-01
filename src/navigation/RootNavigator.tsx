import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "../hooks/useAuth";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import AppTabs from "./AppTabs";
import LoadingOverlay from "../components/LoadingOverlay";
import { AuthStackParams } from "./types";

const Stack = createNativeStackNavigator<AuthStackParams>();

const RootNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingOverlay />;

  return (
    <NavigationContainer>
      {user ? (
        <AppTabs />
      ) : (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default RootNavigator;
