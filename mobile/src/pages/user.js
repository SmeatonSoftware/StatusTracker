import {Component} from "react";
import {StyleSheet, Text, TextInput, View} from "react-native";
import Authentication from "../services/authentication";
import Padd from "../components/padd";
import {theme} from "../theme";

export default class User extends Component {
    render() {
        return <View style={styles.body}>
            <Padd style={{alignItems: "center", minWidth: "100%"}}>
                <Text style={styles.text}>Email</Text>
                <TextInput style={styles.input} editable={false} value={Authentication.Identity.Email}/>
            </Padd>
        </View>;
    }
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
        minWidth: "100%",
        maxWidth: "100%",
        justifyContent: "center",
        alignItems: "center"
    },
    text: {
        fontSize: 20,
        color: theme.textPrimary,
        fontWeight: "bold"
    },
    input: {
        backgroundColor: theme.bgSecondary,
        color: theme.textPrimary,
        borderWidth: 1,
        borderColor: "black",
        borderRadius: 5,
        minWidth: "100%",
        padding: 10
    }
});
