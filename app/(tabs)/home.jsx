import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <SafeAreaView className='bg-whiteBackground flex-1'>
      <View className='flex my-6 px-4 space-y-6'>
        <Text>Home</Text>
      </View>
    </SafeAreaView>
  );
}
