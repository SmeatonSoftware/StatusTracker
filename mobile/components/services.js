import {Component} from "react";
import {ScrollView, View, Text, StyleSheet} from "react-native";
import APIRequest from "./request";
import ServiceElement from "./serviceElement";

export default class Services extends Component{
    constructor(props) {
        super(props);

        this.state = {services: []}
    }

    async componentDidMount() {
        let that = this;
        let r = new APIRequest("services/all", "", "GET")

        await r.executeWithCallback(
            (d)=> {
                that.setState({services: d.data});
            },
            (d)=> {console.log(d)},
            true,
            {}
        );
    }

    render() {
        return <ScrollView style={styles.body}>
            {this.state.services.map(x=><ServiceElement data={x} key={x.Id}/>)}
        </ScrollView>;
    }
}

const styles = StyleSheet.create({
    body:{
        height: "100%",
        minWidth: "100%"
    }
});
