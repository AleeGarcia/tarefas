import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Category } from "../types/Task"; //??

interface CategoryItemProps {
  item: Category;
  handleSelectCategory: (category: string) => void;
  selectedCategory: string;
}

const CategoryItem: React.FC<CategoryItemProps> = ({
  item,
  handleSelectCategory,
  selectedCategory,
}) => {
  const isSelected = selectedCategory === item.value;

  return (
    <TouchableOpacity
      style={[styles.container, isSelected && styles.selectedContainer]}
      onPress={() => handleSelectCategory(item.value)}
    >
      <Text style={styles.text}>{item.label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  selectedContainer: {
    borderColor: "#4169E1",
  },
  text: {
    fontSize: 16,
  },
});

export default CategoryItem;
