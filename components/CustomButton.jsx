import { ActivityIndicator, Image, Text, TouchableOpacity } from "react-native";

const CustomButton = ({
  title,
  handlePress,
  containerStyles,
  textStyles,
  textColor = 'white',
  isLoading,
  disabled,
  icon,
  iconStyles
}) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      className={`bg-primary rounded-xl min-h-[62px] flex flex-row justify-center items-center gap-4 ${containerStyles} ${isLoading ? "opacity-50" : ""
        }`}
      disabled={isLoading || disabled}
    >
      <Text className={`text-${textColor} font-psemibold text-lg ${textStyles}`}>
        {title}
      </Text>
      {icon && (
        <Image
          source={icon}
          className={`w-6 h-6 ${iconStyles}`}
          resizeMode='contain'
        />
      )}

      {isLoading && (
        <ActivityIndicator
          animating={isLoading}
          color='#fff'
          size='small'
          className='ml-2'
        />
      )}
    </TouchableOpacity>
  );
};

export default CustomButton;
