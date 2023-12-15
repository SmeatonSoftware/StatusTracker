import {Component} from "react";
import {ScrollView, View, Text, StyleSheet} from "react-native";
import APIRequest from "./request";
import Padd from "./padd";

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

    getBar(x, idx){
        let msDiff = (this.state.pingStats.maxMs + 20 - this.state.pingStats.minMs);

        let height = (x-this.state.pingStats.minMs + 10) / msDiff * 100;
        let width = 1/this.state.pingLog.length*100;

        let colour = "green";

        if (height > 90)
            colour = "red"

        else if (height > 50)
            colour = "orange"

        if (x == -1)
        {
            colour = "red";
            height = 50;
        }

        return <View style={{backgroundColor: colour, minWidth: width+"%", minHeight: height+"%", marginTop: "auto", borderWidth: 1, borderColor: "black"}} key={idx}><Text></Text></View>
    }

    render() {
        let s = this.props.data;
        return <View style={styles.body}>

            <View style={styles.graph}>
                {this.state.pingLog.map((x, idx)=>this.getBar(x,idx))}
            </View>
            <Text>{s.url}</Text>
            <View style={{flexDirection: "row", justifyContent: "space-evenly", alignSelf: "center"}}>
                <Padd>
                    <Text style={styles.text}>Min</Text>
                    <Text style={styles.text}>{this.state.pingStats.minMs} MS</Text>
                </Padd>
                <Padd>
                    <Text style={styles.text}>Avg</Text>
                    <Text style={styles.text}>{this.state.pingStats.avgMs} MS</Text>
                </Padd>
                <Padd>
                    <Text style={styles.text}>Max</Text>
                    <Text style={styles.text}>{this.state.pingStats.maxMs} MS</Text>
                </Padd>
            </View>
            <Text>Failures {this.state.pingStats.failures}/{this.state.pingStats.total}</Text>
        </View>
    }
}

const styles = StyleSheet.create({
    text:{
        textAlign: "center"
    },
    body:{
        flex: 1,
        alignSelf: "center",
        //justifyContent: "center",
        alignItems: "center",
        minWidth: "100%",
        minHeight: "100%",
        height: "auto",
        //paddingBottom: "35%"
    },
    graph:{
        flex: 1,
        alignItems: "flex-start",
        backgroundColor: "#888",
        flexDirection: "row",
        minWidth: "100%",
        //minHeight: "200%"
    }
});
