import { useState } from "react";
import { FlatList, Heading, HStack, Text, VStack } from "native-base";

import { ExerciseCard } from "@components/ExerciseCard";
import { Group } from "@components/Group";
import { HomeHeader } from "@components/HomeHeader";

export const Home = () => {
  const [groups, setGroups] = useState(["costas", "ombro", "pernas", "peito"]);
  const [groupSelected, setGroupSelected] = useState("costas");

  const [exercises, setExercises] = useState([1, 2, 3, 4, 5, 6, 7]);

  const renderItemGroup = ({ item }: { item: string }) => {
    return (
      <Group
        name={item}
        isActive={groupSelected.toLowerCase() === item.toLowerCase()}
        onPress={() => setGroupSelected(item)}
      />
    );
  };

  const renderItemExercise = ({ item }: { item: number }) => {
    return <ExerciseCard />;
  };

  return (
    <VStack flex={1}>
      <HomeHeader />
      <FlatList
        my={10}
        maxH={10}
        horizontal
        showsHorizontalScrollIndicator={false}
        data={groups}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItemGroup}
        _contentContainerStyle={{ px: 8 }}
      />
      <VStack flex={1} px={8}>
        <HStack mb={5} justifyContent={"space-between"}>
          <Heading color={"gray.200"} fontSize={"md"}>
            Exercícios
          </Heading>
          <Text color={"gray.200"} fontSize={"sm"}>
            {exercises.length}
          </Text>
        </HStack>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={exercises}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItemExercise}
          _contentContainerStyle={{ paddingBottom: 20 }}
        />
      </VStack>
    </VStack>
  );
};
