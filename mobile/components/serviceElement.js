import {Component} from "react";
import {ScrollView, View, Text, StyleSheet} from "react-native";
import APIRequest from "./request";

export default class ServiceElement extends Component{
    constructor(props) {
        super(props);

        this.state = {
            pingLog: [],
            pingStats: {
                minMs: 0,
                maxMs:0,
                avgMs: 0,
                failures: 0,
                total: 0
            }}
    }

    async refreshLog(){
        let that = this;
        let r = new APIRequest("pings/recent?service="+this.props.data.Id+"&small=true", "", "GET")

        await r.executeWithCallback(
            (d)=> {
                console.log(d)
                that.setState({pingLog: d.data});
            },
            (d)=> {console.log(d)},
            true,
            {}
        );
    }

    async refreshStats(){
        let that = this;
        let r = new APIRequest("pings/stats?service="+this.props.data.Id, "", "GET")

        await r.executeWithCallback(
            (d)=> {
                console.log(d)
                that.setState({pingStats: d.data});
            },
            (d)=> {console.log(d)},
            true,
            {}
        );
    }

    async componentDidMount() {
        await this.refreshStats();
        await this.refreshLog();
    }

    render() {
        let s = this.props.data;
        return <View style={styles.body}>
            <Text>{s.url}</Text>
            <Text>{this.state.pingStats.minMs}-{this.state.pingStats.avgMs}-{this.state.pingStats.maxMs}</Text>
        </View>
    }
}

const styles = StyleSheet.create({
    body:{
        flex: 1,
        alignSelf: "center",
        justifyContent: "center",
        alignItems: "center"
    }
});
