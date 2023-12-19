import {Component} from "react";
import {StyleSheet, View} from "react-native";

export default class Padd extends Component {

    render() {
        return <View style={{...styles.pad, ...this.props.style}}>
            {this.props.children}
        </View>
    }
}

const styles = StyleSheet.create({
    pad: {
        margin: 5,
        minWidth: "100%"
    }
});
