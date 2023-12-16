import { StatusBar } from 'expo-status-bar';
import {Button, Dimensions, ScrollView, StyleSheet, Text, TextInput, TouchableHighlight, View} from 'react-native';
import ProgressBar from "./components/progressBar";
import Padd from "./components/padd";
import {Component} from "react";
import APIRequest from "./components/request";
import Services from "./components/services";
import NewService from "./components/newService";
import {theme} from "./components/theme";

import {BarChartFill, GraphUp, InfoCircle, InfoCircleFill, InfoSquareFill, Phone} from "react-bootstrap-icons";
import Trackers from "./pages/trackers";
import Info from "./pages/info";

export default class App extends Component{
    constructor(props) {
        super(props);

        this.state = {page: "",smeatonStatus: {UpForMS: 0}};
    }

    getPage(){
        switch (this.state.page){
            default:
                return <Trackers/>;

            case "info":
                return <Info/>;
        }

    }

    render() {
        return (
            <View style={styles.outer}>
                <View style={styles.container}>
                    <ScrollView style={{minWidth: "100%"}} showsVerticalScrollIndicator={false}>
                        <View style={styles.topBar}>
                            <Text style={{fontSize: 30, fontWeight: "bold", color: theme.textSecondary}}>Status Tracker</Text>
                        </View>
                        {this.getPage()}
                    </ScrollView>
                </View>

                <View style={styles.footer}>
                    <TouchableHighlight onPress={x=>this.setState({page: ""})} style={styles.navBox}>
                        <View>
                            <BarChartFill style={styles.navButtons}/>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight onPress={x=>this.setState({page: "info"})} style={styles.navBox}>
                        <View>
                            <InfoSquareFill style={styles.navButtons}/>
                        </View>
                    </TouchableHighlight>
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
    navBox:{
        width: "47%",
        alignItems: "center",
        shadowColor: '#171717',
        shadowOffset: {width: 3, height: 5},
        shadowOpacity: 0.5,
        shadowRadius: 4,
        borderColor: "white",
        borderWidth: 1,
        borderRadius: 5,
        padding: 3
    },
    navButtons:{
        color: theme.textPrimary,
        height: "50",
        width: "50"
    },
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
        //overflowY: "scroll",
    },
    footer:{
        position: "absolute",
        bottom: 0,
        backgroundColor: theme.bgSecondary,
        minWidth: windowHeight * tarAspect,
        minHeight: "5%",
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
        padding: "1%"
    }
});
