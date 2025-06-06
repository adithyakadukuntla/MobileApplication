import { Tabs, useRouter } from 'expo-router'
import {Ionicons} from "@expo/vector-icons"
import { COLORS } from '@/constants/theme';
import { TouchableOpacity,Alert,StyleSheet } from 'react-native';
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Entypo from '@expo/vector-icons/Entypo';
export default function TabLayout() {
  const router = useRouter()
  const signout = () => {
    AsyncStorage.removeItem('userToken');
    Alert.alert('Logged Out', 'You have been logged out successfully.');
    router.replace('/(auth)/login');
  }
  return (
    <Tabs
    screenOptions={{
        tabBarShowLabel:false,
        headerShown:true,
        tabBarInactiveTintColor: COLORS.GRAY,
        tabBarActiveTintColor: COLORS.CYAN,
        tabBarStyle:{
            backgroundColor:"black",
            borderTopWidth:0,
            position:"absolute",
            elevation:0,
            height:45,
            paddingBottom:8

        },
       
    }}
   >
     <Tabs.Screen name="index" 
        options={{
            tabBarIcon: ({ size, color }) => <Ionicons name="home" size={size} color={color}/>,
            //change the name of hte tab top name of tab
            headerTitle: "Home",

          }}
     />
      <Tabs.Screen name="Chats"  
          options={{
            tabBarIcon: ({ size, color }) => <Entypo name="chat" size={size} color={color}/>,
            
        }}

     />
     <Tabs.Screen name="Profile" 
          options={{
            tabBarIcon: ({ size, color }) => <Ionicons name="person-circle" size={size} color={color} />,
            headerRight: () => (
              <TouchableOpacity onPress={signout}>
                <MaterialIcons name="logout" size={26} color={COLORS.BLACK} style={styles.signout} />
              </TouchableOpacity>
            ),
          }}
     />
        
     </Tabs>
  );
}

const styles= StyleSheet.create({
  signout:{
    paddingRight:15
  }
})
