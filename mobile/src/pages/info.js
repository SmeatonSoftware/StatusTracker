import {Component} from "react";
import {Linking, StyleSheet, Text, TouchableHighlight, View} from "react-native";
import {theme} from "../theme";
import Padd from "../components/padd";
import {AntDesign} from "@expo/vector-icons";

export default class Info extends Component{
    render(){
        return <View style={styles.body}>
            <Padd style={{alignItems: "center"}}>
                <Text style={styles.text}>Monitor your websites status for free.</Text>
            </Padd>
            <Padd style={{alignItems: "center"}}>
                <TouchableHighlight onPress={x=>Linking.openURL("https://status.smeatonsoftware.co.uk/builds/app.apk")} style={styles.navBox}>
                    <View style={{alignItems: "center"}}>
                        <AntDesign name="android1" size={50} color={theme.textPrimary}/>
                        <Text style={styles.text}>Download .APK</Text>
                    </View>
                </TouchableHighlight>
            </Padd>
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
    },
    text:{
        color: theme.textPrimary,
        fontWeight: "bold"
    },
    navBox:{
        width: "47%",
        alignItems: "center",
        backgroundColor: theme.bgSecondary,
        borderColor: "white",
        borderWidth: 1,
        borderRadius: 5,
        padding: 3
    },
    navButtons:{
        color: theme.textPrimary,
        height: "100",
        width: "100"
    },
});
