import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity, Alert, KeyboardAvoidingView, TextInput, ImageBackground} from 'react-native';

export default class Login extends React.Component{
    render(){
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

})