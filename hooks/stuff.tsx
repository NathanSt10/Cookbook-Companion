const handleCancel = () => {
  if (currentPreferences) {
    setPreferences({
      dietary: currentPreferences.dietary || [],
      allergies: currentPreferences.allergies || [],
      cuisines: currentPreferences.cuisines || [],
      kitchenware: currentPreferences.kitchenware || [],
      dislikes: currentPreferences.dislikes || [],
      cookingpref: currentPreferences.cookingpref || [],
    });
  }
  onClose();
};