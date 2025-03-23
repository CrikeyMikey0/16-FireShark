import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, TextInput, Alert, FlatList } from "react-native";
import * as Location from "expo-location";
import * as Linking from "expo-linking";

const SOSButton = () => {
  const [emails, setEmails] = useState(["", ""]); // At least 2 emails required
  const [location, setLocation] = useState(null);
  const [locationUrl, setLocationUrl] = useState("");

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Location access is required to send your location.");
        return;
      }
    })();
  }, []);

  const handleSOS = async () => {
    const helplineNumber = "tel:1091"; // Women's helpline number

    try {
      let loc = await Location.getCurrentPositionAsync({});
      if (!loc) {
        Alert.alert("Error", "Could not retrieve location.");
        return;
      }

      const locationLink = `https://www.google.com/maps?q=${loc.coords.latitude},${loc.coords.longitude}`;
      setLocation(loc);
      setLocationUrl(locationLink);

      await Linking.openURL(helplineNumber);
    } catch (error) {
      console.error("SOS Error:", error);
      Alert.alert("Error", "Something went wrong.");
    }
  };

  const handleEmail = () => {
    const validEmails = emails.filter(email => email.trim() !== "");

    if (validEmails.length < 2) {
      Alert.alert("Error", "Please enter at least two email addresses.");
      return;
    }

    if (!locationUrl) {
      Alert.alert("Error", "Location not available. Press SOS first to fetch location.");
      return;
    }

    const subject = "Emergency Alert!";
    const body = `I need help! Here is my location: ${locationUrl}`;
    const emailAddresses = validEmails.join(",");

    const mailtoLink = `mailto:${emailAddresses}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    Linking.openURL(mailtoLink).catch((err) => {
      console.error("Email Error:", err);
      Alert.alert("Error", "Could not open email app.");
    });
  };

  const updateEmail = (text, index) => {
    let updatedEmails = [...emails];
    updatedEmails[index] = text;
    setEmails(updatedEmails);
  };

  const addEmailField = () => {
    setEmails([...emails, ""]);
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff", padding: 20 }}>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>Enter at least 2 email addresses:</Text>

      <FlatList
        data={emails}
        renderItem={({ item, index }) => (
          <TextInput
            style={{
              width: 250,
              height: 40,
              borderColor: "gray",
              borderWidth: 1,
              marginBottom: 10,
              paddingLeft: 10,
              borderRadius: 5,
            }}
            placeholder={`Email ${index + 1}`}
            keyboardType="email-address"
            value={item}
            onChangeText={(text) => updateEmail(text, index)}
          />
        )}
        keyExtractor={(item, index) => index.toString()}
      />

      <TouchableOpacity onPress={addEmailField} style={{ marginBottom: 20 }}>
        <Text style={{ color: "blue" }}>+ Add Another Email</Text>
      </TouchableOpacity>

      {/* SOS Button */}
      <TouchableOpacity
  onPress={handleSOS}
  style={{
    backgroundColor: "red",
    width: 60, // Smaller size
    height: 60,
    borderRadius: 30, // Keep it circular
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
    marginBottom: 20,
    alignSelf: "flex-end", // Move to the left
    marginLeft: 20, // Add some left margin for spacing
  }}
>
  <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>SOS</Text>
</TouchableOpacity>


      {/* Email Button */}
      <TouchableOpacity
        onPress={handleEmail}
        style={{
          backgroundColor: "blue",
          width: 100,
          height: 50,
          borderRadius: 10,
          justifyContent: "center",
          alignItems: "center",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 3,
          elevation: 5,
        }}
      >
        <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>Send Email</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SOSButton;
