import React, { useEffect, useState } from "react";
import { View, Text, TextInput, StyleSheet, Button,Alert } from "react-native";
import { Picker } from '@react-native-picker/picker';
import { useRoute } from "@react-navigation/native";
import axios from "axios"; // Axios for making requests
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@/constants/environement";


export default function Booking() {
  const route = useRoute();
  const router = useRouter()
  const { audiname,date,sessionsend }: any = route.params;

  const [eventName, setEventName] = useState("");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [session, setSession] = useState(sessionsend || "Morning"); // Default session is Morning
  const [startDate, setStartDate] = useState("");  // Start date
  const [endDate, setEndDate] = useState("");      // End date
  const [token, setToken] = useState('')


useEffect(()=>{
  async function fetchToken(){
  try{
    const token = await AsyncStorage.getItem('userToken');
    //console.log("token",token);
     setToken(token as string);
 }catch(err){
   console.log('Token not found', err);
   router.push('/(auth)/login')
 }
}
 fetchToken()
 },[token])




 const handleSubmit = async () => {
   
  if (!token) {
    Alert.alert("Error", "User email is missing. Please log in again.");
    return;
  }
  const usermail =token;
 

  const bookingData = {
    eventName,
    startDate: date,
    useremail: usermail, 
    endDate,
    session,
    isBooked: true,
    bookedBy: name,
    audi: audiname,
    contact,
    additionalInfo,
  };

  try {
    const response = await axios.post(`${API_URL}/book`, bookingData);

    if (response.data.message === 'Booking successful!') {
      alert("Booking Successful!");
      router.back();
    } else {
      alert("Booking failed. Please try again.");
    }
  } catch (error) {
    //console.error("Error submitting booking:", error);
    Alert.alert("Important", "All fields are required.");
  }
};


  return (
    <View style={styles.container}>
      <Text style={styles.title}>New Booking</Text>

      <Text>Auditorium: {audiname}</Text>
       <Text>Start Date : {date}</Text> 
       <Text> User : {token}</Text>
      <TextInput
        style={styles.input}
        placeholder="Event Name"
        value={eventName}
        onChangeText={setEventName}
      />

      <TextInput
        style={styles.input}
        placeholder="Club Name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Your Contact Number"
        value={contact}
        onChangeText={setContact}
      />

      <TextInput
        style={styles.input}
        placeholder="Additional Information"
        value={additionalInfo}
        onChangeText={setAdditionalInfo}
      /> {/* Start Date */}
      {/* <TextInput
        style={styles.input}
        placeholder="Start Date (YYYY-MM-DD)"
        value={startDate}
        onChangeText={setStartDate}
      /> */}

      {/* End Date */}
      <TextInput
        style={styles.input}
        placeholder="End Date (YYYY-MM-DD)"
        value={endDate}
        onChangeText={setEndDate}
      />

      {/* Session Picker */}
      {sessionsend ? (
      // If sessionsend is provided, only show the selected session
      <Text style={styles.some} >Selected Session: {sessionsend}</Text>
    ) : (
      // If sessionsend is not provided, show the picker
      <>
        <Text>Select Session:</Text>
        <Picker
          selectedValue={session}
          onValueChange={(itemValue) => setSession(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Morning" value="Morning" />
          <Picker.Item label="Afternoon" value="Afternoon" />
          <Picker.Item label="Full Day" value="Full Day" />
        </Picker>
      </>
    )}

     

      <Button title="Submit Booking" onPress={handleSubmit} />
    </View>
  );
}

// Styles for NewBooking
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  picker: {
    height: 50,
    width: '100%',
    borderWidth: 1,
    borderColor: "#ccc",
    marginVertical: 10,
  },
  some:{
    paddingBottom:10,
  }
});
