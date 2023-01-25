import { TouchableOpacity } from "react-native";
import {
  Box,
  Heading,
  HStack,
  Icon,
  Image,
  ScrollView,
  Text,
  Toast,
  VStack,
} from "native-base";
import { Feather } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";

import BodySvg from "@assets/body.svg";
import SeriesSvg from "@assets/series.svg";
import RepetitionsSvg from "@assets/repetitions.svg";
import { Button } from "@components/Button";
import { api } from "@service/api";
import { useEffect, useState } from "react";
import { AppError } from "@utils/AppError";
import { ExerciseDTO } from "@dto/ExerciseDTO";
import { Loading } from "@components/Loading";
import { AppRoutesProps } from "@routes/app.routes";

type RouteParams = {
  exerciseID: string;
};

export const Exercise = () => {
  const navigation = useNavigation<AppRoutesProps>();

  const route = useRoute();

  const { exerciseID } = route.params as RouteParams;

  const [loading, setLoading] = useState(true);
  const [sendingRegister, setSendingRegister] = useState(false);
  const [exercise, setExercise] = useState<ExerciseDTO>({} as ExerciseDTO);

  const getExerciseById = async () => {
    try {
      const response = await api.get(`/exercises/${exerciseID}`);
      setExercise(response.data);
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : "Não foi possivel carregar os detalhes do exeircicio";
      Toast.show({ title, placement: "top", bgColor: "red.500" });
    } finally {
      setLoading(false);
    }
  };

  const handleExerciseHistoryRegister = async () => {
    try {
      setSendingRegister(true);
      await api.post("/history", { exercise_id: exerciseID });
      Toast.show({
        title: "Exercicio registrado",
        placement: "top",
        bgColor: "green.700",
      });
      navigation.navigate("history");
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : "Não foi possivel registrar o exeircicio";
      Toast.show({ title, placement: "top", bgColor: "red.500" });
    } finally {
      setSendingRegister(false);
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  useEffect(() => {
    getExerciseById();
  }, [exerciseID]);

  return (
    <VStack>
      {loading ? (
        <Loading />
      ) : (
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
                {exercise.name}
              </Heading>
              <HStack>
                <BodySvg />
                <Text color={"gray.100"} ml={1} textTransform={"capitalize"}>
                  {exercise.group}
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
                uri: `${api.defaults.baseURL}/exercise/demo/${exercise.demo}`,
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
                    {exercise.series} séries
                  </Text>
                </HStack>
                <HStack alignItems={"center"}>
                  <RepetitionsSvg />
                  <Text color={"gray.200"} ml={2}>
                    {exercise.repetitions} repetições
                  </Text>
                </HStack>
              </HStack>
              <Button
                isLoading={sendingRegister}
                title={"Marcar como realizado"}
                onPress={handleExerciseHistoryRegister}
              />
            </Box>
          </VStack>
        </ScrollView>
      )}
    </VStack>
  );
};
