import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "@/constants/environement";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Missing import

const AccountChats = () => {
  const [users, setUsers] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState("");
  
  const router = useRouter();

  useEffect(() => {
    async function getLoggedInUser() {
      const name = await AsyncStorage.getItem("userToken");
      if (name) {
        console.log("name",name)
        setLoggedInUser(name);
      }
    }
    getLoggedInUser();
  }, []);

  useEffect(() => {
    async function getUsers() {
      try {
        const response = await axios.get(`${API_URL}/users`);
        setUsers(response.data);
      } catch (error) {
        console.log(error);
      }
    }
    getUsers();
  }, []);

  const handleChatArea = (user) => {
    if (user === "team") {
      router.push({
        pathname: "/(stack)/TeamChat",
        params: { senderEmail: loggedInUser, ReceiverEmail: "team", Status: true, chatType: "team" },
      });
    } else {
      router.push({
        pathname: "/(stack)/Chat",
        params: { ReceiverEmail: user.email, senderEmail: loggedInUser, Status: false, chatType: "private" },
      });
    }
  };
  

  return (
    <View style={styles.container}>
      <TouchableOpacity
            style={styles.chat}
            onPress={() => handleChatArea("team")}
          >
            <Image
              source={require("../../assets/images/uifaces-handdrawn-image (1).jpg")}
              style={styles.profileImage}
            />
            <View>
              <Text style={styles.userName}>Team Chat</Text>
            </View>
          </TouchableOpacity>
      {users
        .filter((user) => user.email !== loggedInUser) // Exclude the logged-in user
        .map((user) => (
          <TouchableOpacity
            key={user._id}
            style={styles.chat}
            onPress={() => handleChatArea(user)}
          >
            <Image
              source={require("../../assets/images/uifaces-handdrawn-image (1).jpg")}
              style={styles.profileImage}
            />
            <View>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={{padding:2,color:"blue"}} >{user.email}</Text>
            </View>
          </TouchableOpacity>
        ))}
    </View>
  );
};

export default AccountChats;

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  chat: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderWidth: 0.5,
    borderColor: "#ccc",
    marginBottom: 5,
    borderRadius: 5,
    backgroundColor: "#f9f9f9",
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
});
