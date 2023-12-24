import {Component} from "react";
import {StyleSheet, Text, TouchableHighlight, View} from "react-native";
import APIRequest from "../services/request";
import Padd from "./padd";
import {theme} from "../theme";
import Authentication from "../services/authentication";
import {Feather, FontAwesome} from "@expo/vector-icons";

export default class ServiceElement extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: props.data,
            pingLog: [],
            pingStats: {
                minMs: 0,
                maxMs: 0,
                avgMs: 0,
                failures: 0,
                total: 0
            },
            confirmDelete: false
        }
    }

    async refreshLog() {
        let that = this;
        let r = new APIRequest("pings/recent?service=" + this.props.data.Id + "&small=true&count=50", "", "GET")

        await r.executeWithCallback(
            (d) => {
                that.setState({pingLog: d.data.log, pingStats: d.data.stats});
            },
            (d) => {
                console.log(d)
            },
            true,
            {}
        );
    }

    async favourite() {
        let that = this;
        let r = new APIRequest("services/togfav?service=" + this.state.data.Id, "", "PUT")

        await r.executeWithCallback(
            (d) => {
                //this.props.refresh();
                that.setState({data: {...that.state.data, isFav: d.data.favourite}})
            },
            (d) => {
                console.log(d)
            },
            true,
            {}
        );
    }

    deleteStart() {
        this.setState({confirmDelete: true});
    }

    deleteCancel() {
        this.setState({confirmDelete: false});
    }

    async delete() {
        let that = this;
        let r = new APIRequest("services/delete?service=" + this.state.data.Id, "", "DELETE")

        await r.executeWithCallback(
            (d) => {
                this.props.refresh();
            },
            (d) => {
                console.log(d)
            },
            true,
            {}
        );
    }

    async componentDidMount() {
        await this.refreshLog();
    }

    getBar(x, idx) {
        let log = this.state.pingLog;

        let height = 100;
        let width = 1 / log.length * (100 - (1 * log.length));

        let colour = x == -1 ? "red" : "green";

        return <View style={{
            backgroundColor: colour,
            minWidth: width + "%",
            minHeight: height + "%",
            marginTop: "auto",
            borderWidth: 2,
            borderColor: "black",
            borderRadius: 5,
            marginLeft: "0.5%",
            marginRight: "0.5%"
        }} key={idx}><Text></Text></View>
    }

    dateStrFromTicks(ticks) {
        let ticksToMicrotime = ticks / 10000;
        let epochMicrotimeDiff = Math.abs(new Date(0, 0, 1).setFullYear(1));
        let date = new Date(ticksToMicrotime - epochMicrotimeDiff);

        return date.toLocaleDateString() + " @ " + date.toLocaleTimeString();
    }

    render() {
        let s = this.state.data;
        let anyErrors = this.state.pingLog.some(x => x == -1);
        return <View style={styles.body}>
            <Text style={{fontWeight: "bold", fontSize: 20, ...styles.text}}>
                {
                    anyErrors ?
                        <Feather name={"x-circle"} size={20} color={theme.danger}/>
                        :
                        <FontAwesome name={"check-circle"} size={20} color={theme.success}/>
                }
                <Text> {s.url}</Text>
            </Text>
            <View style={{flexDirection: "row", justifyContent: "space-evenly", alignSelf: "center", minWidth: "100%"}}>
                <Padd style={styles.padd}>
                    <Text style={styles.text}>Showing Since</Text>
                    <Text style={styles.text}>{this.dateStrFromTicks(this.state.pingStats.oldest)}</Text>
                </Padd>
                <Padd style={styles.padd}>
                    <Text style={styles.text}>Time Between Pings</Text>
                    <Text style={styles.text}>{s.runFrequency}</Text>
                </Padd>
                {/*<Padd style={styles.padd}>*/}
                {/*    <Text style={styles.text}>Failures</Text>*/}
                {/*    <Text style={styles.text}>{this.state.pingStats.failures}/{this.state.pingStats.total}</Text>*/}
                {/*</Padd>*/}
            </View>
            <View style={styles.graph}>
                {this.state.pingLog.map((x, idx) => this.getBar(x, idx))}
            </View>
            {
                Authentication.Identity != null ?
                    <Padd style={{
                        paddingTop: 10,
                        paddingBottom: 10,
                        flexDirection: "row",
                        justifyContent: "space-evenly",
                        minWidth: "100%"
                    }}>
                        <View style={{minWidth: "49%", alignItems: "center"}}>
                            <TouchableHighlight onPress={x => this.favourite()} style={styles.navBox}>
                                <FontAwesome name={s.isFav ? "heart" : "heart-o"} size={30} color={theme.textPrimary}/>
                            </TouchableHighlight>
                        </View>
                        <View style={{minWidth: "2%"}}/>
                        <View style={{minWidth: "49%", alignItems: "center"}}>
                            {Authentication.Identity.Id == s.identityCreated ?
                                this.state.confirmDelete ?
                                    <View style={{
                                        flexDirection: "row",
                                        justifyContent: "space-evenly",
                                        minWidth: "100%"
                                    }}>
                                        <TouchableHighlight onPress={x => this.delete()} style={styles.navBox}>
                                            <Feather name="check-circle" size={30} color={theme.textPrimary}/>
                                        </TouchableHighlight>
                                        <TouchableHighlight onPress={x => this.deleteCancel()} style={styles.navBox}>
                                            <Feather name="x-circle" size={30} color={theme.textPrimary}/>
                                        </TouchableHighlight>
                                    </View> :
                                    <TouchableHighlight onPress={x => this.deleteStart()} style={styles.navBox}>
                                        <FontAwesome name="trash" size={30} color={theme.textPrimary}/>
                                    </TouchableHighlight>
                                : null
                            }

                        </View>
                    </Padd>
                    : null
            }
        </View>
    }
}

const styles = StyleSheet.create({
    padd: {
        minWidth: "20%"
    },
    text: {
        textAlign: "center",
        color: theme.textPrimary
    },
    body: {
        flex: 1,
        alignSelf: "center",
        //justifyContent: "center",
        alignItems: "center",
        minWidth: "100%",
        //minHeight: 130,
        // minHeight: "100%",
        // height: "auto",
        //paddingBottom: "35%",
        marginBottom: "1%"
    },
    graph: {
        flex: 1,
        alignItems: "flex-start",
        backgroundColor: theme.bgGraph,
        flexDirection: "row",
        minWidth: "100%",
        paddingTop: "0.5%",
        paddingBottom: "0.5%",
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "black",
        minHeight: 30
    },
    navText: {
        color: theme.textPrimary,
        fontWeight: "bold",
        fontSize: 20
    },
    navBoxInner: {
        alignItems: "center",
        marginTop: "auto"
    },
    navBox: {
        width: "21%",
        minHeight: "100%",
        alignItems: "center",
        // shadowColor: '#171717',
        // shadowOffset: {width: 0, height: 1},
        // shadowOpacity: 0.5,
        // shadowRadius: 4,
        // borderColor: "white",
        // borderWidth: 1,
        // borderRadius: 5,
        padding: 3
    },
});
