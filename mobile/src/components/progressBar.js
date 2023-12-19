import {Component} from "react";
import {Text, View} from "react-native";

export default class ProgressBar extends Component {

    render() {
        return <View style={{alignItems: "center"}}>
            <View style={{
                flexDirection: "row",
                minWidth: "100%",
                height: 20,
                borderColor: "black",
                borderWidth: 2,
                borderRadius: 2,
                borderStyle: "solid"
            }}>
                <View style={{backgroundColor: "green", flex: this.props.progress}}/>
                <View style={{backgroundColor: "lightgray", flex: 1 - this.props.progress}}/>
            </View>
            <Text>{this.props.progress * 100}{this.props.children}</Text>
        </View>
    }
}
