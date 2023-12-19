import APIRequest from "./request";
import {Component} from "react";
import {View, Text, TextInput, Button} from "react-native";
import Storage from 'react-native-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {theme} from "../theme";


export default class Authentication extends Component{
    static Identity = null
    static StorageManager = new Storage({
        size: 1000,
        defaultExpires: 1000 * 3600 * 24 * 30,
        enableCache: true,

        storageBackend: window == null ? AsyncStorage : window.localStorage,
        sync: {}
    });

    constructor(props) {
        super(props);

        this.state = {
            identity: {Email: "", Password: ""}, hasAuth: false, errorText: ""
        };
    }

    componentDidMount() {
        let that = this;

        if (Authentication.Identity!=null){
            that.setState({identity: Authentication.Identity, hasAuth: true});
        }

        Authentication.StorageManager.load({key: "identity"})
            .then(d=>{
                that.LoadIdentity(d);
            })
            .catch(d=> {
            })
    }

    componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS) {
        console.log(this.state.identity);
        if (this.state.identity != prevState.identity){
            Authentication.Identity = this.state.identity;
            Authentication.StorageManager.save({key: "identity", data: this.state.identity});
        }
    }

    render() {
        return this.state.good ?
            <View>
                {this.props.children}
            </View>
            :
            <View>
                <Text>No Auth</Text>
                <TextInput onChangeText={x => this.setState({identity:{...this.state.identity,Email: x}})} style={{backgroundColor: theme.bgSecondary}}/>
                <TextInput onChangeText={x => this.setState({identity:{...this.state.identity,Password: x}})} style={{backgroundColor: theme.bgSecondary}}/>
                <Button color={theme.buttonPrimary} title={"Login"} onPress={x=>this.SignIn()}/>
                <Button color={theme.buttonPrimary} title={"Signup"} onPress={x=>this.SignUp()}/>
                <Text>{this.state.errorText}</Text>
            </View>;
    }

    async SignUp(){
        let that = this;

        let r = new APIRequest("auth/signup", that.state.identity, "POST");

        await r.executeWithCallback(
            (d) => {
                that.setState({identity: d.data, good: true});
            },
            (d) => {
                that.setState({errorText: d.message});
            },
            true,
            {}
        );


    }

    async SignIn(){
        let that = this;

        let r = new APIRequest("auth/signin", that.state.identity, "POST");

        await r.executeWithCallback(
            (d) => {
                that.setState({identity: d.data, good: true});
            },
            (d) => {
                that.setState({errorText: d.message});
            },
            true,
            {}
        );

    }

    async LoadIdentity(_identity) {
        let that = this;

        let r = new APIRequest("auth/check", "", "GET");

        await r.executeWithCallback(
            (d) => {
                that.setState({identity: _identity, good: true});
            },
            (d) => {
            },
            true,
            {
                id: _identity.Id,
                key: _identity.CookieKey
            }
        );
    }
}
