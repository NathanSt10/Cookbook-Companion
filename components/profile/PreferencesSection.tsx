import { StyleSheet, View, Text, TouchableOpacity, TextInput } from 'react-native';
import React, { useState } from 'react';

interface PreferenceSectionProps {
  title: string;
  items: string[];
  onAdd: (item: string) => void;
  onRemove: (item: string) => void;
  placeholder: string;
  disabled?: boolean;
}

interface PreferenceChipProps {
  label: string;
  onRemove: () => void;
  disabled?: boolean;
}

function PreferenceChip({ label, onRemove, disabled } : PreferenceChipProps) {
  return (
    <View style={styles.chip}>
      <Text style={styles.chipText}>{label}</Text>
      <TouchableOpacity
        onPress={onRemove}
        style={styles.removeButton}
        disabled={disabled}
      >
        <Text style={styles.removeButtonText}>x</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function PreferenceSection({
  title,
  items,
  onAdd,
  onRemove,
  placeholder,
  disabled=false,
} : PreferenceSectionProps) {
  const [inputValue, setInputValue] = useState<string>("");

  const handleAdd = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !items.includes(trimmed)) {
      onAdd(trimmed);
      setInputValue("");
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="grey"
          value={inputValue}
          onChangeText={setInputValue}
          onSubmitEditing={handleAdd}
          editable={!disabled}
        />
        <TouchableOpacity
          style={[styles.addButton, disabled && { opacity: 0.6 }]}
          onPress={handleAdd}
          disabled={disabled}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.chipContainer}>
        {items.length === 0 ? 
          (<Text style={styles.emptyText}>
            No {title.toLowerCase()} added yet
          </Text>)
          :
          (items.map((item, index) => (
            <PreferenceChip
              key={index}
              label={item}
              onRemove={() => onRemove(item)}
              disabled={disabled}
            />))
          )
        }
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "whitesmoke",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
    marginBottom: 12,
  },
  inputRow: {
    flexDirection: "row",
    marginBottom: 12,
  },
  input: {
    flex: 1,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "gainsboro",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginRight: 8,
  },
  addButton: {
    backgroundColor: "black",
    borderRadius: 8,
    width: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap", 
    gap: 8,
  },
  chip: {
    flexDirection: "row",
    backgroundColor: "whitesmoke",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: "center",
  },
  chipText: {
    fontSize: 14,
    color: "black",
    marginRight: 4,
  },
  removeButton: {
    marginLeft: 4,
    padding: 2,
  },
  removeButtonText: {
    fontSize: 20,
    color: "black",
    fontWeight: "bold",
  },
  emptyText: {
    fontSize: 14,
    color: "royalblue",
    fontStyle: "italic",
  },
})