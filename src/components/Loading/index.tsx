import { Spinner, Center } from "native-base";

export const Loading = (): JSX.Element => {
  return (
    <Center flex={1} bg={"gray.700"}>
      <Spinner color={"green.400"} />
    </Center>
  );
};
