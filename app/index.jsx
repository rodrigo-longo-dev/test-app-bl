import { StatusBar } from "expo-status-bar";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { CustomButton } from "../components";

const Welcome = () => {
  return (
    <SafeAreaView className='bg-[#f3f3f3] h-full'>
      <Text>Prueba Bluetooth</Text>
      <CustomButton textColor='white' title='Prueba' onPress={() => {}} />
      <StatusBar backgroundColor='#161622' style='light' />
    </SafeAreaView>
  );
};

export default Welcome;
