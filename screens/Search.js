import React, {Component} from 'react';
import {View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList} from 'react-native';
import db from '../config';

export default class SearchScreen extends Component{

    constructor(props){
        super(props);
        this.state = {
            allTransactions: []
        };
    }

    getTransactions = () => {
        db.collections("transactions").get().then(snapshot => {
            snapshot.docs.map(doc => {
                this.setState({
                    allTransactions: [...this.allTransactions, doc.data()]
                });
            });
        });
    }

    renderItem = ({item, i}) => {
        var date = item.date
            .toDate()
            .toString()
            .split(" ")
            .splice(0, 4)
            .join(" ");

        var transactionType = item.transaction_type === "issue" ? "entregue" : "devolvido";

        return (
           <View style={{ borderWidth: 1}}>
            <ListItem key={i} bottomDivider>
                <Icon type={'antdesign'} name={'book'} size={40}/>
                <ListItem.Content>
                    <ListItem.Title style={styles.title}>
                        {`${item.book_name} ${item.book_id}`}
                    </ListItem.Title>
                    <ListItem.Subtitle style={styles.subtitle}>
                        {`Este livro foi ${transactionType} por ${item.student_name}`}
                    </ListItem.Subtitle>
                    <View style={styles.lowerLeftContainer}>
                        <View style={styles.transactionContainer}>
                            <Text
                                style={[styles.transactionText, {color: item.transaction_type === 'issue' ? '#78D304' : "#0334F4"}]}>
                                    {item.transaction_type.chartAt(0).toUpperCase() + item.transaction_type.slice(1)}
                            </Text>
                            <Icon 
                                type={'ionicon'}
                                name={item.transaction_type === 'issue' ? "checkmark-circle-outline" : "arrow-redo-circle-outline"}
                                color={item.transaction_type === 'issue' ? '#78D304' : "#0334F4"}
                            />
                            <Text style={styles.date}>{date}</Text>
                        </View>
                    </View>
                </ListItem.Content>
            </ListItem>
           </View>
        )
    }

    render(){
        return(
            <View style={styles.container}>
                <Text style={styles.text}>Tela de Pesquisa</Text>
            </View>
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
});