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
import ProgressBar from "./src/components/progressBar";
import Padd from "./src/components/padd";
import {Component} from "react";
import APIRequest from "./src/services/request";
import Services from "./src/components/services";
import NewService from "./src/components/newService";
import {theme} from "./src/theme";

import Trackers from "./src/pages/trackers";
import {
    AntDesign,
    Entypo,
    Feather,
    FontAwesome5,
    Fontisto,
    Foundation,
    MaterialCommunityIcons
} from "@expo/vector-icons";
import Home from "./src/pages/home";
import Authentication from "./src/services/authentication";
import Settings from "./src/pages/settings";

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
                p = <Authentication><Trackers refresh={()=>this.refresh(this)}/></Authentication>;
                break;

            case "user":
                p = <Authentication><Settings refresh={()=>this.refresh(this)}/></Authentication>;
                break;
        }

        this.setState({pageObj: p});
    }

    render() {
        return (
            <View style={styles.outer}>
                <StatusBar style="light"/>
                <View style={{...styles.container, marginTop: StatusBarManager != null ? StatusBarManager.HEIGHT : 0}} >
                    <View style={styles.topBar}>
                        <Text style={{fontSize: 30, fontWeight: "bold", color: theme.textSecondary}}>Status Tracker</Text>
                    </View>
                    <ScrollView style={{minWidth: "100%"}} showsVerticalScrollIndicator={false}>
                        {this.state.pageObj}
                    </ScrollView>
                </View>

                <View style={styles.footer}>
                    <TouchableHighlight onPress={x=>this.setState({page: ""})} style={styles.navBox}>
                        <View style={styles.navBoxInner}>
                            <Entypo name="home" size={55} color={theme.textPrimary}/>
                            <Text style={styles.navText}>Services</Text>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight onPress={x=>this.setState({page: "trackers"})} style={styles.navBox}>
                        <View style={styles.navBoxInner}>
                            <Entypo name="heart" size={50} color={theme.textPrimary}/>
                            <Text style={styles.navText}>Likes</Text>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight onPress={x=>this.setState({page: "user"})} style={styles.navBox}>
                        <View style={styles.navBoxInner}>
                            <FontAwesome5 name="cog" size={50} color={theme.textPrimary}/>
                            <Text style={styles.navText}>Settings</Text>
                        </View>
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
    navText:{
        color: theme.textPrimary,
        fontWeight: "bold",
        fontSize: 20
    },
    navBoxInner:{
        alignItems: "center",
        marginTop: "auto"
    },
    navBox:{
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
    topBar:{
        //flex: 1,
        minWidth: "100%",
        alignItems: "center",
        marginBottom: "5%"
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
