import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "../screens/HomeScreen";
import ListsScreen from "../screens/ListsScreen";
import ListDetailScreen from "../screens/ListDetailScreen";
import SearchScreen from "../screens/SearchScreen";
import ProfileScreen from "../screens/ProfileScreen";
import { ListsStackParams, AppTabParams } from "./types";

const Tab = createBottomTabNavigator<AppTabParams>();
const ListsStack = createNativeStackNavigator<ListsStackParams>();

const ListsNavigator = () => (
  <ListsStack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: "#5B5FDE" },
      headerTintColor: "#fff",
      headerTitleStyle: { fontWeight: "700" },
    }}
  >
    <ListsStack.Screen
      name="Lists"
      component={ListsScreen}
      options={{ title: "Mis Listas" }}
    />
    <ListsStack.Screen
      name="ListDetail"
      component={ListDetailScreen}
      options={({ route }) => ({ title: route.params.categoryTitle })}
    />
  </ListsStack.Navigator>
);

const AppTabs = () => (
  <Tab.Navigator
    screenOptions={{
      tabBarActiveTintColor: "#5B5FDE",
      tabBarInactiveTintColor: "#aaa",
      tabBarStyle: { paddingBottom: 4 },
      headerStyle: { backgroundColor: "#5B5FDE" },
      headerTintColor: "#fff",
      headerTitleStyle: { fontWeight: "700" },
    }}
  >
    <Tab.Screen
      name="HomeTab"
      component={HomeScreen}
      options={{
        title: "Inicio",
        tabBarLabel: "Inicio",
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="home-outline" size={size} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="ListsTab"
      component={ListsNavigator}
      options={{
        title: "Listas",
        tabBarLabel: "Listas",
        headerShown: false,
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="list-outline" size={size} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="SearchTab"
      component={SearchScreen}
      options={{
        title: "Buscar",
        tabBarLabel: "Buscar",
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="search-outline" size={size} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="ProfileTab"
      component={ProfileScreen}
      options={{
        title: "Perfil",
        tabBarLabel: "Perfil",
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="person-outline" size={size} color={color} />
        ),
      }}
    />
  </Tab.Navigator>
);

export default AppTabs;
