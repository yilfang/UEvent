import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert, Dimensions } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import CategoryButton from '../objects/categoryButton';
import Globals from '../../GlobalVariables';
import BackButton from '../objects/backButton';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CategoryList({ navigation, route }) {
    const categories = [];
    for (let i = 0; i < Globals.categories.length; i++) {
        const name = Globals.categories[i].name;
        const id = Globals.categories[i].id;
        const icon = require('../assets/categories.png');

        const assetName = name.replace(/\W/g, '')
        if (Globals.categoryAssets.hasOwnProperty(assetName)) {
            icon = Globals.categoryAssets[assetName];
        }

        categories.push({ name: name, icon: icon, key: id })
    }
    /*
    const backParams = {
        SearchType: navigation.getParam('SearchType'),
        SearchText: navigation.getParam('SearchText'),
        Categories: navigation.getParam('Categories'),
        TimeRange: navigation.getParam('TimeRange'),
        OtherFilters: navigation.getParam('OtherFilters'),
        CloseBotSheet: navigation.getParam('CloseBotSheet'),
        CloseBotSheet2: navigation.getParam('CloseBotSheet2'),
    }
    */
    const backParams = route.params;

    let localCategoriesCopy = [];
    for (let i = 0; i < backParams.Categories.length; i++) {
        localCategoriesCopy.push(backParams.Categories[i]);
    }

    let totalSelections = route.params.Categories.length;

    const linSearchCategories = (catName) => {
        for (let i = 0; i < localCategoriesCopy.length; i++) {
            if (localCategoriesCopy[i].name == catName)
                return i;
        }
        return -1;
    }
    const renderCategory = (obj) => {
        if (linSearchCategories(obj.name) != -1)
            return <CategoryButton id={obj.id} icon={obj.icon} name={obj.name} pressHandler={categoryPressHandler} isPressed={true} />
        else
            return <CategoryButton id={obj.id} icon={obj.icon} name={obj.name} pressHandler={categoryPressHandler} isPressed={false} />
    }
    const categoryPressHandler = (id, icon, name, add) => {
        if (add) {
            if (totalSelections == 3) {
                Alert.alert('Limit Reached', 'You can only choose up to 3 categories');
                return false;
            }
            else {
                localCategoriesCopy.push({ id: id, icon: icon, name: name });
                totalSelections++;
                return true;
            }
        }
        else {
            const index = linSearchCategories(name);
            localCategoriesCopy.splice(index, 1);
            totalSelections--;
            return true;
        }
    }
    const backHandler = () => {
        backParams.back = true;
        navigation.navigate('MainScreen', backParams);
    }
    const selectHandler = () => {
        backParams.CloseBotSheet = true;
        backParams.CloseBotSheet2 = false;
        backParams.Categories.length = 0;
        for (let i = 0; i < localCategoriesCopy.length; i++)
            backParams.Categories.push(localCategoriesCopy[i]);

        backParams.SearchType = 'filter';
        if (backParams.Categories.length == 0 && (backParams.TimeRange.startTime == '' && backParams.TimeRange.endTime == ''
            && backParams.TimeRange.value == 'Anytime')) {

            if (backParams.SearchText == '') {
                backParams.SearchType = 'none';
                backParams.CloseBotSheet2 = true;
            }
            else
                backParams.SearchType = 'text';
        }
        navigation.navigate('MainScreen', backParams);
    }
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerContainer}>
                <BackButton onPress={backHandler} title='Event Categories' />

            </View>
            <View style={[styles.scrollContainer, { height: Dimensions.get('window').height - Globals.HR(150) - 75 }]}>
                <Text style={[styles.instructionsText]}>Select up to 3 categories</Text>
                <View style={{ borderBottomColor: '#d4d4d4', borderBottomWidth: 1.5, marginTop: 5, marginBottom: 0, marginHorizontal: -23, }} />
                <ScrollView /*onMomentumScrollBegin = {() => {setScrollHeight('100%')}} onMomentumScrollEnd = {() => {setScrollHeight('77%')}*/>
                    {categories.map((item) => {
                        return (
                            <View key={item.key}>
                                {renderCategory({ id: item.key, icon: item.icon, name: item.name })}
                            </View>
                        )
                    })}
                </ScrollView>
            </View>
            <TouchableOpacity onPress={selectHandler} style={{
                position: 'absolute',
                bottom: Globals.HR(70), alignSelf: 'center',
            }}>
                <View style={[styles.selectContainer]}>
                    <Text style={styles.selectText}>Select</Text>
                </View>
            </TouchableOpacity>
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    headerContainer: {
        flexDirection: 'row',
        marginLeft: 20,
        alignItems: 'center',
    },
    headerText: {
        fontWeight: '600',
        fontSize: 22,
        marginVertical: 15,
    },
    instructionsText: {
        fontWeight: '500',
        fontSize: 18,
        marginTop: 15,
        marginBottom: 10,
        alignSelf: 'center'
    },
    backText: {
        fontWeight: 'bold',
        fontSize: 18,
        color: '#0085ff',
        left: Globals.WR(23),
        marginRight: Globals.WR(74),
    },
    scrollContainer: {
        //marginLeft: Globals.WR(25),
        //marginRight: Globals.WR(25),
    },
    selectContainer: {
        backgroundColor: '#ffffff',
        alignItems: 'center',
        shadowColor: "#000",
        width: 250,
        alignSelf: 'center',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        borderRadius: 50,
    },
    selectText: {
        fontWeight: 'bold',
        fontSize: 26,
        paddingVertical: 10,
        color: '#fab400',
    },
})