import { StatusBar } from 'expo-status-bar';
import {Button, Dimensions, StyleSheet, Text, TextInput, View} from 'react-native';
import ProgressBar from "./components/progressBar";
import Padd from "./components/padd";
import {Component} from "react";
import APIRequest from "./components/request";
import Services from "./components/services";
import NewService from "./components/newService";

export default class App extends Component{
    constructor(props) {
        super(props);

        this.state = {smeatonStatus: {UpForMS: 0}};
    }

    async getStatus() {
        let that = this;
        let r = new APIRequest("status", "", "GET")

        await r.executeWithCallback(
            (d)=> {
                that.setState({smeatonStatus: d.data});
            },
            (d)=> {console.log(d)},
            true,
            {}
        );
    }

    render() {
        return (
            <View style={styles.outer}>
                <View style={styles.container}>
                    <View style={styles.topBar}>
                        <Text>Status Tracker</Text>
                    </View>
                    <View style={styles.body}>
                        <Padd>
                            <NewService/>
                        </Padd>
                        <Services/>
                        {/*<Text>Will This Overrun?Will This Overrun?Will This Overrun?Will This Overrun?Will This Overrun?Will This Overrun?Will This Overrun?Will This Overrun?Will This Overrun?</Text>*/}
                        {/*<Padd>*/}
                        {/*    <Button title={"I Like DIICCK"} onPress={x => this.getStatus()}/>*/}
                        {/*</Padd>*/}

                        {/*<Padd>*/}
                        {/*    <ProgressBar progress={0.2}>%</ProgressBar>*/}
                        {/*</Padd>*/}

                        {/*<Text>{this.state.smeatonStatus.UpForMS}</Text>*/}
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
        backgroundColor: '#565656',
        alignItems: 'center',
        justifyContent: 'center'
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
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
    }
});
