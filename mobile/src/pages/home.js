import {Component} from "react";
import {Linking, Platform, StyleSheet, Text, TouchableHighlight, View} from "react-native";
import Services from "../components/services";
import Padd from "../components/padd";
import {AntDesign} from "@expo/vector-icons";
import {theme} from "../theme";

export default class Home extends Component {
    render() {
        return <View style={styles.body}>
            <Services refresh={this.props.refresh} onlyFavs={false}/>
            {Platform.OS == "web" ?
                <Padd style={{alignItems: "center"}}>
                    <TouchableHighlight
                        onPress={x => Linking.openURL("https://status.smeatonsoftware.co.uk/builds/app.apk")}
                        style={styles.navBox}>
                        <View style={{alignItems: "center"}}>
                            <AntDesign name="android1" size={50} color={theme.textPrimary}/>
                            <Text style={styles.text}>Download Our</Text>
                            <Text style={styles.text}>Android App</Text>
                        </View>
                    </TouchableHighlight>
                </Padd>
                : null
            }

        </View>;
    }
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
        alignSelf: "center",
        justifyContent: "flex-start",
        alignItems: "center",
        minWidth: "100%",
        maxWidth: "100%",
        marginBottom: "100%"
    },
    navBox: {
        //width: "47%",
        alignItems: "center",
        backgroundColor: theme.bgSecondary,
        borderColor: "white",
        borderWidth: 1,
        borderRadius: 5,
        padding: 10
    },
    text: {
        color: theme.textPrimary,
        fontWeight: "bold"
    },
    navButtons: {
        color: theme.textPrimary,
        height: "100",
        width: "100"
    },
})
