import React, {useContext, useState} from "react";
import {SafeAreaView, StyleSheet, TouchableOpacity, View, Image, ImageBackground} from "react-native";
import {Avatar, Button, colors} from "react-native-elements";
import {Ionicons} from "@expo/vector-icons";
import {Formik} from "formik";
import * as Yup from "yup";
import FormInput from "../../components/FormInput";
import FormButton from "../../components/FormButton";
import ErrorMessage from "../../components/ErrorMessage";
import {Firebase} from "../../connection/comms";
import UserContext from "../../connection/userContext";
import color from  "../../constants/Colors"


const validationSchema = Yup.object().shape({
    email: Yup.string()
        .label("Email")
        .email("Enter a valid email")
        .required("Please enter a registered email"),
    password: Yup.string()
        .label("Password")
        .required()
        .min(6, "Password must have at least 6 characters ")
});

function Login({navigation}) {
    const [passwordVisibility, setPasswordVisibility] = useState(true);
    const [rightIcon, setRightIcon] = useState("ios-eye");
    const {loggedIn, setLoggedin} = useContext(UserContext);

    function goToSignup() {
        return navigation.navigate("Register");
    }

    function goToForgotPassword() {
        return navigation.navigate("Reset");
    }

    function handlePasswordVisibility() {
        if (rightIcon === "ios-eye") {
            setRightIcon("ios-eye-off");
            setPasswordVisibility(!passwordVisibility);
        } else if (rightIcon === "ios-eye-off") {
            setRightIcon("ios-eye");
            setPasswordVisibility(!passwordVisibility);
        }
    }


    async function handleOnLogin(values, actions) {
        const {email, password} = values;
        try {
            const response = await Firebase.loginWithEmail(email, password);
            if (response) {
                setLoggedin(response);
            }
        } catch (error) {
            console.log(error.code)
            actions.setFieldError("general", error.message);
        } finally {
            actions.setSubmitting(false);
        }
    }

    return (
        <SafeAreaView style={styles.container}>
                <View style={styles.middle}>
                    <View style={{alignItems: "center", marginBottom: 50}}>
                        <Image source={require("../../assets/imgIcons/AppLogo.png")} style={{height: 100, width: 350, marginTop:50,resizeMode:"contain"}}/>
                    </View>
                    <Formik
                        initialValues={{email: "", password: ""}}
                        onSubmit={(values, actions) => {
                            handleOnLogin(values, actions);
                        }}
                        validationSchema={validationSchema}
                    >
                        {({
                              handleChange,
                              values,
                              handleSubmit,
                              errors,
                              isValid,
                              touched,
                              handleBlur,
                              isSubmitting
                          }) => (
                            <>
                                <FormInput
                                    name="email"
                                    value={values.email}
                                    onChangeText={handleChange("email")}
                                    placeholder="Enter email"
                                    autoCapitalize="none"
                                    iconName="ios-mail"
                                    iconColor="#2C384A"
                                    onBlur={handleBlur("email")}
                                    keyboardType={"email-address"}
                                    style={styles.input}
                                />
                                <ErrorMessage errorValue={touched.email && errors.email}/>
                                <FormInput
                                    name="password"
                                    value={values.password}
                                    onChangeText={handleChange("password")}
                                    placeholder="Enter password"
                                    secureTextEntry={passwordVisibility}
                                    iconName="ios-lock"
                                    iconColor="#2C384A"
                                    onBlur={handleBlur("password")}
                                    rightIcon={
                                        <TouchableOpacity onPress={handlePasswordVisibility}>
                                            <Ionicons name={rightIcon} size={28} color="grey"/>
                                        </TouchableOpacity>
                                    }
                                />
                                <ErrorMessage errorValue={touched.password && errors.password}/>
                                <View style={styles.buttonContainer}>
                                    <FormButton
                                        buttonType="outline"
                                        onPress={handleSubmit}
                                        title="LOGIN"
                                        buttonColor="#ef3caf"
                                        disabled={!isValid || isSubmitting}
                                        loading={isSubmitting}
                                    />
                                </View>
                                <ErrorMessage errorValue={errors.general}/>
                            </>
                        )}
                    </Formik>
                    <Button
                        title="Don't have an account? Sign Up"
                        onPress={goToSignup}
                        titleStyle={{
                            color: "#ef3caf"
                        }}
                        type="clear"
                    />
                    <Button
                        title="Forgot Password?"
                        onPress={goToForgotPassword}
                        titleStyle={{
                            color: "#3282fa",
                            textDecorationLine: "underline"
                        }}
                        type="clear"
                    />
                </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: color.bgColor,
        justifyContent: "center",
    },
    logoContainer: {
        marginBottom: 500,
        alignItems: "center"
    },
    buttonContainer: {
        margin: 25
    },
    middle: {
        paddingBottom: 50
    },
    input:{
        backgroundColor: "red",
    }
});

export default Login;
