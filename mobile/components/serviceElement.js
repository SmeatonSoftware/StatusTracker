import {Component} from "react";
import {ScrollView, View, Text, StyleSheet, Button} from "react-native";
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
        let r = new APIRequest("pings/recent?service="+this.props.data.Id+"&small=true&count=50", "", "GET")

        await r.executeWithCallback(
            (d)=> {
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
                that.setState({pingStats: d.data});
            },
            (d)=> {console.log(d)},
            true,
            {}
        );
    }

    async delete(){
        let that = this;
        let r = new APIRequest("services/delete?service="+this.props.data.Id, "", "DELETE")

        await r.executeWithCallback(
            (d)=> {
                document.location.reload();
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
        let log = this.state.pingLog;

        let msDiff = (Math.max(...log) + 20 - Math.min(...log));

        let height = (x-Math.min(...log) + 10) / msDiff * 100;
        let width = 1/log.length*100;

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
            <View style={{flexDirection: "row", justifyContent: "center", alignSelf: "center", maxWidth: "100%"}}>
                <Padd style={styles.padd}>
                    <Text style={styles.text}>Min</Text>
                    <Text style={styles.text}>{this.state.pingStats.minMs} MS</Text>
                </Padd>
                <Padd style={styles.padd}>
                    <Text style={styles.text}>Avg</Text>
                    <Text style={styles.text}>{this.state.pingStats.avgMs} MS</Text>
                </Padd>
                <Padd style={styles.padd}>
                    <Text style={styles.text}>Max</Text>
                    <Text style={styles.text}>{this.state.pingStats.maxMs} MS</Text>
                </Padd>
                <Padd style={styles.padd}>
                    <Text style={styles.text}>Errors</Text>
                    <Text style={styles.text}>{this.state.pingStats.failures}/{this.state.pingStats.total}</Text>
                </Padd>
            </View>
            <Padd>
                <Button title={"Delete"} style={{minWidth: "100%"}} onPress={x=>this.delete()}/>
            </Padd>
        </View>
    }
}

const styles = StyleSheet.create({
    padd:{
        minWidth: "50%"
    },
    text:{
        textAlign: "center"
    },
    body:{
        flex: 1,
        alignSelf: "center",
        //justifyContent: "center",
        alignItems: "center",
        minWidth: "100%",
        minHeight: 200,
        // minHeight: "100%",
        // height: "auto",
        //paddingBottom: "35%"
        paddingBottom: "2%"
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
