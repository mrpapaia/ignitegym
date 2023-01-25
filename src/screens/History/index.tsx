import { useCallback, useState } from "react";

import { Center, Heading, Text, VStack, SectionList, Toast } from "native-base";
import { ScreenHeader } from "@components/ScreenHeader";
import { HistoryCard } from "@components/HistoryCard";
import { api } from "@service/api";
import { AppError } from "@utils/AppError";
import { useFocusEffect } from "@react-navigation/native";
import { HistoryDTO } from "@dto/HistoryDTO";
import { HistorySection } from "@dto/HistorySectionDTO";
import { Loading } from "@components/Loading";

export const History = () => {
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<HistorySection[]>([]);

  const getHistory = async () => {
    api.get("/history");
    try {
      setLoading(true);
      const response = await api.get("/history");
      setHistory(response.data);
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : "Não foi possivel carregar o historico.";
      Toast.show({ title, placement: "top", bgColor: "red.500" });
    } finally {
      setLoading(false);
    }
  };
  const renderItemHistory = ({ item }: { item: HistoryDTO }) => {
    return <HistoryCard data={item} />;
  };

  useFocusEffect(
    useCallback(() => {
      getHistory();
    }, [])
  );
  return (
    <VStack flex={1}>
      <ScreenHeader title={"Histórico de Exercícios"} />
      {loading ? (
        <Loading />
      ) : (
        <SectionList
          sections={history}
          px={8}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItemHistory}
          renderSectionHeader={({ section }) => (
            <Heading
              fontFamily={"heading"}
              color={"gray.200"}
              fontSize={"md"}
              mt={10}
              mb={3}
            >
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
      )}
    </VStack>
  );
};
