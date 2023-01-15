import { Input as NBInput, IInputProps, FormControl } from "native-base";

type Props = IInputProps & {
  errorMessage?: string;
};

export const Input = ({ errorMessage, ...rest }: Props): JSX.Element => {
  const isInvalid = !!errorMessage;
  return (
    <FormControl isInvalid={isInvalid} mb={4}>
      <NBInput
        h={14}
        px={4}
        bg={"gray.700"}
        borderWidth={0}
        fontSize={"md"}
        fontFamily={"body"}
        color={"white"}
        placeholderTextColor={"gray.300"}
        isInvalid={isInvalid}
        _invalid={{ borderWidth: 1, borderColor: "red.500" }}
        _focus={{ bg: "gray.700", borderWidth: 1, borderColor: "green.500" }}
        {...rest}
      />
      <FormControl.ErrorMessage>{errorMessage}</FormControl.ErrorMessage>
    </FormControl>
  );
};
