import React, { Component } from "react";
import { 
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Animated
} from "react-native";

class Ball extends Component {
    render() {
        return (
            <Animated.View style={{ left: this.props.positionX, bottom: this.props.positionY }}>
                <TouchableOpacity onPress={() => this.props.onPress()} activeOpacity={0.6}>
                <Image 
                    source={require('../../assets/images/ball-icon.png')}
                    style={styles.ball}
                />
            </TouchableOpacity>
            </Animated.View>
        );
    }
}
export default Ball;

const styles = StyleSheet.create({
    container: {
        position: 'absolute'
    },
    ball: {
        width: 100,
        height: 100,
    }
});