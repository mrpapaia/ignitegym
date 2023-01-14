import { Input as NBInput, IInputProps } from "native-base";

export const Input = ({ ...rest }: IInputProps): JSX.Element => {
  return (
    <NBInput
      h={14}
      px={4}
      mb={4}
      bg={"gray.700"}
      borderWidth={0}
      fontSize={"md"}
      fontFamily={"body"}
      color={"white"}
      placeholderTextColor={"gray.300"}
      _focus={{ bg: "gray.700", borderWidth: 1, borderColor: "green.500" }}
      {...rest}
    />
  );
};
