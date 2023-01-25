import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import { Heading, HStack, Image, Text, VStack, Icon } from "native-base";
import { Entypo } from "@expo/vector-icons";
import { ExerciseDTO } from "@dto/ExerciseDTO";
import { api } from "@service/api";
type Props = TouchableOpacityProps & {
  data: ExerciseDTO;
};
export const ExerciseCard = ({ data, ...rest }: Props) => {
  return (
    <TouchableOpacity {...rest}>
      <HStack
        bg={"gray.500"}
        alignItems={"center"}
        p={2}
        pr={4}
        rounded={"md"}
        mb={3}
      >
        <Image
          h={16}
          w={16}
          mr={4}
          rounded={"md"}
          source={{
            uri: `${api.defaults.baseURL}/exercise/thumb/${data.thumb}`,
          }}
          resizeMode={"cover"}
          alt={"Imagem do exercício"}
        />
        <VStack flex={1}>
          <Heading fontFamily={"heading"} fontSize={"lg"} color={"white"}>
            {data.name}
          </Heading>
          <Text fontSize={"sm"} color={"gray.200"} mt={1} numberOfLines={2}>
            {data.series} séries x {data.repetitions} repetições
          </Text>
        </VStack>
        <Icon as={Entypo} name={"chevron-thin-right"} color={"gray.300"} />
      </HStack>
    </TouchableOpacity>
  );
};
