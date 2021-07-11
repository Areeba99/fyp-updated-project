// import {AsyncStorage} from "react-native";
import AsyncStorage from '@react-native-community/async-storage'

export const saveData = async (data) => {
    try {
        if (data) {
            await AsyncStorage.setItem('userData', JSON.stringify(data));
        }
    } catch (error) {
        console.error(error)
    }
};

export const getData = async () => {
    try {
        const value = await AsyncStorage.getItem('userData');
        if (value !== null) {
            console.log("AsyncStorage -> ", value);
            return JSON.parse(value)
        }
    } catch (error) {
        console.error(error)
    }
};

export const deleteUserData = async () => {
    try {
        await AsyncStorage.removeItem("userData");
        return true;
    } catch (exception) {
        return false;
    }
}
