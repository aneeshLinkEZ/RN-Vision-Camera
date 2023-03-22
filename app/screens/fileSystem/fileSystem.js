import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, Button, View, Alert } from 'react-native';
import { 
    DocumentDirectoryPath, 
    writeFile, 
    CachesDirectoryPath,
    ExternalCachesDirectoryPath,
    ExternalStorageDirectoryPath,
    moveFile
} from 'react-native-fs';
import { Dirs, FileSystem } from 'react-native-file-access';

const FileSystemHandle = ({ navigation }) => {
    const [fileText, setFileText] = useState('');
    const t = DocumentDirectoryPath;
    const saveFile = async () => {
        const path = `${t}/${Date.now()}.txt`;
        const path1 = `${Dirs.SDCardDir}/${Date.now()}.txt`;
        const c = await FileSystem.mkdir(`${Dirs.DocumentDir}/basicApp`)
        console.log("New path", c);

        try {
            // await FileSystem.mv(source: string, target: string)
            await writeFile(path, fileText, 'utf8');
            console.log(path1);
            Alert.alert('File saved', path, [{ text: 'OK' }]);
            // alert(path1)
        } catch (e) {
            console.log('error', e);
        }
    };

    return (
        <SafeAreaView style={styles.wrapper}>
            <View style={styles.container}>
                <View style={styles.main}>
                    <Text style={styles.title}>Enter text for your file:</Text>
                    <TextInput
                        value={fileText}
                        onChangeText={setFileText}
                        style={styles.textArea}
                        multiline
                        textAlignVertical="top"
                    />
                </View>
                <Button title="Save File" onPress={()=>{saveFile()}} />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
    },
    container: {
        padding: 16,
        flex: 1,
    },
    main: {
        flex: 1,
        display: 'flex',
        paddingVertical: 16,
    },
    textArea: {
        height: 200,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        marginBottom: 16,
        paddingLeft: 16,
        paddingRight: 16,
        paddingTop: 16,
        paddingBottom: 16,
        fontSize: 18,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#333',
    },
});

export default FileSystemHandle;
