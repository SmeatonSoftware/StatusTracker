import {Component} from "react";
import {ScrollView, View, Text, StyleSheet} from "react-native";
import APIRequest from "../services/request";
import ServiceElement from "./serviceElement";

export default class Services extends Component{
    constructor(props) {
        super(props);

        this.state = {services: []}
    }

    async refresh(){
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

    componentDidMount() {
        this.refresh();
        setInterval(x=>this.refresh(), 60000);
    }

    render() {
        return <View style={styles.body}>
            {this.state.services.map(x=><ServiceElement refresh={()=>this.refresh()} data={x} key={x.Id}/>)}
        </View>;
    }
}

const styles = StyleSheet.create({
    body:{
        //height: "100%",
        minWidth: "100%"
    }
});
