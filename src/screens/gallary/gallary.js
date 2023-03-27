import { Button, Text } from "@rneui/base";
import React, { useState } from "react";
import { PermissionsAndroid, Platform, View } from "react-native";
import ImagePicker,{launchImageLibrary} from 'react-native-image-picker';

export default function ViewGallary ({navigation}){
    const [gallary, setGallary] = useState({})

    const pickImage = () => {
            launchImageLibrary({
                mediaType: 'photo',
                includeBase64: false,
                maxHeight: 200,
                maxWidth: 200,
              },
              (response) => {
                setGallary(response)
                console.log(gallary);

              },
            )
      };
    return(
        <View>
            <Text>Hello</Text>
            <Button title={"Gallary"} onPress={()=>{pickImage()}}/>
        </View>
    )
}