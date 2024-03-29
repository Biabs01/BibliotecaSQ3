import React, {Component} from 'react';
import {View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView} from 'react-native';
import * as Permissions from 'expo-permissions';
import { BarCodeScanner } from 'expo-barcode-scanner';
import db from '../config';

export default class TransactionsScreen extends Component{
    constructor(props){
        super(props);
        this.state = {
            bookId: '',
            studentId: '',
            bookName: '',
            studentName: '',
            domState: 'normal',
            hasCameraPermissions: null,
            scanned: false,
            scannedData: ''
        };
    }

    getCameraPermissions = async domState =>{
        const {status} = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({
            hasCameraPermissions: status === 'granted',
            domState: domState,
            scanned: false
        });
    }

    handleBarCodeScanned = async ({type, data}) => {
        const {domState} = this.state;

        if(domState === 'bookId'){
            this.setState({
                bookId: data,
                domState: 'normal',
                scanned: true
            });
        } else if(domState === 'studentId'){
            this.setState({
                studentId: data,
                domState: 'normal',
                scanned: true
            });
        }
    }

    getBookDetails = async bookId => {
        bookId = bookId.trim();
        db.collection('books')
            .where("book_id", "==", bookId)
            .get()
            .then(snapshot => {
                snapshot.docs.map(doc => {
                    this.setState({
                        bookName: doc.data().book_details.book_name
                    });
                });
            });
    }

    getStudentDetails = async studentId => {
        studentId = studentId.trim();
        db.collection('students')
            .where("student_id", "==",studentId)
            .get()
            .then(snapshot => {
                snapshot.docs.map(doc => {
                    this.setState({
                        studentName: doc.data().student_details.student_name
                    });
                });
            });
    } 
        
    initiateBookIssue = async (bookId, studentId, bookName, studentName) => {
        db.collection("transactions").add({
            student_id: studentId,
            student_name: studentName,
            book_id: bookId,
            book_name: bookName,
            date: firebase.firestore.Timestamp.now().toDate(),
            tranction_type: "issue"
        });

        db.collection("books")
            .doc(bookId)
            .update({
                is_book_avaibility: false
            });
        
        db.collection("students")
            .doc(studentId)
            .update({
                number_of_books_issued: firebase.firestore.FieldValue.increment(1)
            });

        this.setState({
            bookId: '',
            studentId: ''
        });
    }

    initiateBookReturn = async (bookId, studentId, bookName, studentName) => {
        db.collection("transactions").add({
            student_id: studentId,
            student_name: studentName,
            book_id: bookId,
            book_name: bookName,
            date: firebase.firestore.Timestamp.now().toDate(),
            tranction_type: "return"
        });

        db.collection("books")
            .doc(bookId)
            .update({
                is_book_avaibility: true
            });
        
        db.collection("students")
            .doc(studentId)
            .update({
                number_of_books_issued: firebase.firestore.FieldValue.increment(-1)
            });

        this.setState({
            bookId: '',
            studentId: ''
        });
    }

    checkBookAvailability = async bookId => {
        const bookRef = await db
            .collection("books")
            .where("book_id", '==', bookId)
            .get();

        var transactionType = '';
        if(bookRef.docs.lenght == 0){
            transactionType = false;
        } else {
            bookRef.docs.map(doc => {
                transactionType = doc.data().is_book_avaibility ? "issue" : "return";
            });
        }

        return transactionType;
    }

    checkStudentAvailability = async studentId => {
        const studentRef = await db
            .collection("students")
            .where("student_id", "==", studentId)
            .get();

        var isStudentEligible = '';
        if(studentRef.docs.lenght == 0){
            this.setState({
                bookId: '',
                studentId: ''
            });
            isStudentEligible = false;
            Alert.alert("O id do aluno não existe na base de dados da biblioteca");
        } else {
            studentRef.docs.map(doc => {
                if(doc.data().number_of_books_issued < 2){
                    isStudentEligible = true;
                } else {
                    this.setState({
                        bookId: '',
                        studentId: ''
                    });
                    isStudentEligible = false;
                    Alert.alert("O aluno já retirou dois livros!");
                }
            });
        }
        return isStudentEligible;
    }

