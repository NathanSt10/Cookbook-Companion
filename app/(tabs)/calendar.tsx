import firestore from "@react-native-firebase/firestore";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  View
} from "react-native";
import CalendarViewToggle from "../../components/calendar/CalendarViewToggle";
import MonthView from "../../components/calendar/MonthView";
import WeekView from "../../components/calendar/WeekView";
import { useAuth } from "../context/AuthContext";

type CalendarView = "month" | "week";
  
type PlannedRecipe = {
  fireId: string;
  recipeId: string;
  title: string;
  image: string;
  date: string;
};

type PlannedRecipes = Record<string, PlannedRecipe[]>;

export default function CalendarPage() {
  const { user } = useAuth();
  const [calendarView, setCalendarView] = useState<CalendarView>("month");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [plannedRecipes, setPlannedRecipes] = useState<PlannedRecipes>({});
  const [loading, setLoading] = useState(false); 

  useEffect(() => {
    if (user) {
      queryPlannedRecipes();
    }
  }, [user]);

  const queryPlannedRecipes = async () => {
    if (!user) {
      Alert.alert("Error", "No user is logged in.");
      return;
    }

    setLoading(true);   
    try {
      const querySnapshot = await firestore()
        .collection("Users")
        .doc(user.uid)
        .collection("planned_meals")
        .get();

      const recipes: PlannedRecipes = {}; 

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const date = data.date;  

        if (!recipes[date]) {
          recipes[date] = [];
        }

        recipes[date].push({
          fireId: doc.id,
          recipeId: data.recipeId,
          title: data.recipeTitle,
          image: data.recipeImage,
          date: date,
        });
      });

      setPlannedRecipes(recipes); 
    }
    catch (error) {
      Alert.alert("Error", "Unable to get recipe.");
      console.error("Error getting planned recipes: ", error); 
    }
    finally {
      setLoading(false);  
    }
  };

  const addRecipeToDate = async (recipeData : PlannedRecipe) => {
    if (!user) { 
      Alert.alert("Error", "No user is logged in.");
      return;
    }

    try {
      const plannedMealsDoc = await firestore()
        .collection("Users")
        .doc(user.uid)
        .collection("planned_meals")
        .add({
          date: recipeData.date,
          recipeId: recipeData.recipeId, 
          recipeTitle: recipeData.title,
          recipeImage: recipeData.image,
        });
      
      setPlannedRecipes((prev) => {
        const refreshRecipes = { ...prev };
        if (!refreshRecipes[recipeData.date]) {
          refreshRecipes[recipeData.date] = [];
        }
        refreshRecipes[recipeData.date].push({
          fireId: plannedMealsDoc.id,
          recipeId: recipeData.recipeId,
          title: recipeData.title,
          image: recipeData.image,
          date: recipeData.date,
        });

        return refreshRecipes;
      });

      console.log("Recipe was added to calendar");
    }
    catch (error) {
      Alert.alert("Error", "Failed adding recipe to calendar");
      console.error("Couldn't add recipe to calendar: ", error);
    }
  };

  const removeRecipeFromDate = async (recipeId: string, date: string) => {
    if (!user) {
      Alert.alert("Error", "No user is logged in.");
      return;
    }

    try {
      await firestore()
        .collection("Users")
        .doc(user.uid)
        .collection("planned_meals")
        .doc(recipeId)
        .delete();

        setPlannedRecipes((prev) => {
          const refreshRecipes = { ...prev }; 

          if (refreshRecipes[date]) {
            refreshRecipes[date] = refreshRecipes[date].filter(
              (recipe) => recipe.fireId !== recipeId              
            );

            if (refreshRecipes[date].length === 0) {
              delete refreshRecipes[date];
            }
          }

          return refreshRecipes;
        });

        console.log("Successfully deleted recipe from calendar");
    }
    catch (error) {
      Alert.alert("Error", "Failed to remove recipe");
      console.error("Failed to remove recipe", error);
    }
  };

  const getMarkedDates = () => {
    const marked: any = {
      [selectedDate]: { selected: true, selectedColor: "black" },
    };

    Object.keys(plannedRecipes).forEach((date) => {
      if (plannedRecipes[date].length > 0) {
        marked[date] = {
          ...marked[date],
          marked: true,
          dotColor: "blue",
        };
      }
    });

    return marked;
  };

  const getWeekDates = (date: string) => {
    const currentDate = new Date(date);
    const dayOfWeek = currentDate.getDay();
    const startOfWeek = new Date(currentDate);
    
    startOfWeek.setDate(currentDate.getDate() - dayOfWeek);

    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const weekDate = new Date(startOfWeek);
      weekDate.setDate(startOfWeek.getDate() + i);
      weekDates.push(weekDate.toISOString().split("T")[0]);
    }

    return weekDates;
  };

  const getRecipesForDate = (date: string) => {
    return plannedRecipes[date] || [];
  };
    
  if (loading && Object.keys(plannedRecipes).length === 0) {
    return (
      <View style={ styles.loadingContainer }>
        <ActivityIndicator size="large" color="black" />
        <Text style={ styles.loadingText }>Loading your meal plan...</Text>
      </View>
    );
  }

  return (
    <View style={ styles.container }>
      <View style={ styles.header }>
        <Text style={ styles.headerTitle }>Meal Planner</Text>
        <CalendarViewToggle value={calendarView} onChange={setCalendarView} />
      </View>

      {calendarView === "month" ? (
        <MonthView  
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
          markedDates={getMarkedDates()}
          recipes={getRecipesForDate(selectedDate)}
          onRemoveRecipe={removeRecipeFromDate}
        />
      ) : (
        <WeekView
          selectedDate={selectedDate}
          weekDates={getWeekDates(selectedDate)}
          onDateSelect={setSelectedDate}
          recipes={getRecipesForDate(selectedDate)}
          onRemoveRecipe={removeRecipeFromDate}
          getRecipesForDate={getRecipesForDate}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#ffff", 
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffff",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "black",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: "#ffff",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 16,
  },
  testButton: {
    backgroundColor: '#4A90E2',
    padding: 14,
    borderRadius: 8,
    marginTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  testButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
});