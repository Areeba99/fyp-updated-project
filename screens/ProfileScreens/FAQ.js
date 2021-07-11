import React, {useContext, useEffect, useState} from 'react';
import { View, Text, SafeAreaView, ScrollView } from 'react-native';
import UserContext from "../../connection/userContext";
import AccordionList from "../../components/AccordionList";
import {StyleSheet} from "react-native"; 


export default function FAQ({navigation, route}) {
    const {loggedIn} = useContext(UserContext)
    //const [list, setList] = useState(null)
    const [Loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false);

    return(
            <SafeAreaView style={styles.container}>
            <ScrollView>
            <Text style={styles.textContainer}>Having trouble using the app? Have a look at the frequently asked questions and you may find your query already solved.</Text>
            <AccordionList
            listTitle="Measurements"
            listIcon="star-four-points"
            question1="How accurate are the Magic Measurements?"
            question2="How to get most reliable measurements?"
            question3="Can I save multiple measurements?"
            answer1="The measurements taken through the magic measurements section can be off by 3-4 inches."
            answer2="Make sure you are wearing skin-tight clothes when taking a picture. Place yourself in front of the camera at an angle in which all contents are visible."
            answer3="Yes"
            />
            <AccordionList
            listTitle="Order Placement"
            listIcon="star-four-points"
            question1="What is happening?"
            question2="Why is it happening?"
            question3="How to die?"
            answer1="IDK"
            answer2="No"
            answer3="Sigh"
            />
            <AccordionList
            listTitle="Tech Questions"
            listIcon="star-four-points"
            question1="Is this app available on IOS?"
            question2="Is there a desktop version of this app?"
            question3="Is there a website for this app?"
            answer1="Yes"
            answer2="No"
            answer3="No, there is currently no website for this app."
            />
        </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  container: {
    flex:1
  },
  textContainer:{
      fontSize: 16,
      margin: 10
  }
});