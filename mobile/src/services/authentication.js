import APIRequest from "./request";
import {Component} from "react";
import {Button, StyleSheet, Text, TextInput, View} from "react-native";
import Storage from 'react-native-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {theme} from "../theme";
import Padd from "../components/padd";


export default class Authentication extends Component {
    static Identity = null
    static StorageManager = new Storage({
        size: 1000,
        defaultExpires: 1000 * 3600 * 24 * 30,
        enableCache: true,

        storageBackend: window.location == null ? AsyncStorage : window.localStorage,
        sync: {}
    });

    constructor(props) {
        super(props);

        this.state = {
            identity: {Email: "", Password: ""}, hasAuth: null, errorText: ""
        };
    }

    componentDidMount() {
        let that = this;

        if (Authentication.Identity != null) {
            that.setState({identity: Authentication.Identity, hasAuth: true});
            return;
        }

        Authentication.StorageManager.load({key: "identity"})
            .then(d => {
                that.LoadIdentity(d);
            })
            .catch(d => {
                that.setState({hasAuth: false});
            })
    }

    shouldComponentUpdate(nextProps: Readonly<P>, nextState: Readonly<S>, nextContext: any): boolean {
        if (this.state.identity != nextState.identity) {
            Authentication.Identity = nextState.identity;
            Authentication.StorageManager.save({key: "identity", data: nextState.identity});
        }
        return true;
    }

    render() {
        return this.state.hasAuth == null ?
            <View>

            </View>
            :
            this.state.hasAuth ?
            <View>
                {this.props.children}
            </View>
            :
            <View style={styles.body}>
                <Padd style={{alignItems: "center", minWidth: "100%"}}>
                    <Text style={styles.text}>Email</Text>
                    <TextInput style={styles.input} value={this.state.identity.Email}
                               onChangeText={x => this.setState({identity: {...this.state.identity, Email: x}})}/>
                </Padd>
                <Padd style={{alignItems: "center", minWidth: "100%"}}>
                    <Text style={styles.text}>Password</Text>
                    <TextInput secureTextEntry={true} style={styles.input} value={this.state.identity.Password}
                               onChangeText={x => this.setState({identity: {...this.state.identity, Password: x}})}/>
                </Padd>
                <Padd style={{
                    paddingTop: 10,
                    paddingBottom: 10,
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                    minWidth: "100%"
                }}>
                    <View style={{minWidth: "49%"}}>
                        <Button color={theme.buttonPrimary} title={"Login"} onPress={x => this.SignIn()}/>
                    </View>
                    <View style={{minWidth: "1%"}}/>
                    <View style={{minWidth: "49%"}}>
                        <Button color={theme.buttonPrimary} title={"Signup"} onPress={x => this.SignUp()}/>
                    </View>
                </Padd>
                <Text style={{...styles.text, color: theme.danger}}>{this.state.errorText}</Text>
            </View>;
    }

    async SignUp() {
        let that = this;

        let r = new APIRequest("auth/signup", that.state.identity, "POST");

        await r.executeWithCallback(
            (d) => {
                that.setState({identity: d.data, hasAuth: true});
            },
            (d) => {
                that.setState({errorText: d.message, hasAuth: false});
            },
            true,
            {}
        );
    }

    async SignIn() {
        let that = this;

        let r = new APIRequest("auth/signin", that.state.identity, "POST");

        await r.executeWithCallback(
            (d) => {
                that.setState({identity: d.data, hasAuth: true});
            },
            (d) => {
                that.setState({errorText: d.message, hasAuth: false});
            },
            true,
            {}
        );
    }

    async LoadIdentity(_identity) {
        let that = this;

        //console.warn(_identity);

        let r = new APIRequest("auth/check", "", "GET");

        await r.executeWithCallback(
            (d) => {
                Authentication.Identity = _identity;
                that.setState({identity: _identity, hasAuth: true});
            },
            (d) => {
                that.setState({hasAuth: false});
            },
            true,
            {
                id: _identity != null ? _identity.Id : "",
                key: _identity != null ? _identity.CookieKey : ""
            }
        );
    }
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
        paddingTop: "45%",
        minWidth: "100%",
        justifyContent: "center",
        alignItems: "center"
    },
    text: {
        fontSize: 20,
        color: theme.textPrimary,
        fontWeight: "bold"
    },
    input: {
        backgroundColor: theme.bgSecondary,
        color: theme.textPrimary,
        borderWidth: 1,
        borderColor: "black",
        borderRadius: 5,
        minWidth: "100%",
        padding: 10
    }
});
