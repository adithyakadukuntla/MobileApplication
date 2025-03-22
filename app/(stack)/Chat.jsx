import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import io from "socket.io-client";
import { useRoute } from "@react-navigation/native";
import { API_URL } from "@/constants/environement";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { COLORS } from "@/constants/theme";
import { Audio } from "expo-av";
const SocketScreen = () => {
  const socketRef = useRef(null);
  const flatListRef = useRef(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const route = useRoute();
  const { senderEmail, ReceiverEmail } = route.params;
  const navigation = useNavigation();

  useLayoutEffect(()=>{
      navigation.setOptions({
        headerShown:true,
        title: ReceiverEmail.split("@")[0],
       
      })
  })

  useEffect(() => {
    if (!ReceiverEmail) return;

    // Connect to Socket.io
    socketRef.current = io(API_URL, { transports: ["websocket"] });

    // Fetch previous messages from DB
    fetch(`${API_URL}/messages/${senderEmail}/${ReceiverEmail}`)
      .then(res => res.json())
      .then(data => setMessages(data));

    // Listen for real-time messages
    socketRef.current.on(`message_${senderEmail}`, async (newMessage) => {
      setMessages(prev => [...prev, newMessage]);

      // Play notification sound only for the receiver
      if (newMessage.sender !== senderEmail) {
        await playNotificationSound();
      }

      // Scroll to the latest message
      flatListRef.current?.scrollToEnd({ animated: true });
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [ReceiverEmail]);

  const sendMessage = () => {
    if (!message.trim()) return;

    const newMessage = { sender: senderEmail, receiver: ReceiverEmail, message };
    
    // Emit message
    socketRef.current.emit("message", newMessage);

    // Update UI immediately for smooth experience
    setMessages(prev => [...prev, { ...newMessage, time: new Date() }]);

    setMessage("");
  };

  const playNotificationSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require("@/assets/notification.mp3") // Ensure this file is present
      );
      await sound.playAsync();
    } catch (error) {
      console.error("Error playing sound", error);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={[styles.messageContainer, item.sender === senderEmail ? styles.sent : styles.received]}>
            <Text style={styles.messageText}>{item.message}</Text>
            <Text style={styles.messageTime}>{new Date(item.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</Text>
          </View>
        )}
        onContentSizeChange={() => {
          setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
          }, 100);
        }}
        keyboardShouldPersistTaps="handled"
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

  sent: { 
    alignSelf: "flex-end", 
    backgroundColor: "#a0e1eb", 
    borderTopRightRadius: 0 
  },
  
  received: { 
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
  },
});

export default SocketScreen;
