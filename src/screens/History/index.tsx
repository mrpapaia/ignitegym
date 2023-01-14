import { useState } from "react";

import { Center, Heading, Text, VStack, SectionList } from "native-base";
import { ScreenHeader } from "@components/ScreenHeader";
import { HistoryCard } from "@components/HistoryCard";

export const History = () => {
  const [history, setHistory] = useState([
    {
      title: "26.08.22",
      data: ["Puxada frontal", "Remada unilateral"],
    },
    {
      title: "27.08.22",
      data: ["Puxada frontal"],
    },
  ]);

  const renderItemHistory = ({ item }) => {
    return <HistoryCard />;
  };
  return (
    <VStack flex={1}>
      <ScreenHeader title={"Histórico de Exercícios"} />
      <SectionList
        sections={history}
        px={8}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItemHistory}
        renderSectionHeader={({ section }) => (
          <Heading color={"gray.200"} fontSize={"md"} mt={10} mb={3}>
            {section.title}
          </Heading>
        )}
        contentContainerStyle={
          history.length === 0 && { flex: 1, justifyContent: "center" }
        }
        ListEmptyComponent={() => (
          <Text color={"gray.100"} textAlign={"center"}>
            Não há exercícios registrados.
          </Text>
        )}
      />
    </VStack>
  );
};
