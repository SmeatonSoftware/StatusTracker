import {Component} from "react";
import {ScrollView, StyleSheet, View} from "react-native";
import NewService from "../components/newService";
import Services from "../components/services";

export default class Favourites extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <ScrollView style={styles.body}>
            <NewService refresh={this.props.refresh}/>
            <Services refresh={this.props.refresh} onlyFavs={true}/>
        </ScrollView>;
    }
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
        //alignSelf: "center",
        //justifyContent: "flex-start",
        //alignItems: "center",
        minWidth: "100%",
        maxWidth: "100%",
        //minHeight: "200%",
        //marginBottom: "100%"
    }
});
