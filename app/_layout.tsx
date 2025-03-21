import { Stack } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "@/constants/theme";
export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
        <Stack
          screenOptions={{
            headerShown: false, // Ensure header is shown
            headerStyle: { backgroundColor: "gray" },
            headerTintColor: "white", // Customize header text color
            headerBackTitle: COLORS.CYAN, // Customize back button title
          }}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
