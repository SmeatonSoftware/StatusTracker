import { StatusBar } from 'expo-status-bar';
import {Button, Dimensions, StyleSheet, Text, TextInput, View} from 'react-native';
import ProgressBar from "./components/progressBar";
import Padd from "./components/padd";
import {Component} from "react";
import APIRequest from "./components/request";
import Services from "./components/services";
import NewService from "./components/newService";
import {theme} from "./components/theme";

export default class App extends Component{
    constructor(props) {
        super(props);

        this.state = {smeatonStatus: {UpForMS: 0}};
    }

    render() {
        return (
            <View style={styles.outer}>
                <View style={styles.container}>
                    <View style={styles.topBar}>
                        <Text style={{fontSize: 30, fontWeight: "bold", color: theme.textSecondary}}>Status Tracker</Text>
                    </View>
                    <View style={styles.body}>
                        <Padd>
                            <NewService/>
                        </Padd>
                        <Services/>
                    </View>

                </View>
                <View style={styles.footer}>
                    <View style={{minWidth: "49%"}}>
                        <Button title={"Tracker"}/>
                    </View>
                    <View style={{minWidth: "49%"}}>
                        <Button title={"About"}/>
                    </View>
                </View>
                {/*<StatusBar style="auto"/>*/}
            </View>
        );
    }
}

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const windowAspect =  windowWidth / windowHeight;
const maxAspect = 16/(16+9);
const tarAspect = Math.min(windowAspect, maxAspect);

const styles = StyleSheet.create({
    topBar:{
        //flex: 1,
        minWidth: "100%",
        alignSelf: "flex-start",
        alignItems: "center"
    },
    outer:{
        flex: 1,
        backgroundColor: theme.bgVoid,
        alignItems: 'center',
        justifyContent: 'center'
    },
    container: {
        flex: 1,
        backgroundColor: theme.bgPrimary,
        color: theme.textPrimary,
        alignItems: 'center',
        //justifyContent: 'center',
        //aspectRatio: tarAspect,
        maxHeight: windowHeight,
        maxWidth: windowHeight * tarAspect,
        minWidth: windowHeight * tarAspect,
        padding: 10,
        overflowY: "scroll",
    },
    body:{
        flex: 1,
        alignSelf: "center",
        justifyContent: "center",
        alignItems: "center",
        minWidth: "100%"
    },
    footer:{
        position: "absolute",
        bottom: 0,
        backgroundColor: theme.bgSecondary,
        minWidth: windowHeight * tarAspect,
        minHeight: "5%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1%"

    }
});
