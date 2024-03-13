// screens/Home.tsx
import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, TouchableOpacity, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DropDownPicker from 'react-native-dropdown-picker';
import CategoryItem from '../components/CategoryItem';
import ItemCard from '../components/ItemCard';
import { Task, Category } from '../types/Task'; //task?
import { categories } from '../utils/data';

const Home: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [categoryValue, setCategoryValue] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [taskInput, setTaskInput] = useState("");
  const [taskList, setTaskList] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);

  useEffect(() => {
    getData();
  }, []);

  const storeTasks = async (tasks: Task[]) => {
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
    } catch (error) {
      console.error('Error storing tasks: ', error);
    }
  };

  const getTasks = async () => {
    try {
      const tasks = await AsyncStorage.getItem('tasks');
      if (tasks !== null) {
        setTaskList(JSON.parse(tasks));
      }
    } catch (error) {
      console.error('Error getting tasks: ', error);
    }
  };

  const getData = async () => {
    await getTasks();
  };

  const handleAddTask = () => {
    if (taskInput.trim() !== '' && categoryValue) {
      const newTaskList = [...taskList, { id: Math.random().toString(), title: taskInput, completed: false, category: categoryValue }];
      setTaskList(newTaskList);
      storeTasks(newTaskList);
      getData();
      setTaskInput('');
    }
  };

  const handleRemoveTask = (id: string) => {
    const filteredList = taskList.filter(task => task.id !== id);
    setTaskList(filteredList);
    storeTasks(filteredList);
    getData();
  };

  const handleDoneTask = (id: string) => {
    const updatedList = taskList.map(task => {
      if (task.id === id) {
        return { ...task, completed: true };
      }
      return task;
    });
    setTaskList(updatedList);
    storeTasks(updatedList);
    getData();
  };

  const handleSelectedCategory = (type: string) => {
    setSelectedCategory(type);
    switch (type) {
      case 'all':
        setFilteredTasks(taskList.filter(task => !task.completed));
        break;
      case 'done':
        setFilteredTasks(taskList.filter(task => task.completed));
        break;
      default:
        setFilteredTasks(taskList.filter(task => task.category === type));
        break;
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
        <TextInput
          style={{ flex: 1, borderWidth: 1, borderColor: 'gray', padding: 10 }}
          value={taskInput}
          onChangeText={setTaskInput}
          placeholder="Digite o texto da nova tarefa"
        />
        <TouchableOpacity onPress={handleAddTask}>
          <Text style={{ marginLeft: 10, padding: 10, backgroundColor: 'blue', color: 'white' }}>Enviar</Text>
        </TouchableOpacity>
      </View>

      <DropDownPicker
        style={{ zIndex: 1000 }}
        open={open}
        value={categoryValue}
        items={categories.filter(c => c.value !== "all" && c.value !== "done")}
        setOpen={setOpen}
        setValue={setCategoryValue}
        placeholder="Escolha uma categoria"
        theme="DARK"
        placeholderStyle={{ color: "#ccc", fontSize: 16 }}
        listItemLabelStyle={{ color: "#fff", fontSize: 16, paddingLeft: 15 }}
        dropDownContainerStyle={{ backgroundColor: "#11212D" }}
        selectedItemContainerStyle={{ backgroundColor: "1c2541" }}
        selectedItemLabelStyle={{ fontWeight: "bold", fontSize: 16, color: "#fff" }}
      />

      <FlatList
        data={categories}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <CategoryItem
            item={item}
            handleSelectCategory={handleSelectedCategory}
            selectedCategory={selectedCategory}
          />
        )}
      />

      <FlatList
        data={filteredTasks}
        renderItem={({ item }) => (
          <ItemCard
            task={item}
            handleRemoveTask={handleRemoveTask}
            handleDoneTask={handleDoneTask}
          />
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default Home;
