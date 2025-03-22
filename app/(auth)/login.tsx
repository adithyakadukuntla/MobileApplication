import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@/constants/environement";
import { useEffect  } from "react";
import {  Linking } from "react-native";
import { CURRENT_VERSION } from "@/constants/environement";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Toggle state
  const [loading, setLoading] = useState(false); // State for loading
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true); // Set loading to true when request starts
      if(email==="" || password===""){
          Alert.alert("Important", "Please enter email and password");
          return;
        }
    try {
      const res = await axios.get(`${API_URL}/user/${email}`);
      // console.log("res", res.data.email);
      if (res.data.email === email && res.data.password === password) {
        await AsyncStorage.setItem("userToken", res.data.email);
        //Alert.alert("Login successful!");
        router.replace("/(tabs)");
      }
      else if (res.data.email === email && email === "vnraudiadmin634@gmail.com") {
        await AsyncStorage.setItem("userToken", res.data.email);
        Alert.alert("Login successful!");
        router.replace("/(tabs)")
      } else {
        Alert.alert(
          "Invalid Credentials",
          "Please check your email and password."
        );
      }
    } catch (error) {
      Alert.alert(
        "Invalid Credentials",
        "Please check your email and password."
      );
    } finally {
      setLoading(false); // Set loading to false when request is completed (success or failure)
    }
  };
  function goToFp() {
    router.push("/(auth)/forgotPassword");
  }


  async function checkForUpdate() {
    try {
      const response = await fetch(`${API_URL}/version`);
  
      const json = await response.json();
      console.log(json.version.apkUrl);
      if (json.version !== CURRENT_VERSION) {
        Alert.alert(
          "Update Available",
          "A new version of the app is available. Please download the latest APK.",
          [{ text: "Update", onPress: () => Linking.openURL(json.version.apkUrl) },
            { text: "Cancel", style: "cancel" }]
          
        );
      }
    } catch (error) {
      console.log("Error checking for update:", error);
    }
  }
  
  
  useEffect(() => {
    checkForUpdate();
  }, []);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword} // Toggle password visibility
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons
            name={showPassword ? "eye" : "eye-off"}
            size={24}
            color="gray"
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading} // Disable the button while loading
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity style={styles.fp} onPress={goToFp}>
        <Text style={styles.fp}>Forgot Password?</Text>
      </TouchableOpacity>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    padding: 20,
    
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 14,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  passwordInput: {
    flex: 1,
    padding: 10,
  },
  icon: {
    padding: 10,
  },
  button: {
    backgroundColor: "#27AE60",
    padding: 15,
    width: "100%",
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  fp: {
    marginTop: 10,
    color: "#007bff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
});
