import APIRequest from "./request";
import {Component} from "react";
import {View, Text, TextInput} from "react-native";

export default class Authentication extends Component{
    static Identity = {};

    constructor(props) {
        super(props);

        this.state = {
            identity: {}, good: false
        };
    }

    componentDidMount() {
        this.LoadIdentity();
    }

    componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS) {
        console.log(this.state.identity);
        if (this.state.identity != prevState.identity){
            Authentication.Identity = this.state.identity;
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
            </View>;
    }

    LoadOrDefaultIdentity(){
        return {
            Id: -1,
            CookieKey: "",
            Username: "Test"
        };
    }

    async LoadIdentity(){
        let that = this

        let iden = this.LoadOrDefaultIdentity();

        let r = new APIRequest("auth/confirm", iden, "POST")

        let _d = {};

        await r.executeWithCallback(
            (d)=>{
                that.setState({identity: iden, good: true});
            },
            (d)=>{
                switch (d.status){
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
