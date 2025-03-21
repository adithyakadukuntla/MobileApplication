import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, ScrollView } from "react-native";
import { LinearGradient } from 'expo-linear-gradient'; // You'll need to install this package
import { useRouter } from "expo-router";

export default function HomeScreen() {

  const Audis = [
    {
      audiname: "Ks Audi",
      desc: "There is Place For 350 to 400 students.",
    },
    {
      audiname: "APJ Abdul Kalam",
      desc: "Upto 130 members",
    },
    {
      audiname: "B Block Seminar Hall",
      desc: "Upto 130 members",
    },
    {
      audiname: "New Block (AI&ML) Hall",
      desc: "Upto 180 members",
    },
    {
      audiname: "New Block Fourth floor Block",
      desc: "Upto 130 members",
    }
  ];

 const router = useRouter()

  const handleBookNow = (audi:any) => {
    router.push({
      pathname: '/(stack)/booknow',
      params: { audiname: audi.audiname, desc: audi.desc }
    });

  };

  return (
    <ScrollView >
          <View style={styles.container}>
      {Audis.map((audi, index) => (
        <View key={index} style={styles.card}>
          <ImageBackground
            source={require('../../assets/images/leaf_bg.jpg')} // Add your own image path
            style={styles.cardBackground}
          >
            <LinearGradient
              colors={['rgba(0, 0, 0, 0.3)', 'rgba(0, 0, 0, 0.7)']}
              style={styles.gradient}
            >
              <Text style={styles.cardTitle}>{audi.audiname}</Text>
              <Text style={styles.cardContent}>{audi.desc}</Text>

              <TouchableOpacity style={styles.bookContainer} onPress={()=>handleBookNow(audi)}>
                <Text style={styles.bookNow}>Book Now</Text>
              </TouchableOpacity>
            </LinearGradient>
          </ImageBackground>
        </View>
      ))}
    </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center", // Vertically center the card
    alignItems: "center", // Horizontally center the card
    backgroundColor: "#f8f9fa", // Optional background color
    paddingTop: 10,
    paddingBottom: 60,
  },
  card: {
    width: "80%",
    margin: 10,
    borderRadius: 10,
    overflow: 'hidden', // To make sure image and gradient don't overflow
    elevation: 3, // For Android shadow effect
    shadowColor: "#000", // iOS shadow
    shadowOffset: { width: 0, height: 2 }, // iOS shadow
    shadowOpacity: 0.8, // iOS shadow
    shadowRadius: 4, // iOS shadow
    height: 200,
  },
  cardBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradient: {
    flex: 1,
    justifyContent: "flex-end", // Position content towards the bottom
    alignItems: "center",
    paddingBottom: 20,
    width: '100%',
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  cardContent: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 20,
  },
  bookContainer: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  bookNow: {
    color: "red",
    fontSize: 18,
    fontWeight: "bold",
  },
});
