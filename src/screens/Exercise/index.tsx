import { TouchableOpacity } from "react-native";
import {
  Box,
  Heading,
  HStack,
  Icon,
  Image,
  ScrollView,
  Text,
  VStack,
} from "native-base";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import BodySvg from "@assets/body.svg";
import SeriesSvg from "@assets/series.svg";
import RepetitionsSvg from "@assets/repetitions.svg";
import { Button } from "@components/Button";

export const Exercise = () => {
  const navigation = useNavigation();

  const handleGoBack = () => {
    navigation.goBack();
  };
  return (
    <VStack>
      <ScrollView>
        <VStack px={8} bg={"gray.600"} pt={12}>
          <TouchableOpacity onPress={handleGoBack}>
            <Icon
              as={Feather}
              name={"arrow-left"}
              color={"green.500"}
              size={6}
            />
          </TouchableOpacity>
          <HStack
            justifyContent={"space-between"}
            mt={4}
            mb={8}
            alignItems={"center"}
          >
            <Heading
              fontFamily={"heading"}
              color={"gray.100"}
              fontSize={"lg"}
              flexShrink={1}
            >
              Exercício
            </Heading>
            <HStack>
              <BodySvg />
              <Text color={"gray.100"} ml={1} textTransform={"capitalize"}>
                Costas
              </Text>
            </HStack>
          </HStack>
        </VStack>
        <VStack p={8}>
          <Image
            w={"full"}
            h={80}
            mb={3}
            source={{
              uri: "https://blog.keydesign.com.br/wp-content/uploads/2017/03/IMAGE_1_642x361_5_Best_Ab_Moves_for_Men.jpg",
            }}
            resizeMode={"cover"}
            rounded={"lg"}
            alt={"Imagem do exercício"}
          />

          <Box bg={"gray.600"} rounded={"md"} pb={4} px={4}>
            <HStack
              alignItems={"center"}
              justifyContent={"space-around"}
              mt={5}
              mb={6}
            >
              <HStack alignItems={"center"}>
                <SeriesSvg />
                <Text color={"gray.200"} ml={2}>
                  3 séries
                </Text>
              </HStack>
              <HStack alignItems={"center"}>
                <RepetitionsSvg />
                <Text color={"gray.200"} ml={2}>
                  12 repetições
                </Text>
              </HStack>
            </HStack>
            <Button title={"Marcar como realizado"} />
          </Box>
        </VStack>
      </ScrollView>
    </VStack>
  );
};
