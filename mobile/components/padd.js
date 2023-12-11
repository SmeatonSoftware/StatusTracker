import {Component} from "react";
import {Text, View} from "react-native";

export default class Padd extends Component{

    render() {
        return <View style={{margin: 5}}>
            {this.props.children}
        </View>
    }
}
