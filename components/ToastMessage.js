import React, {useState} from "react";
import {Text, View} from 'react-native'


const Toast = ({message, color, stay}) =>{
    let[dis, setDisplay] = useState("block")
    if (stay){
        setTimeout(() => {
           setDisplay("none")
        }, 3000);
        return(
            <View style={{backgroundColor: color, paddingVertical: 10, paddingHorizontal: 20}}>
                <Text style={{fontSize: 12, color: "#fafafa", textAlign: "center"}}>{message}</Text>
            </View>
        );
    }
    else return(
        <View style={{backgroundColor: color, paddingVertical: 10, paddingHorizontal: 20, display: "block"}}>
            <Text style={{fontSize: 12, color: "#fafafa", textAlign: "center"}}>{message}</Text>
        </View>
    );

}


export default Toast;
