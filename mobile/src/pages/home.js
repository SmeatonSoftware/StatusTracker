import {Component} from "react";
import {View} from "react-native";
import Services from "../components/services";

export default class Home extends Component {
    render() {
        return <View>
            <Services refresh={this.props.refresh} onlyFavs={true}/>
        </View>;
    }
}
