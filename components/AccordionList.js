import * as React from 'react';
import { List } from 'react-native-paper';
import {StyleSheet} from "react-native";

const AccordionList = ({
    listTitle,
    listIcon,
    question1,
    question2,
    question3,
    answer1,
    answer2,
    answer3
}) => (

    <List.Section>
      <List.Accordion
        title={listTitle}
        style={styles.container}
        titleStyle={styles.headings}
        right={props => <List.Icon {...props} icon={listIcon} />}>

        <List.Item title={question1}
        style={styles.itemStyle} 
        description={answer1}
        titleStyle={styles.question}
        descriptionStyle={styles.answer}
        titleNumberOfLines={5}
        descriptionNumberOfLines={10}
        />

        <List.Item title={question2} 
        style={styles.itemStyle}
        description={answer2}
        titleStyle={styles.question}
        descriptionStyle={styles.answer}
        titleNumberOfLines={5}
        descriptionNumberOfLines={10}
        />
        
        <List.Item title={question3} 
        style={styles.itemStyle}
        description={answer3}
        titleStyle={styles.question}
        descriptionStyle={styles.answer}
        titleNumberOfLines={5}
        descriptionNumberOfLines={10}
        />
      </List.Accordion>
    </List.Section>
  );

const styles = StyleSheet.create({
  question: {
    fontSize: 18,
    fontWeight: "bold"
  },
  answer: {
    fontSize: 16
  },
  itemStyle:{
      width: '90%'
  },
  headings:{
      fontSize: 18,
      fontWeight: "normal",
      textTransform: "uppercase"
  }
});

export default AccordionList;