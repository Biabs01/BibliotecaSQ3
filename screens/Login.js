import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity, Alert, KeyboardAvoidingView, TextInput, ImageBackground} from 'react-native';

const bgImage = require('../assets/background1.png');
const appIcon = require('../assets/appIcon.png');
const appName = require('../assets/appName.png');

export default class Login extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            email: '',
            password: ''
        };
    }

    handleLogin = (email, password) => {
        firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then(() => {
                this.props.navigation.navigate('BottomTab');
            })
            .catch(error => {
                Alert.alert(error.message);
            });
    }

    render(){
        const {email, password} = this.state;
        return(
            <KeyboardAvoidingView behavior='padding' style={styles.container}>
                <ImageBackground source={bgImage} style={styles.bgImage}>
                    <View style={styles.upperContainer}>
                        <Image source={appIcon} style={styles.appIcon}/>
                        <Image source={appName} style={styles.appName}/>
                    </View>
                    <View style={styles.lowerContainer}>
                        <TextInput
                            style={styles.textinput}
                            onChangeText={text => this.setState({email: text})}
                            placeholder={"Digite o endereço de e-mail"}
                            placeholderTextColor={'#FFFFFF'}
                            autoFocus
                        />
                        <TextInput
                            style={[styles.textinput, {marginTop: 20}]}
                            onChangeText={text => this.setState({password: text})}
                            placeholder={'Insira a senha'}
                            placeholderTextColor={'#FFFFFF'}
                            secureTextEntry
                        />
                        <TouchableOpacity
                            style={[styles.button, {marginTop: 20}]}
                            onPress={() => this.handleLogin(email, password)}
                        >
                            <Text style={styles.scanbuttonText}>Entrar</Text>
                        </TouchableOpacity>
                    </View>
                </ImageBackground>
            </KeyboardAvoidingView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    },
    bgImage: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center'
    },
    upperContainer: {
        flex: 0.5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    appIcon: {
        width: 280,
        height: 280,
        resizeMode: 'contain',
        marginTop: 80
    },
    appName: {
        width: 130,
        height: 130,
        resizeMode: 'contain'
    },
    lowerContainer: {
        flex: 0.5,
        alignItems: 'center'
    },
    textinput:{
        width: '75%',
        height: 55,
        padding: 10,
        borderWidth: 4,
        borderRadius: 10,
        borderColor: '#FFFFFF',
        fontSize: 18,
        color: '#FFFFFF',
        backgroundColor: '#5653d4'
    },
    button: {
        width: '43%',
        height: 55,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#9DFD24',
        borderRadius: 15
    },
    scanbuttonText: {
        fontSize: 24,
        color: '#FFFFFF'
    }
})