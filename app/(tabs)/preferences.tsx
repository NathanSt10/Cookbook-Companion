import { doc, getFirestore, updateDoc } from "@react-native-firebase/firestore";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { useAuth } from "../context/AuthContext";

const DIETARY_OPTIONS = ["Vegan", "Gluten-Free", "Dairy-Free", "Keto", "Paleo"];

const ALLERGY_OPTIONS = ["Nuts", "Eggs", "Dairy", "Soy"];

const CUISINE_OPTIONS = [
  "Italian",
  "Mexican",
  "Chinese",
  "Japanese",
  "Indian",
  "Thai",
];

const EQUIPMENT_OPTIONS = [
  "Air Fryer",
  "Instant Pot",
  "Microwave",
  "Oven",
  "Sous Vide",
  "Blender",
  "Food Processor",
];

export default function Onboarding() {
  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
  const { user } = useAuth();
  const db = getFirestore();

  const toggleSelection = (
    item: string,
    list: string[],
    setter: (val: string[]) => void
  ) => {
    if (list.includes(item)) {
      setter(list.filter((i) => i !== item));
    } else {
      setter([...list, item]);
    }
  };

  const handleComplete = async () => {
    if (!user) {
      Alert.alert("Error", "No user found");
      return;
    }

    try {
      await updateDoc(doc(db, "users", user.uid), {
        preferences: {
          dietary: selectedDietary,
          allergies: selectedAllergies,
          cuisines: selectedCuisines,
          equipment: selectedEquipment,
        },
      });
      router.replace("/");
    } catch (error) {
      Alert.alert("Error", "Failed to save preferences: " + error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Food Preferences</Text>

      <Text style={styles.sectionTitle}>Dietary Preferences</Text>
      {DIETARY_OPTIONS.map((pref) => (
        <TouchableOpacity
          key={pref}
          style={[
            styles.option,
            selectedDietary.includes(pref) && styles.optionSelected,
          ]}
          onPress={() =>
            toggleSelection(pref, selectedDietary, setSelectedDietary)
          }
        >
          <Text style={styles.optionText}>{pref}</Text>
        </TouchableOpacity>
      ))}

      <Text style={styles.sectionTitle}>Dietary Allergies</Text>
      {ALLERGY_OPTIONS.map((pref) => (
        <TouchableOpacity
          key={pref}
          style={[
            styles.option,
            selectedAllergies.includes(pref) && styles.optionSelected,
          ]}
          onPress={() =>
            toggleSelection(pref, selectedAllergies, setSelectedAllergies)
          }
        >
          <Text style={styles.optionText}>{pref}</Text>
        </TouchableOpacity>
      ))}

      <Text style={styles.sectionTitle}>Favorite Cuisines</Text>
      {CUISINE_OPTIONS.map((pref) => (
        <TouchableOpacity
          key={pref}
          style={[
            styles.option,
            selectedCuisines.includes(pref) && styles.optionSelected,
          ]}
          onPress={() =>
            toggleSelection(pref, selectedCuisines, setSelectedCuisines)
          }
        >
          <Text style={styles.optionText}>{pref}</Text>
        </TouchableOpacity>
      ))}

      <Text style={styles.sectionTitle}>Kitchenware</Text>
      {EQUIPMENT_OPTIONS.map((pref) => (
        <TouchableOpacity
          key={pref}
          style={[
            styles.option,
            selectedEquipment.includes(pref) && styles.optionSelected,
          ]}
          onPress={() =>
            toggleSelection(pref, selectedEquipment, setSelectedEquipment)
          }
        >
          <Text style={styles.optionText}>{pref}</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={styles.button} onPress={handleComplete}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 40,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  option: {
    padding: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 10,
  },
  optionSelected: {
    backgroundColor: "#e8f5e9",
    borderColor: "#4caf50",
  },
  optionText: {
    fontSize: 16,
  },
  button: {
    backgroundColor: "black",
    borderRadius: 8,
    padding: 16,
    marginTop: 30,
    marginBottom: 40,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
});
