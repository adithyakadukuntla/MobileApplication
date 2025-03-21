import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/theme";
import axios from "axios";
import { useRouter } from "expo-router";
import { API_URL } from "@/constants/environement";



export default function forgotPassword() {
  const [email, setEmail] = useState("");
  const [passIntput, setPassInput] = useState<any>(false);
  const [showPassword, setShowPassword] = useState(false); // Toggle state
  const [password, setPassword] = useState("");

  const router = useRouter();

  async function checkMail() {
    try {
      let res = await axios.get(`${API_URL}/user/${email}`);
      console.log("res", res.data);
      if (res.data !== null) {
        setPassInput(true);
      } else {
        Alert.alert("Incorrect Email", "Please enter a valid email address");
      }
    } catch (error) {
      console.error("Failed to check user Email:", error);
    }
  }

  async function changePassword() {
    const user = {
      email: email,
      password: password,
    };
    try {
      let res = await axios.put(`${API_URL}/userpassword/${email}`, user);
      console.log("res", res.data);
      Alert.alert(
        "Password Changed",
        "Your password has been changed successfully. Please Login"
      );
      router.back();
    } catch (error) {
      console.error("Failed to change Password:", error);
    }
  }
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Email:</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {passIntput === true && (
        <>
          <Text style={styles.label}>Password</Text>
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
        </>
      )}

      {passIntput === false && (
        <TouchableOpacity style={styles.saveButton} onPress={checkMail}>
          <Text style={styles.saveButtonText}>Change Password</Text>
        </TouchableOpacity>
      )}
      {passIntput === true && (
        <TouchableOpacity style={styles.saveButton} onPress={changePassword}>
          <Text style={styles.saveButtonText}>Save Password</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    // alignItems:"center",
    backgroundColor: COLORS.surface,
    padding: 20,
  },
  scrollContent: {
    alignItems: "center",
    paddingBottom: 50,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  detailsContainer: {
    width: "100%",
    backgroundColor: COLORS.LightCream,
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    marginTop: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 0,
  },
  input: {
    width: "100%",
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 10,
  },
  editButton: {
    backgroundColor: COLORS.PlumWine,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
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
  editButtonText: {
    color: "white",
    fontSize: 16,
    marginRight: 5,
  },
  saveButton: {
    backgroundColor: COLORS.BLACK,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
  },
  bottomSignout: {
    flexDirection: "row",
    backgroundColor: COLORS.ShadowBlack,
    padding: 10,
    borderRadius: 50,
    alignItems: "center",
    marginTop: 250,
  },
  signoutText: {
    color: "white",
    fontSize: 16,
    marginLeft: 10,
  },
  icon: {
    padding: 10,
  },
  touchopacity: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "flex-end",
    padding: 6,
    backgroundColor: COLORS.WHITE,
    borderRadius: 50,
  },
  touchview: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
});
