import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    ImageBackground,
    StatusBar,
    Dimensions,
    Animated,
    TouchableOpacity,
    Image
} from "react-native";
import Modal from "react-native-modal";

const { width, height } = Dimensions.get('window');
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-community/async-storage';


const Configs = {
    ballSize: 100
}

class Game extends Component {

    constructor(props) {
        super(props);
        var RandomX = Math.floor(Math.random() * width - Configs.ballSize) + Configs.ballSize
        var RandomY = Math.floor(Math.random() * height - Configs.ballSize) + Configs.ballSize * 2
        this.state = {
            GRAVITY: 20,
            positionX: new Animated.Value(RandomX),
            positionY: new Animated.Value(RandomY),
            ballPosX: width / 2,
            ballPosY: height / 2,
            score: 0,
            isModalVisible: false,
            highScore: 0,
            playButton: true,
        }
        this.timer = 0;
    }

    componentWillMount = async() => {
        if ( await AsyncStorage.getItem('HIGHSCORE') == undefined ) {
            AsyncStorage.setItem('HIGHSCORE', 0)
        }

        this.setState({
            highScore: await AsyncStorage.getItem('HIGHSCORE')
        })
    }


    start = () => {
        var RandomX = Math.floor(Math.random() * width - Configs.ballSize) + Configs.ballSize
        var RandomY = Math.floor(Math.random() * height - Configs.ballSize) + Configs.ballSize * 2
        
        this.setState({
            positionX: new Animated.Value(RandomX),
            positionY: new Animated.Value(RandomY),
            ballPosX: width / 2,
            ballPosY: height / 2,
            score: 0,
            playButton: false,
            isModalVisible: false,
        });
        this.timer = setInterval(() => {
            this.update()
        }, 300)
    }

    update = () => {
        Animated.timing(this.state.positionY, {
            toValue: this.state.positionY._value - 80,
            duration: 300
        }).start()
        if ( this.state.positionY._value < -(height) ) {
            this.gameOver();
        }
        console.log("POSX", this.state.positionX._value)
        if ( this.state.positionX._value < Configs.ballSize ) {
            Animated.timing(this.state.positionX, {
                toValue: Configs.ballSize,
                duration: 100
            }).start()
        } else if ( this.state.positionX._value > width - Configs.BallSize ) {
            Animated.timing(this.state.positionX, {
                toValue: this.state.positionX._value - Configs.ballSize + 100,
                duration: 100
            }).start()
        }

    }

    gameOver = async() => {
        console.log("GAMEOVER");
        clearInterval(this.timer);
        if ( await AsyncStorage.getItem('HIGHSCORE') < this.state.score ) {
            // update high score
            AsyncStorage.setItem("HIGHSCORE", this.state.score);
            this.setState({
                highScore: this.state.score
            })
        }
        this.setState({
            isModalVisible: true
        });

    }

    ballPress = () => {
        this.setState({
            score: this.state.score + 1
        })
        var random = (Math.random() - 0.5) * width / 2
        console.log(random)
        Animated.timing(this.state.positionY, {
            toValue: this.state.positionY._value + 80,
            duration: 100
        }).start()
        Animated.timing(this.state.positionX, {
            toValue: this.state.positionX._value + random,
            duration: 100
        }).start()
    } 



    render() {
        return (
            <ImageBackground source={require('../assets/images/appBackground.jpg')} style={styles.container}>
                <StatusBar hidden={true} />

                <Modal 
                    isVisible={this.state.isModalVisible}
                >
                    <View style={styles.gameOverContainer}>
                        <View style={styles.header}>
                            <Text style={styles.headerText}>Game Over :(</Text>
                        </View>
                        <View style={styles.scoreContent}>
                            <Text style={styles.scoreText}>{ this.state.score }</Text>
                        </View>
                        <View style={styles.buttons}>
                            <TouchableOpacity style={{ flexDirection: 'row' }}>
                                <Icon name="space-shuttle" size={30} color="#E74C3C" />
                                <Text style={{ marginLeft: 10, fontFamily: 'FISHfingersOutline', fontSize: 30, color: '#E74C3C' }}>{ this.state.highScore }</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.start()}>
                                <Icon name="refresh" size={30} color="#E74C3C" />
                            </TouchableOpacity>
                          
                        </View>
                    </View>
                </Modal>

                <View style={styles.scoreBar}>
                <Text style={{ fontFamily: 'FISHfingersOutline', fontSize: 50, color: '#fff', textAlign: 'center', fontWeight: "bold" }}>{ this.state.score } </Text>
                </View>
                <Animated.View style={{ left: this.state.positionX, bottom: this.state.positionY }}>
                    <TouchableOpacity onPress={() => this.ballPress()} activeOpacity={0.6}>
                        <Image
                            source={require('../assets/images/ball-icon.png')}
                            style={styles.ball}
                        />
                    </TouchableOpacity>
                </Animated.View>

                { this.state.playButton == 1 ? (
                    <TouchableOpacity onPress={() => this.start()} style={{ position: 'relative', left: (width / 2) - 50, top: height / 2, backgroundColor: '#e74c3c', width: 100, height: 100, borderRadius: 50, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontFamily: 'FISHfingersOutline', color: '#fff', fontSize: 40 }}>PLAY</Text>
                </TouchableOpacity>
                ) : null }


            </ImageBackground>
        );
    }
}
export default Game;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        
    },
    ball: {
        width: 100,
        height: 100,
    },
    scoreBar: {
        padding: 10,
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    gameOverContainer: {
        backgroundColor: '#333',
        borderRadius: 20
    },
    header: {
        padding: 10,
        backgroundColor: '#E74C3C',
        justifyContent: 'center',
        alignItems: 'center',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    headerText: {
        fontFamily: 'FISHfingersOutline',
        color: '#FFF',
        fontSize: 40
    },
    scoreContent: {
        height: 100,
        backgroundColor: '#eee',
        justifyContent: 'center',
        alignItems: 'center'
    },
    scoreText: {
        fontFamily: 'FISHfingersOutline',
        fontSize: 80
    },
    buttons: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        padding: 15,
        justifyContent: 'space-between',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20
    }
});