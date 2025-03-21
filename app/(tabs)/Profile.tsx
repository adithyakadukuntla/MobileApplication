import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { COLORS } from "@/constants/theme";
import axios from "axios";
import { API_URL } from "@/constants/environement";


export default function Profile() {
  const [user, setUser] = useState<any>([]);
  const [email, setEmail] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Toggle state
  const [newUserStatus, setNewUserStatus] = useState(false);
  const [newUserPassword, setNewUserPassword] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("")

  useEffect(() => {
    loadUserDetails();
  }, []);

  async function loadUserDetails() {
    try {
      const email = await AsyncStorage.getItem("userToken");
      if (email === "vnraudiadmin634@gmail.com") {
        setEmail(email || "");
      }
      //console.log(email);
      const storedUser = await axios.get(`${API_URL}/user/${email}`);
      //console.log("storedUser", storedUser.data);
      if (storedUser.data) {
        setUser(storedUser.data);
      }
    } catch (error) {
      console.error("Failed to load user details:", error);
    }
  }

  async function saveUserDetails() {
    try {
      let res = await axios.put(`${API_URL}/user/${user.email}`, user);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save user details:", error);
    }
  }

  async function createUser(){
    if(newUserPassword==="" || newUserEmail===""){
      Alert.alert("Important", "Please enter email and password");
      return;
    }
    const newUser = {
      email:newUserEmail,
      password:newUserPassword
    }
    console.log("New User",newUser)

    const res = await axios.post(`${API_URL}/users`,newUser );
    if(res.data.message==="User already exists"){
      Alert.alert("Important", "User already exists with this email. Use another");
      setNewUserEmail("")
      setNewUserPassword("")
    }
    if(res.data.message==="User created successfully"){
      Alert.alert("Important", "User created successfully.");
      setNewUserStatus(false)
      setNewUserEmail("")
      setNewUserPassword("")
      //router.replace("/(tabs)");
    }
   
  }

  async function signout() {
    await AsyncStorage.removeItem("userToken");
    router.replace("/(auth)/login");
  }

  return (
    // <View style={styles.container}>
    <ScrollView contentContainerStyle={styles.scrollContent}>
      {/* Profile Image */}
      <Image
        source={require("../../assets/images/uifaces-handdrawn-image (1).jpg")}
        style={styles.profileImage}
      />

      {/* User Details */}
      <View style={styles.detailsContainer}>
        {isEditing ? (
          <>
            <View style={styles.touchview}>
              <TouchableOpacity
                style={styles.touchopacity}
                onPress={() => setIsEditing(false)}
              >
                <AntDesign name="closecircle" size={20} />
              </TouchableOpacity>
            </View>
            <Text style={styles.label}>Name:</Text>
            <TextInput
              style={styles.input}
              value={user.name}
              onChangeText={(text) => setUser({ ...user, name: text })}
            />

            <Text style={styles.label}>Email:</Text>
            <TextInput
              style={styles.input}
              value={user.email}
              onChangeText={(text) => setUser({ ...user, email: text })}
            />

            <Text style={styles.label}>Phone:</Text>
            <TextInput
              style={styles.input}
              value={user.phone}
              keyboardType="phone-pad"
              onChangeText={(text) => setUser({ ...user, phone: text })}
            />
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Password"
                value={user.password}
                onChangeText={(text) => setUser({ ...user, password: text })}
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
              style={styles.saveButton}
              onPress={saveUserDetails}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.infoText}>Name: {user.name || "John Doe"}</Text>
            <Text style={styles.infoText}>
              Email: {user.email || "johndoe@example.com"}
            </Text>
            <Text style={styles.infoText}>
              Phone: {user.phone || "123-456-7890"}
            </Text>

            <View style={styles.touchview}>
              <TouchableOpacity
                style={styles.touchopacity}
                onPress={() => setIsEditing(true)}
              >
                <MaterialIcons name="edit" size={22} color="black" />
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
      {/* Extra Add new user Modal */}
      {newUserStatus && (
        <View style={{paddingTop:20}}>
          <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Email"
            value={newUserEmail}
            onChangeText={setNewUserEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          </View>
          <View style={styles.passwordContainer}>
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="Password"
                    value={newUserPassword}
                    onChangeText={setNewUserPassword}
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
                  style={styles.saveButton}
                  onPress={()=>createUser()}
                >
                  <Text style={styles.saveButtonText}>Save User</Text>
                </TouchableOpacity>
        </View>
      )}

      {/* Extra Add new user Button at Bottom */}
      {email && (
        <View style={{ paddingTop: 10 }}>
          <TouchableOpacity
            style={styles.addnewuser}
            onPress={() => setNewUserStatus(!newUserStatus)}
          >
            <Text style={{ fontSize: 20 }}>Add users</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Extra Signout Button at Bottom */}
      {/* <TouchableOpacity style={styles.bottomSignout} onPress={signout}>
        <AntDesign name="logout" size={20} color="white" />
        <Text style={styles.signoutText}>Sign Out</Text>
      </TouchableOpacity> */}
    </ScrollView>
    // </View>
  );
}




// Header signout button (to be used in tabs)

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 30,
  },
  scrollContent: {
    alignItems: "center",
    padding: 30,
    paddingBottom:100,
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
    borderColor: "black",
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
    borderColor:"black"
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
    marginTop: 35,
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
  addnewuser: {
    backgroundColor: COLORS.PeachBlush,
    padding: 9,
    borderRadius: 9,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
  },
});
