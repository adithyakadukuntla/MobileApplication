import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState, useRef,useLayoutEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import io from "socket.io-client";
import axios from "axios";
import { API_URL } from "@/constants/environement"; // Ensure this is set in your constants
import { useRoute } from "@react-navigation/native";
import { Audio } from "expo-av";
import { COLORS } from "@/constants/theme";
import { useNavigation } from "expo-router";


const TeamChat = () => {
  const socketRef = useRef(null);
  const flatListRef = useRef(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const route = useRoute();
  const { senderEmail } = route.params;
  const navigation = useNavigation()

  
    useLayoutEffect(()=>{
        navigation.setOptions({
          headerShown:true,
          title: "Team Chat",
         
        })
    })

  useEffect(() => {
    socketRef.current = io(API_URL, { transports: ["websocket"] });
  
    socketRef.current.on("connect", () => {
      console.log("Connected to Socket.io");
    });
  
    // Fetch only team chat messages
    axios
      .get(`${API_URL}/messages/team`)
      .then((response) => setMessages(response.data))
      .catch((error) => console.error("Error fetching messages:", error));
  
    // Play sound and update state when a new team message arrives
    socketRef.current.on("team_message", async (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
      await playNotificationSound(); // Play notification sound
    });
  
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);
  

  const sendMessage = () => {
    if (message.trim()) {
      const msgData = {
        sender: senderEmail,
        receiver: "team",
        message,
        chatType: "team", // NEW FIELD
        time: new Date().toISOString(),
      };

      socketRef.current.emit("team_message", msgData);
      setMessage("");
    }
  };
  const playNotificationSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require("@/assets/notification.mp3") // Ensure this file is in assets
      );
      await sound.playAsync();
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  };
  

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item, index) => `${item.time}-${index}`}
        renderItem={({ item }) => (
          <View
            style={[
              styles.messageContainer,
              item.sender === senderEmail
                ? styles.sentMessage
                : styles.gotMessage,
            ]}
          >
            <Text style={{ fontSize: 14, fontWeight: "bold" }}>
              {item.sender.split("@")[0]}
            </Text>

            <Text style={styles.messageText}>{item.message}</Text>
            <Text style={styles.messageTime}>
  {new Date(item.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
</Text>

          </View>
        )}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: true })
        }
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={message}
          onChangeText={setMessage}
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <Ionicons name="send" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: "#fff" },
    
    messageContainer: {
      padding: 10,
      marginVertical: 5,
      borderRadius: 10,
      maxWidth: "75%",
      alignSelf: "flex-start",
    },
  
    sentMessage: { 
      alignSelf: "flex-end", 
      backgroundColor: "#a0e1eb", 
      borderTopRightRadius: 0 
    },
    
    gotMessage: { 
      alignSelf: "flex-start", 
      backgroundColor: "#ccc", 
      borderTopLeftRadius: 0 
    },
  
    messageText: { fontSize: 16, color: "#000" },
    messageTime: { fontSize: 10, color: "gray", alignSelf: "flex-end", marginTop: 3 },
  
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#eee",
      borderRadius: 6,
      paddingHorizontal: 10,
      marginBottom: 10,
    },
  
    input: { 
      flex: 1, 
      padding: 10, 
      fontSize: 16, 
    },
  
    sendButton: {
      backgroundColor: COLORS.DarkNavy,
      borderRadius: 5,
      padding: 10,
      justifyContent: "center",
      alignItems: "center",
      marginLeft: 5,
    },});

export default TeamChat;
