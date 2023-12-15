import {Component} from "react";
import {StyleSheet, TextInput, View, Text, Button} from "react-native";
import APIRequest from "./request";
import Padd from "./padd";

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
            <Text>Service Url</Text>
            <TextInput style={styles.input} value={this.state.newUrl} onChangeText={x=>this.setState({newUrl: x})}/>
            <Text>Minutes between ping</Text>
            <TextInput style={styles.input} value={this.state.minutes} onChangeText={x=>this.setState({minutes: x})}/>
            <Padd>
                <Button title={"Track Url"} onPress={x=>this.submitUrl()}/>
            </Padd>
        </View>;
    }
}

const styles = StyleSheet.create({
    body:{
        //height: "100%",
        minWidth: "100%",
        alignItems: "center"
    },
    input:{
        borderWidth: 1,
        borderColor: "black",
        borderRadius: 5,
        width: "100%",
        padding: 10
    }
});
