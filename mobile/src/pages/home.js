import {Component} from "react";
import {StyleSheet, View} from "react-native";
import Services from "../components/services";

export default class Home extends Component {
    render() {
        return <View style={styles.body}>
            <Services refresh={this.props.refresh} onlyFavs={false}/>
        </View>;
    }
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
        alignSelf: "center",
        justifyContent: "flex-start",
        alignItems: "center",
        minWidth: "100%",
        maxWidth: "100%",
        marginBottom: "100%"
    }
})
