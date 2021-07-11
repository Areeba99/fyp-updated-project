import React, {useContext, useState} from "react";
import {KeyboardAvoidingView, ScrollView, StyleSheet, TouchableOpacity, View} from "react-native";
import {Button, CheckBox} from "react-native-elements";
import {Ionicons} from "@expo/vector-icons";
import {Formik} from "formik";
import * as Yup from "yup";
import FormInput from "../../components/FormInput";
import FormButton from "../../components/FormButton";
import ErrorMessage from "../../components/ErrorMessage";
import {Firebase} from "../../connection/comms"
import UserContext from "../../connection/userContext";

const validationSchema = Yup.object().shape({
    name: Yup.string()
        .label("Name")
        .required()
        .min(2, "Must have at least 2 characters"),
    city: Yup.string()
        .label("City")
        .required(),
    email: Yup.string()
        .label("Email")
        .email("Enter a valid email")
        .required("Please enter a registered email"),
    password: Yup.string()
        .label("Password")
        .required()
        .min(6, "Password should be at least 6 characters "),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Confirm Password must matched Password")
        .required("Confirm Password is required"),
    check: Yup.boolean().oneOf([true], "Please check the agreement")
});

function Signup({navigation, route}) {

    const [passwordVisibility, setPasswordVisibility] = useState(true);
    const [passwordIcon, setPasswordIcon] = useState("ios-eye");
    const [confirmPasswordIcon, setConfirmPasswordIcon] = useState("ios-eye");
    const [confirmPasswordVisibility, setConfirmPasswordVisibility] = useState(true);
    const {loggedIn, setLoggedin} = useContext(UserContext);

    function goToLogin() {
        return navigation.navigate("Login");
    }

    function handlePasswordVisibility() {
        if (passwordIcon === "ios-eye") {
            setPasswordIcon("ios-eye-off");
            setPasswordVisibility(!passwordVisibility);
        } else if (passwordIcon === "ios-eye-off") {
            setPasswordIcon("ios-eye");
            setPasswordVisibility(!passwordVisibility);
        }
    }


    function handleConfirmPasswordVisibility() {
        if (confirmPasswordIcon === "ios-eye") {
            setConfirmPasswordIcon("ios-eye-off");
            setConfirmPasswordVisibility(!confirmPasswordVisibility);
        } else if (confirmPasswordIcon === "ios-eye-off") {
            setConfirmPasswordIcon("ios-eye");
            setConfirmPasswordVisibility(!confirmPasswordVisibility);
        }
    }

    async function handleOnSignup(values, actions) {
        const {name, email, password, city} = values;

        try {
            const response = await Firebase.signupWithEmail(email, password);
            if (response.user.uid) {
                const {uid} = response.user;
                const userData = {email, name, uid, profileStatus:"incomplete", city};
                await Firebase.createNewUser(userData)
                const userLoggedin = await Firebase.loginWithEmail(email, password)
                setLoggedin(userLoggedin);
            }
        } catch (error) {
            actions.setFieldError("general", error.message);
            console.log(error)
        } finally {
            actions.setSubmitting(false);
        }
    }

    return (
        <KeyboardAvoidingView style={styles.container} enabled behavior="padding">
            <ScrollView>
                <Formik
                    initialValues={{
                        name: "",
                        email: "",
                        password: "",
                        confirmPassword: "",
                        check: false
                    }}
                    onSubmit={(values, actions) => {
                        handleOnSignup(values, actions);
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
                          isSubmitting,
                          setFieldValue
                      }) => {
                        if (route.params) {
                            if (!values.city){
                                setFieldValue("city", route.params.geoLocation)
                            }
                        }
                        return (
                            <>

                                <FormInput
                                    name="name"
                                    value={values.name}
                                    onChangeText={handleChange("name")}
                                    placeholder="Enter your full name"
                                    iconName="md-person"
                                    iconColor="#2C384A"
                                    onBlur={handleBlur("name")}
                                />
                                <ErrorMessage errorValue={touched.name && errors.name}/>
                                <FormInput
                                    name="city"
                                    value={values.city}
                                    onChangeText={handleChange("city")}
                                    placeholder="Enter your city"
                                    iconName="md-compass"
                                    iconColor="#2C384A"
                                    onBlur={handleBlur("city")}
                                    onFocus={() => {
                                        navigation.navigate("Location")
                                    }}
                                />
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
                                />
                                <ErrorMessage errorValue={touched.email && errors.email}/>
                                <FormInput
                                    name="password"
                                    value={values.password}
                                    onChangeText={handleChange("password")}
                                    placeholder="Enter password"
                                    iconName="ios-lock"
                                    iconColor="#2C384A"
                                    onBlur={handleBlur("password")}
                                    secureTextEntry={passwordVisibility}
                                    rightIcon={
                                        <TouchableOpacity onPress={handlePasswordVisibility}>
                                            <Ionicons name={passwordIcon} size={28} color="grey"/>
                                        </TouchableOpacity>
                                    }
                                />
                                <ErrorMessage errorValue={touched.password && errors.password}/>
                                <FormInput
                                    name="password"
                                    value={values.confirmPassword}
                                    onChangeText={handleChange("confirmPassword")}
                                    placeholder="Confirm password"
                                    iconName="ios-lock"
                                    iconColor="#2C384A"
                                    onBlur={handleBlur("confirmPassword")}
                                    secureTextEntry={confirmPasswordVisibility}
                                    rightIcon={
                                        <TouchableOpacity onPress={handleConfirmPasswordVisibility}>
                                            <Ionicons
                                                name={confirmPasswordIcon}
                                                size={28}
                                                color="grey"
                                            />
                                        </TouchableOpacity>
                                    }
                                />
                                <ErrorMessage
                                    errorValue={touched.confirmPassword && errors.confirmPassword}
                                />
                                <CheckBox
                                    containerStyle={styles.checkBoxContainer}
                                    checkedIcon="check-box"
                                    iconType="material"
                                    uncheckedIcon="check-box-outline-blank"
                                    title="Agree to terms and conditions"
                                    checkedTitle="You agreed to our terms and conditions"
                                    checked={values.check}
                                    onPress={() => setFieldValue("check", !values.check)}
                                />
                                <View style={styles.buttonContainer}>
                                    <FormButton
                                        buttonType="outline"
                                        onPress={handleSubmit}
                                        title="SIGNUP"
                                        buttonColor="#ef3caf"
                                        disabled={!isValid || isSubmitting}
                                        loading={isSubmitting}
                                    />
                                </View>
                                <ErrorMessage errorValue={errors.general}/>
                            </>
                        )
                    }}
                </Formik>
                <Button
                    title="Have an account? Login"
                    onPress={goToLogin}
                    titleStyle={{
                        color: "#039BE5"
                    }}
                    type="clear"
                />
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingTop: 50
    },
    logoContainer: {
        marginBottom: 15,
        alignItems: "center"
    },
    buttonContainer: {
        margin: 25
    },
    checkBoxContainer: {
        backgroundColor: "#fff",
        borderColor: "#fff"
    }
});

export default Signup;
