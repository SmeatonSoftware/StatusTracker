import { StatusBar } from 'expo-status-bar';
import {
    Button,
    Dimensions,
    NativeModules,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableHighlight,
    View
} from 'react-native';
import ProgressBar from "./components/progressBar";
import Padd from "./components/padd";
import {Component} from "react";
import APIRequest from "./components/request";
import Services from "./components/services";
import NewService from "./components/newService";
import {theme} from "./components/theme";

import Trackers from "./pages/trackers";
import Info from "./pages/info";
import Ionicons from "@expo/vector-icons/Ionicons";
import {Entypo} from "@expo/vector-icons";
import Home from "./pages/home";

const { StatusBarManager } = NativeModules;

export default class App extends Component{
    constructor(props) {
        super(props);

        this.state = {page: "" , pageObj: null,smeatonStatus: {UpForMS: 0}};
    }

    componentDidMount() {
        this.setPage();
    }

    componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS) {
        if (this.state.page != prevState.page) {
            this.setPage();
        }
    }

    refresh(that){
        that.setState({pageObj: <View></View>});
        setTimeout(x=>that.setPage(), 1000);
    }

    setPage(){
        let p = <View></View>
        switch (this.state.page){
            default:
                p = <Home refresh={()=>this.refresh(this)}/>
                break;

            case "trackers":
                p = <Trackers refresh={()=>this.refresh(this)}/>;
                break;

            case "info":
                p = <Info refresh={()=>this.refresh(this)}/>;
                break;
        }

        this.setState({pageObj: p});
    }

    render() {
        return (
            <View style={styles.outer}>
                <StatusBar style="light"/>
                <View style={{...styles.container, marginTop: StatusBarManager.HEIGHT}} >
                    <View style={styles.topBar}>
                        <Text style={{fontSize: 30, fontWeight: "bold", color: theme.textSecondary}}>Status Tracker</Text>
                    </View>
                    <ScrollView style={{minWidth: "100%"}} showsVerticalScrollIndicator={false}>
                        {this.state.pageObj}
                    </ScrollView>
                </View>

                <View style={styles.footer}>
                    <TouchableHighlight onPress={x=>this.setState({page: "trackers"})} style={styles.navBox}>
                        <Entypo name="bar-graph" size={50} color={theme.textPrimary}/>
                    </TouchableHighlight>
                    <TouchableHighlight onPress={x=>this.setState({page: "info"})} style={styles.navBox}>
                        <Entypo name="info-with-circle" size={50} color={theme.textPrimary}/>
                    </TouchableHighlight>
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
    navBox:{
        width: "47%",
        alignItems: "center",
        shadowColor: '#171717',
        shadowOffset: {width: 3, height: 5},
        shadowOpacity: 0.5,
        shadowRadius: 4,
        borderColor: "white",
        borderWidth: 1,
        borderRadius: 5,
        padding: 3
    },
    topBar:{
        //flex: 1,
        minWidth: "100%",
        alignItems: "center"
    },
    outer:{
        flex: 1,
        backgroundColor: theme.bgVoid,
        alignItems: 'center',
        justifyContent: 'center'
    },
    container: {
        flex: 1,
        backgroundColor: theme.bgPrimary,
        color: theme.textPrimary,
        alignItems: 'center',
        //justifyContent: 'center',
        //aspectRatio: tarAspect,
        maxHeight: windowHeight,
        maxWidth: windowHeight * tarAspect,
        minWidth: windowHeight * tarAspect,
        padding: 10
        //overflowY: "scroll",
    },
    footer:{
        position: "absolute",
        bottom: 0,
        backgroundColor: theme.bgSecondary,
        minWidth: windowHeight * tarAspect,
        minHeight: "5%",
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
        padding: "1%"
    }
});
