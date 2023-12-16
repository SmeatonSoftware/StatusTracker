import {Component} from "react";
import {StyleSheet, Text, View} from "react-native";
import {theme} from "../components/theme";
import Padd from "../components/padd";
import NewService from "../components/newService";
import Services from "../components/services";

export default class Info extends Component{
    render(){
        return <View style={styles.body}>
            <Text>Info Page</Text>
        </View>;
    }
}

const styles = StyleSheet.create({
    body:{
        flex: 1,
        alignSelf: "center",
        justifyContent: "center",
        alignItems: "center",
        minWidth: "100%",
        marginBottom: "20%"
    }
});
