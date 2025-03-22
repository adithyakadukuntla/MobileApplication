import { useRoute, useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  ImageBackground,
} from "react-native";
import { Calendar } from "react-native-calendars";
import axios from "axios"; // Importing axios
import { Ionicons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useNavigation } from "@react-navigation/native";
import { Stack } from "expo-router";
import { useLayoutEffect } from "react";
import { COLORS } from "@/constants/theme";
import { API_URL } from "@/constants/environement";

export default function BookNow() {
  const route = useRoute();
  const { audiname, desc }: any = route.params;
  const router = useRouter();
  const navigation = useNavigation();
  const [markedDates, setMarkedDates] = useState({});
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCalendar, setShowCalendar] = useState(false);
  const [token, setToken] = useState("");

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitleStyle: {
        color: COLORS.BLACK,
      },
      headerStyle: {
        backgroundColor: COLORS.BACKGROUND, // Background for the header
      },
      headerTintColor: COLORS.BLACK,
      title: `${audiname}`, // Setting title dynamically
    });
  }, [navigation, audiname]);
  // Fetch event details from backend
  useEffect(() => {
    //fetchEvents();
    fetchToken(); 
  }, [token]);

  useFocusEffect(
    React.useCallback(() => {
      fetchEvents();
    }, [])
  );
  async function fetchToken() {
    try {
      const token = await AsyncStorage.getItem("userToken");
      //console.log("token",token);
      setToken(token as string);
    } catch (err) {
      console.log("Token not found", err);
      router.push("/(auth)/login");
    }
  }

  // getting the events from backend
  const fetchEvents = async () => {
    try {
      // Using axios to make the GET request
      const response = await axios.get(`${API_URL}/events/${audiname}`);
      const data = response.data;
      processEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const processEvents = (eventData: any) => {
    let updatedMarkedDates: any = {};
    eventData.forEach((event: any) => {
      let date = event.startDate; // Mark the start date
      let endDate = event.endDate; // Mark the end date (For events that span multiple days)

      // Iterate through all dates from startDate to endDate and mark them
      let currentDate = new Date(date);
      let endDateObj = new Date(endDate);

      while (currentDate <= endDateObj) {
        const dateString = currentDate.toISOString().split("T")[0]; // Format as yyyy-mm-dd

        updatedMarkedDates[dateString] = {
          marked: true,
          dotColor:
            event.session === "Full Day"
              ? "red"
              : event.session === "Morning"
              ? "orange"
              : event.session === "Afternoon"
              ? "blue"
              : "green",
          selectedColor: event.isBooked ? "gray" : "green",
          selected: event.isBooked || event.session === "Full Day",
        };

        // Increment the currentDate to the next day
        currentDate.setDate(currentDate.getDate() + 1);
      }
    });

    setMarkedDates(updatedMarkedDates);
    setEvents(eventData);
  };

  const handleDateSelect = (day: any) => {
    const selectedDate = day.dateString;
    const today = new Date().toISOString().split("T")[0]; // Get today's date in yyyy-mm-dd format

    // Check if the selected date is in the past
    if (new Date(selectedDate) < new Date(today)) {
      Alert.alert(
        "Invalid Date",
        "You cannot select a past or completed date. Please choose a valid date.",
        [{ text: "OK" }]
      );
      return; // Don't proceed further if the date is invalid
    }

    // Find the event that corresponds to the selected date range
    const selectedEvent = events.find((event) => {
      const eventStartDate = new Date(event.startDate);
      const eventEndDate = new Date(event.endDate);
      const selectedDateObj = new Date(selectedDate);

      // Check if the selected date falls within the event's start and end date range
      return (
        selectedDateObj >= eventStartDate && selectedDateObj <= eventEndDate
      );
    });

    //console.log(selectedEvent);

    if (selectedEvent) {
      if (selectedEvent.isBooked && selectedEvent.session === "Full Day") {
        Alert.alert(
          "Booking Unavailable",
          `The event from ${selectedEvent.startDate} to ${selectedEvent.endDate} is already booked for the ${selectedEvent.session} session.`,
          [{ text: "OK" }]
        );
      } else if (selectedEvent.session === "Full Day") {
        Alert.alert(
          "Full Day Unavailable",
          "Sorry, there is no free time on that date.",
          [{ text: "OK" }]
        );
      } else if (
        selectedEvent.session === "Morning" ||
        selectedEvent.session === "Afternoon"
      ) {
        Alert.alert(
          "Book Now",
          `The ${selectedEvent.session} session is not available. Would you like to book it for another session?`,
          [
            {
              text: "Cancel",
              style: "cancel",
            },
            {
              text: "OK",
              onPress: () => {
                const newSession =
                  selectedEvent.session === "Morning" ? "Afternoon" : "Morning";
                router.push({
                  pathname: "/(stack)/Bookings",
                  params: {
                    date: selectedDate,
                    audiname: selectedEvent.audi,
                    sessionsend: newSession,
                  },
                });
              },
            },
          ]
        );
      }
    } else {
      Alert.alert(
        "No Event",
        "There are no events on this date. Would you like to book a new event?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "OK",
            onPress: () =>
              router.push({
                pathname: "/(stack)/Bookings",
                params: { date: selectedDate, audiname: audiname },
              }),
          },
        ]
      );
    }
  };

  // counting the days of the event
  function getDaysCount(startDate: string, endDate: string): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return (end.getTime() - start.getTime()) / (1000 * 3600 * 24); // Return the number of days
  }

  // delete the event
  const deleteEvent = async (id: number) => {
    Alert.alert("Surely want to delete event", `Can't be Restored`, [
      {
        text: "No",
        style: "cancel",
      },
      {
        text: "Yes",
        onPress: async () => {
          try {
            await axios.delete(`${API_URL}/events/${id}`);
            Alert.alert(
              "Event Deleted",
              "The event has been deleted successfully."
            );
            fetchEvents();
          } catch (error) {
            console.log("Error deleting event:", error);
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Book Now</Text>

      {/* Toggle Calendar Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => setShowCalendar(!showCalendar)}
      >
        <Text style={styles.buttonText}>
          {showCalendar ? "Close Calendar  " : "Open Calendar  "}
          <Ionicons name="calendar-number-outline" size={18} />
        </Text>
      </TouchableOpacity>

      {/* Calendar (Visible when showCalendar is true) */}
      {showCalendar && (
        <Calendar
          onDayPress={handleDateSelect}
          markedDates={markedDates}
          theme={{
            selectedDayBackgroundColor: "green",
            selectedDayTextColor: "white",
            todayTextColor: "#00adf5",
            arrowColor: "black",
            monthTextColor: "black",
            indicatorColor: "blue",
            dotColor: "red",
          }}
          style={styles.calendar}
        />
      )}

      {/* Upcoming Events List */}
      <Text style={styles.subTitle}>Upcoming Events</Text>

      {events.length === 0 && <Text>There are No events</Text>}
      {loading ? (
        <ActivityIndicator size="large" color="blue" />
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => item._id.toString()}
          renderItem={({ item }) => (
            <View style={styles.eventItem}>
              <Text style={styles.eventTitle}>
                {item.eventName} ({getDaysCount(item.startDate, item.endDate)}{" "}
                Day(s) Event)
              </Text>
              <Text>
                Date: {item.startDate} to : {item.endDate}
              </Text>
              <Text>Time: {item.session}</Text>
              <Text>Auditorium: {item.audi}</Text>
              <Text>Booked By: {item.bookedBy || "Not available"}</Text>
              <Text>Contact : {item.contact}</Text>
              <Text style={styles.text}>More Info: {item.additionalInfo}</Text>
              <TouchableOpacity
                style={styles.topacity}
                onPress={() => deleteEvent(item._id)}
              >
                {item.useremail === token && (
                  <AntDesign name="delete" size={24} color="black" />
                )}
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    fontFamily: "Times New Roman",
    textAlign: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  calendar: {
    marginBottom: 10,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  eventItem: {
    padding: 10,
    borderRadius: 15,
    marginVertical: 5,
    backgroundColor: "rgba(144, 238, 144, 0.5)",
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  text: {
    fontSize: 16,
  },
  topacity: {
    //make the inner items to end of that container
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
});
