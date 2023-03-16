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
                console.log(response);
                setGallary({resourcePath: response})
              },
            )
        // ImagePicker.launchImageLibrary(
        //   {
        //     mediaType: 'photo',
        //     includeBase64: false,
        //     maxHeight: 200,
        //     maxWidth: 200,
        //   },
        //   response => {
        //     if (response.didCancel) {
        //       console.log('User cancelled image picker');
        //     } else if (response.error) {
        //       console.log('ImagePicker Error: ', response.error);
        //     } else if (response.customButton) {
        //       console.log('User tapped custom button: ', response.customButton);
        //     } else {
        //       console.log('Selected image: ', response.uri);
        //       // Do something with the selected image URI
        //     }
        //   },
        // );
      };
    return(
        <View>
            <Text>Hello</Text>
            <Button title={"Gallary"} onPress={pickImage()}/>
        </View>
    )
}