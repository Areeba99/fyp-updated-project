import React from "react";
import { Text, SafeAreaView, View, StyleSheet } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import FormInput from "../../components/FormInput";
import FormButton from "../../components/FormButton";
import ErrorMessage from "../../components/ErrorMessage";
import { Button } from "react-native-elements";
import {Firebase} from "../../connection/comms";

const validationSchema = Yup.object().shape({
    email: Yup.string()
        .label("Email")
        .email("Enter a valid email")
        .required("Please enter a registered email")
});

function ForgotPassword({ navigation, firebase }) {
    function goToLogin() {
        return navigation.navigate("Login");
    }


    async function handlePasswordReset(values, actions) {
        const { email } = values;

        try {
            await Firebase.passwordReset(email);
            console.log("Password reset email sent successfully");
            navigation.navigate("Login");
        } catch (error) {
            actions.setFieldError("general", error.message);
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={{paddingTop: 100}}>
                <Text style={styles.text}>Forgot Password?</Text>
            </View>
            <Formik
                initialValues={{ email: "" }}
                onSubmit={(values, actions) => {
                    handlePasswordReset(values, actions);
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
                        />
                        <ErrorMessage errorValue={touched.email && errors.email} />
                        <View style={styles.buttonContainer}>
                            <FormButton
                                buttonType="outline"
                                onPress={handleSubmit}
                                title="Send Email"
                                buttonColor="#ef3caf"
                                disabled={!isValid || isSubmitting}
                            />
                            <Button
                                title="Login to your account"
                                onPress={goToLogin}
                                titleStyle={{
                                    color: "#039BE5"
                                }}
                                type="clear"
                            />
                        </View>
                        <ErrorMessage errorValue={errors.general} />
                    </>
                )}
            </Formik>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    text: {
        color: "#333",
        fontSize: 24,
        marginLeft: 25,
        marginBottom: 25
    },
    buttonContainer: {
        margin: 25
    }
});

export default ForgotPassword;
