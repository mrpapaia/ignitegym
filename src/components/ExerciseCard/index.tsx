import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import { Heading, HStack, Image, Text, VStack, Icon } from "native-base";
import { Entypo } from "@expo/vector-icons";
type Props = TouchableOpacityProps & {};
export const ExerciseCard = ({ ...rest }: Props) => {
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
            uri: "https://blog.keydesign.com.br/wp-content/uploads/2017/03/IMAGE_1_642x361_5_Best_Ab_Moves_for_Men.jpg",
          }}
          resizeMode={"center"}
          alt={"Imagem do exercício"}
        />
        <VStack flex={1}>
          <Heading fontSize={"lg"} color={"white"}>
            Exercicio aleatorio
          </Heading>
          <Text fontSize={"sm"} color={"gray.200"} mt={1} numberOfLines={2}>
            3 séries x 12 repetições
          </Text>
        </VStack>
        <Icon as={Entypo} name={"chevron-thin-right"} color={"gray.300"} />
      </HStack>
    </TouchableOpacity>
  );
};