    checkStudentAvailabilityForBookReturn = async (bookId, studentId) => {
        const transactionRef = await db
            .collection("transactions")
            .where("book_id", "==", bookId)
            .limit(1)
            .get()

        isStudentEligible = '';
        transactionRef.docs.map(doc => {
            var lastBookTransaction = doc.data();
            if(lastBookTransaction.student_id === studentId){
                isStudentEligible = true;
            } else {
                isStudentEligible = false;
                Alert.alert("O livro não foi retirado por este aluno!");
                this.setState({
                    bookId: '',
                    studentId: ''
                });
            }
        });
        return isStudentEligible;
    }

    handleTransaction = async () => {
        var {bookId, studentId} = this.state;
        await this.getBookDetails(bookId);
        await this.getStudentDetails(studentId);

        var transactionType = await this.checkBookAvailability(bookId);

        if(!transactionType){
            this.setState({
                bookId: '',
                studentId: ''
            });
            Alert.alert("O livro não existe na base de dados da biblioteca!");
        }
        else if(transactionType == 'issue'){
            var isEligible = await this.checkStudentAvailability(studentId);

            if(isEligible){
                var {bookName, studentName} = this.state;
                this.initiateBookIssue(bookId, studentId, bookName, studentName);
                Alert.alert("Livro entregue para o aluno!"); 
            }
            
        } else {
            var isEligible = await this.checkStudentAvailabilityForBookReturn(bookId, studentId);

            if(isEligible){
                var {bookName, studentName} = this.state;
                this.initiateBookReturn(bookId, studentId, bookName, studentName);
                Alert.alert("Livro retornado à biblioteca!");
            }     
        }
    }

    render(){
        const {bookId, studentId, domState, scanned} = this.state;
        if(domState !== 'normal'){
            return (
                <BarCodeScanner
                    onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
                    style={StyleSheet.absoluteFillObject}
                />
            );
        }
        return(
            <KeyboardAvoidingView behavior='padding' style={styles.container}>
                <Text style={styles.text}>
                    {hasCameraPermissions ? scannedData : "Solicitar permissão da Câmera"}
                </Text>
                <View style={styles.lowerContainer}>
                    <View style={styles.textinputContainer}>
                        <TextInput
                            style={styles.textinput}
                            placeholder={'Id do Livro'}
                            placeholderTextColor={"#FFFFFF"}
                            value={bookId}
                        />
                        <TouchableOpacity
                            style={styles.scanbutton}
                            onPress={() => this.getCameraPermissions("bookId")}
                        >
                            <Text style={styles.scanbuttonText}>
                                Scanear
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.textinputContainer, {marginTop: 25}]}>
                        <TextInput
                            style={styles.textinput}
                            placeholder={'Id do Aluno'}
                            placeholderTextColor={"#FFFFFF"}
                            value={studentId}
                        />
                        <TouchableOpacity
                            style={styles.scanbutton}
                            onPress={() => this.getCameraPermissions("studentId")}
                        >
                            <Text style={styles.scanbuttonText}>
                                Scanear
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                        style={[styles.scanbutton, {marginTop: 25}]}
                        onPress={this.handleTransaction}
                    >
                        <Text style={styles.scanbuttonText}>Enviar</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#5653D4'
    },
    text: {
        color: '#FFFFFF',
        fontSize: 30
    },
    lowerContainer: {
        flex: 0.5,
        alignSelf: 'center'
    },
    textinputContainer: {
        borderWidth: 2,
        borderRadius: 10,
        borderColor: '#FFFFFF',
        flexDirection: 'row',
        backgroundColor: '#9dfd24'
    },
    textinput: {
        width: '75%',
        height: 50,
        padding: 10,
        borderColor: '#FFFFFF',
        borderRadius: 10,
        borderWidth: 3,
        fontSize: 18,
        backgroundColor: "#5653d4",
        color: '#FFFFFF'
    },
    scanbutton: {
        width: 100,
        height: 50,
        backgroundColor: '#9dfd24',
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    scanbuttonText: {
        fontSize: 20,
        color: '#0A0101'
    }
});