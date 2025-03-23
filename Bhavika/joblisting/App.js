// import React, { useEffect, useState } from "react";
// import { View, Text, FlatList, ActivityIndicator, StyleSheet, TextInput, Button } from "react-native";

// const ADZUNA_APP_ID = "d2f4107b"; // Replace with your Adzuna App ID
// const ADZUNA_API_KEY = "1c68fbdf8a85e224c386fdb83318c0b5"; // Replace with your Adzuna API Key
// const BASE_URL = "https://api.adzuna.com/v1/api/jobs";

// const fetchJobs = async (searchTerm, location = "us") => {
//   try {
//     const response = await fetch(
//       `${BASE_URL}/${location}/search/1?app_id=${ADZUNA_APP_ID}&app_key=${ADZUNA_API_KEY}&results_per_page=10&what=${encodeURIComponent(searchTerm)}`
//     );
//     const data = await response.json();
//     return data.results || [];
//   } catch (error) {
//     console.error("Error fetching jobs:", error);
//     return [];
//   }
// };

// const JobList = ({ jobType }) => {
//   const [jobs, setJobs] = useState([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (jobType) {
//       setLoading(true);
//       const getJobs = async () => {
//         const jobResults = await fetchJobs(jobType);
//         setJobs(jobResults);
//         setLoading(false);
//       };
//       getJobs();
//     }
//   }, [jobType]);

//   return (
//     <View style={styles.container}>
//       {loading ? (
//         <ActivityIndicator size="large" color="#FFFFFF" />
//       ) : (
//         <FlatList
//           data={jobs}
//           keyExtractor={(item) => item.id.toString()}
//           renderItem={({ item }) => (
//             <View style={styles.jobItem}>
//               <Text style={styles.title}>{item.title}</Text>
//               <Text>{item.company?.display_name || "Unknown Company"}</Text>
//               <Text>{item.location?.display_name || "Location not available"}</Text>
//             </View>
//           )}
//         />
//       )}
//     </View>
//   );
// };

// export default function App() {
//   const [jobType, setJobType] = useState("");
//   const [searchQuery, setSearchQuery] = useState("");

//   return (
//     <View style={{ flex: 1, paddingTop: 50, padding: 20, backgroundColor: "#FFFFFF" }}>
//       <Text style={{ fontSize: 20, fontWeight: "bold", textAlign: "center", color: "#6A1B9A" }}>Job Listings</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="Enter job title..."
//         placeholderTextColor="#CCCCCC"
//         value={searchQuery}
//         onChangeText={setSearchQuery}
//       />
//       <Button title="Search" color="#6A1B9A" onPress={() => setJobType(searchQuery)} />
//       <JobList jobType={jobType} />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, marginTop: 10 },
//   jobItem: { padding: 10, borderBottomWidth: 1, borderColor: "#6A1B9A" },
//   title: { fontWeight: "bold", fontSize: 16, color: "#000000" },
//   input: {
//     height: 40,
//     borderColor: "#6A1B9A",
//     borderWidth: 1,
//     marginBottom: 10,
//     paddingHorizontal: 10,
//     borderRadius: 5,
//     color: "#000000",
//     backgroundColor: "#FFFFFF",
//   },
// });
import React, { useEffect, useState } from "react";
import { 
  View, Text, FlatList, ActivityIndicator, StyleSheet, TextInput, Button, TouchableOpacity, Linking 
} from "react-native";

const ADZUNA_APP_ID = "d2f4107b"; // Replace with your Adzuna App ID
const ADZUNA_API_KEY = "1c68fbdf8a85e224c386fdb83318c0b5"; // Replace with your Adzuna API Key
const BASE_URL = "https://api.adzuna.com/v1/api/jobs";

const fetchJobs = async (searchTerm, location = "in") => {
  try {
    const response = await fetch(
      `${BASE_URL}/${location}/search/1?app_id=${ADZUNA_APP_ID}&app_key=${ADZUNA_API_KEY}&results_per_page=10&what=${encodeURIComponent(searchTerm)}`
    );
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return [];
  }
};

const JobList = ({ jobType }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (jobType) {
      setLoading(true);
      const getJobs = async () => {
        const jobResults = await fetchJobs(jobType);
        setJobs(jobResults);
        setLoading(false);
      };
      getJobs();
    }
  }, [jobType]);

  // Function to open job application link
  const openJobLink = (url) => {
    if (url) {
      Linking.openURL(url).catch((err) => console.error("Error opening URL:", err));
    } else {
      alert("No application link available.");
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#6A1B9A" />
      ) : (
        <FlatList
          data={jobs}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => openJobLink(item.redirect_url)}>
              <View style={styles.jobItem}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.company}>{item.company?.display_name || "Unknown Company"}</Text>
                <Text>{item.location?.display_name || "Location not available"}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

export default function App() {
  const [jobType, setJobType] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <View style={{ flex: 1, paddingTop: 50, padding: 20, backgroundColor: "#FFFFFF" }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", textAlign: "center", color: "#6A1B9A" }}>Job Listings</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter job title..."
        placeholderTextColor="#CCCCCC"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <Button title="Search" color="#6A1B9A" onPress={() => setJobType(searchQuery)} />
      <JobList jobType={jobType} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, marginTop: 10 },
  jobItem: { padding: 10, borderBottomWidth: 1, borderColor: "#6A1B9A" },
  title: { fontWeight: "bold", fontSize: 16, color: "#6A1B9A" },
  company: { fontWeight: "600", color: "#6A1B9A" },
  input: {
    height: 40,
    borderColor: "#6A1B9A",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    color: "#000000",
    backgroundColor: "#FFFFFF",
  },
});
