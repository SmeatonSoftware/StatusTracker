import { StatusBar } from 'expo-status-bar';
import {Button, StyleSheet, Text, View} from 'react-native';
import ProgressBar from "./components/progressBar";
import Padd from "./components/padd";
import {Component} from "react";
import APIRequest from "./components/request";

export default class App extends Component{
    constructor(props) {
        super(props);

        this.state = {smeatonStatus: {UpForMS: 0}};
    }

    async componentDidMount() {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.,
            {
                title: 'Cool Photo App Camera Permission',
                message:
                    'Cool Photo App needs access to your camera ' +
                    'so you can take awesome pictures.',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
            },
        );

        let that = this;
        let r = new APIRequest("status", "", "GET")

        await r.executeWithCallback(
            (d)=> {console.log(d)},
            (d)=> {console.log(d)},
            true,
            {}
        )

        // console.log(d);
        //
        // that.setState({smeatonStatus: d.data});
    }

    render() {
        return (
            <View style={styles.container}>
                <Text>Open up App.js to start working on your app!</Text>
                <Padd>
                    <Button title={"I Like DIICCK"} onPress={x => console.log("Hey There")}/>
                </Padd>

                <Padd>
                    <ProgressBar progress={0.2}>%</ProgressBar>
                </Padd>

                <Text>{this.state.smeatonStatus.UpForMS}</Text>
                <StatusBar style="auto"/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
