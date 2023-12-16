import {Component} from "react";
import {StyleSheet, TextInput, View, Text, Button} from "react-native";
import APIRequest from "./request";
import Padd from "./padd";
import {theme} from "./theme";

export default class NewService extends Component{
    constructor(props) {
        super(props);

        this.state = {newUrl: "", minutes: "5"}
    }

    async submitUrl(){
        let that = this;
        let r = new APIRequest("services/submit?delay="+this.state.minutes, this.state.newUrl, "POST")

        await r.executeWithCallback(
            (d)=> {
                that.setState({newUrl: ""});
                document.location.reload();
            },
            (d)=> {console.log(d)},
            true,
            {}
        );
    }

    render() {
        return <View style={styles.body}>
            <Padd style={{alignItems: "center", minWidth: "100%"}}>
                <Text style={styles.text}>Service Url</Text>
                <TextInput style={styles.input} value={this.state.newUrl} onChangeText={x=>this.setState({newUrl: x})}/>
            </Padd>
            <Padd style={{alignItems: "center", minWidth: "100%"}}>
                <Text style={styles.text}>Minutes between ping</Text>
                <TextInput style={styles.input} value={this.state.minutes} onChangeText={x=>this.setState({minutes: x})}/>
            </Padd>
            <Padd style={{paddingTop: 10, paddingBottom: 10, flexDirection: "row", justifyContent: "space-evenly", minWidth: "100%"}}>
                <View style={{minWidth: "49%"}}>
                    <Button color={theme.buttonSecondary} title={"Track Url"} onPress={x=>this.submitUrl()}/>
                </View>
                <View style={{minWidth: "1%"}}/>
                <View style={{minWidth: "49%"}}>
                    <Button color={theme.buttonSecondary} title={"Refresh"} onPress={x=>document.location.reload()}/>
                </View>
            </Padd>
        </View>;
    }
}

const styles = StyleSheet.create({
    body:{
        //height: "50%",
        flex: 1,
        minWidth: "100%",
        justifyContent: "flex-start",
        alignItems: "center"
    },
    text:{
        color: theme.textPrimary,
        fontWeight: "bold"
    },
    input:{
        backgroundColor: theme.bgSecondary,
        color: theme.textPrimary,
        borderWidth: 1,
        borderColor: "black",
        borderRadius: 5,
        minWidth: "100%",
        padding: 10
    }
});
