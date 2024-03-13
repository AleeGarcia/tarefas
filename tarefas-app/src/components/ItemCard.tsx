import { StyleSheet, Text, View, Alert } from "react-native";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { Swipeable } from "react-native-gesture-handler";
import { Task } from "../types/Task";
import { categories } from "../utils/data";

interface Props {
    task: Task;
    handleRemoveTask: (id: string) => void;
    handleDoneTask: (id: string) => void;
}

const ItemCard = ({ task, handleRemoveTask, handleDoneTask }: Props) => {
    const category = categories.filter((c) => c.value === task.category);

    const handleDelete = () => {
        Alert.alert("Tarefas", "Tem certeza que deseja excluir esta tarefa?", [
            {
                text: "Nãooooooo",
                style: "cancel",
            },
            { text: "Simmmm", onPress: () => handleRemoveTask(task.id) },
        ]);
    };

    const LeftAction = () => {
        return(
            <View style={styles.swipeLeft}>
                <MaterialIcons
                name="done"
                size={20}
                color="#fff"
                onPress={() => handleDoneTask(task.id)}
                />
            </View>
        );
    };

    const RightAction = () => {
        return (
            <View style={styles.swipeRight}>
            <MaterialIcons
            name="delete"
            size={20}
            color="#fff"
            onPress={handleDelete}
            />
        </View>
        );
    };

    return (
        <Swipeable renderLeftActions={LeftAction} renderRightActions={RightAction}>
            <View style={styles.container}>
                <View
                style={{
                    borderStyle: "solid",
                    height: "100%",
                    borderLeftWidth: 6,
                    borderColor: category[0].color,
                    marginRight: 10,
                }}
                />
                <Text style={styles.title}>{task.title}</Text>
            </View>
        </Swipeable>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
        paddingVertical: 15,
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
    },
    swipeLeft: {
        flex: 1,
        backgroundColor: "green",
        justifyContent: "center",
        alignItems: "flex-end",
        paddingRight: 20,
    },
    swipeRight: {
        flex: 1,
        backgroundColor: "red",
        justifyContent: "center",
        paddingLeft: 20,
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default ItemCard;
