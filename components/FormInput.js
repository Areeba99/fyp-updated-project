import React from "react";
import {Input} from "react-native-elements";
import {StyleSheet, View} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import color from "../constants/Colors";

const FormInput = ({
                       iconName,
                       iconColor,
                       returnKeyType,
                       keyboardType,
                       name,
                       placeholder,
                       ...rest
                   }) => (
    <View style={styles.inputContainer}>
        <Input
            {...rest}
            leftIcon={<Ionicons name={iconName} size={28} color={iconColor}/>}
            leftIconContainerStyle={styles.iconStyle}
            placeholderTextColor="grey"
            keyboardType={keyboardType}
            name={name}
            placeholder={placeholder}
            inputContainerStyle={{
                borderWidth: 0,
                backgroundColor: color.bgfield,
                borderRadius: 10,
                shadowColor: "#000",
                shadowOffset: {
                    width: 0,
                    height: 3,
                },
                shadowOpacity: 0.2,
                shadowRadius: 4.65,
                elevation: 6,
                paddingHorizontal: 10,
                paddingVertical: 5,
                borderBottomWidth: 0



            }}
            style={{borderWidth: 0}}
        />
    </View>
);


const styles = StyleSheet.create({
    inputContainer: {
        margin: 15,
        borderRadius: 30,
        borderWidth: 0,
        borderBottomWidth: 0,

    },
    iconStyle: {
        marginRight: 10
    }
});

export default FormInput;
