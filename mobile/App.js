import { StatusBar } from 'expo-status-bar';
import {Button, Dimensions, StyleSheet, Text, View} from 'react-native';
import ProgressBar from "./components/progressBar";
import Padd from "./components/padd";
import {Component} from "react";
import APIRequest from "./components/request";
import axios from "axios";

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
                    <Text>Open up App.js to start working on your app!</Text>
                    <Text>Will This Overrun?Will This Overrun?Will This Overrun?Will This Overrun?Will This Overrun?Will This Overrun?Will This Overrun?Will This Overrun?Will This Overrun?</Text>
                    <Padd>
                        <Button title={"I Like DIICCK"} onPress={x => this.getStatus()}/>
                    </Padd>

                    <Padd>
                        <ProgressBar progress={0.2}>%</ProgressBar>
                    </Padd>

                    <Text>{this.state.smeatonStatus.UpForMS}</Text>
                    {/*<StatusBar style="auto"/>*/}
                </View>
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
    justifyContent: 'center',
    //aspectRatio: tarAspect,
      maxHeight: windowHeight,
      maxWidth: windowHeight * tarAspect,
      padding: 10,
      overflowY: "scroll",

},
});
