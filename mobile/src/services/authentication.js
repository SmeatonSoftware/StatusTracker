import APIRequest from "./request";
import {Component} from "react";
import {View, Text, TextInput, Button} from "react-native";
import Storage from 'react-native-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {theme} from "../theme";


export default class Authentication extends Component{
    static Identity = {};
    static StorageManager = new Storage({
        size: 1000,
        defaultExpires: 1000 * 3600 * 24 * 30,
        enableCache: true,

        storageBackend: window == null ? AsyncStorage : window.localStorage,


        // if data was not found in storage or expired data was found,
        // the corresponding sync method will be invoked returning
        // the latest data.
        sync: {
            // we'll talk about the details later.
        }
    });

    constructor(props) {
        super(props);

        this.state = {
            identity: {Username: ""}, hasAuth: false
        };
    }

    componentDidMount() {
        let that = this;
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
            console.log(this.state.identity);
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
                <TextInput onChangeText={x => this.setState({identity:{Username: x}})} style={{backgroundColor: theme.bgSecondary}}/>
                <Button color={theme.buttonPrimary} title={"Login"} onPress={x=>this.LoadIdentity()}/>
            </View>;
    }

    async LoadIdentity(_identity) {
        let that = this;

        console.log(_identity);

        let r = new APIRequest("auth/confirm", _identity, "POST");

        await r.executeWithCallback(
            (d) => {
                that.setState({identity: _identity, good: true});
            },
            (d) => {
                switch (d.status) {
                    case 201:
                        that.setState({identity: d.data, good: true});

                        break;

                    case 401:
                        that.setState({identity: null, good: false});

                        break;
                }
                console.warn(d)
            },
            true,
            {}
        );
    }
}
