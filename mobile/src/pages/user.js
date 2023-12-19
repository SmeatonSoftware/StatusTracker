import {Component} from "react";
import {View, Text} from "react-native";
import Authentication from "../services/authentication";

export default class User extends Component{
    render() {
        return <View>
            <Text>{Authentication.Identity.Email}</Text>
        </View>;
    }
}
