import { useCallback, useEffect, useState } from "react";
import { FlatList, Heading, HStack, Text, Toast, VStack } from "native-base";

import { ExerciseCard } from "@components/ExerciseCard";
import { Group } from "@components/Group";
import { HomeHeader } from "@components/HomeHeader";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { AppRoutesProps } from "@routes/app.routes";
import { useAuth } from "@hooks/useAuth";
import { AppError } from "@utils/AppError";
import { api } from "@service/api";
import { ExerciseDTO } from "@dto/ExerciseDTO";
import { Loading } from "@components/Loading";

export const Home = () => {
  const navigation = useNavigation<AppRoutesProps>();
  const [groups, setGroups] = useState<string[]>([]);
  const [groupSelected, setGroupSelected] = useState("");
  const [loading, setLoading] = useState(true);

  const [exercises, setExercises] = useState<ExerciseDTO[]>([]);

  const handleExercise = (id: string) => {
    navigation.navigate("exercise", { exerciseID: id });
  };

  const getGroups = async () => {
    try {
      setLoading(true);
      const response = await api.get("/groups");
      setGroups(response.data);
      setGroupSelected(response.data[0]);
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : "Não foi possivel carregar os grupos musculares";
      Toast.show({ title, placement: "top", bgColor: "red.500" });
    } finally {
      setLoading(false);
    }
  };

  const getExercisesByGroup = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/exercises/bygroup/${groupSelected}`);

      setExercises(response.data);
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : "Não foi possivel carregar os exercicios";
      Toast.show({ title, placement: "top", bgColor: "red.500" });
    } finally {
      setLoading(false);
    }
  };

  const renderItemGroup = ({ item }: { item: string }) => {
    return (
      <Group
        name={item}
        isActive={groupSelected.toLowerCase() === item.toLowerCase()}
        onPress={() => setGroupSelected(item)}
      />
    );
  };

  const renderItemExercise = ({ item }: { item: ExerciseDTO }) => {
    return <ExerciseCard data={item} onPress={() => handleExercise(item.id)} />;
  };

  useEffect(() => {
    getGroups();
  }, []);

  useFocusEffect(
    useCallback(() => {
      getExercisesByGroup();
    }, [groupSelected])
  );

  return (
    <VStack flex={1}>
      <HomeHeader />
      <FlatList
        my={10}
        maxH={10}
        minH={10}
        horizontal
        showsHorizontalScrollIndicator={false}
        data={groups}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItemGroup}
        _contentContainerStyle={{ px: 8 }}
      />
      {loading ? (
        <Loading />
      ) : (
        <VStack flex={1} px={8}>
          <HStack mb={5} justifyContent={"space-between"}>
            <Heading fontFamily={"heading"} color={"gray.200"} fontSize={"md"}>
              Exercícios
            </Heading>
            <Text color={"gray.200"} fontSize={"sm"}>
              {exercises.length}
            </Text>
          </HStack>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={exercises}
            keyExtractor={(item) => item.id}
            renderItem={renderItemExercise}
            _contentContainerStyle={{ paddingBottom: 20 }}
          />
        </VStack>
      )}
    </VStack>
  );
};
