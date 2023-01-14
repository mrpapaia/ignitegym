import { Heading, HStack, Text, VStack, Icon } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import { UserPhoto } from "@components/UserPhoto";
import { TouchableOpacity } from "react-native-gesture-handler";

import UserPhotoDefaultPng from "assets/userPhotoDefault.png";
import { useState } from "react";

export const HomeHeader = () => {
  return (
    <HStack
      bg={"gray.600"}
      width={"full"}
      pt={16}
      pb={5}
      px={8}
      alignItems={"center"}
    >
      <UserPhoto
        size={16}
        source={{ uri: "https://github.com/mrpapaia.png" }}
        defaultSource={UserPhotoDefaultPng}
        alt={"Foto do usuário"}
        mr={4}
      />
      <VStack flex={1}>
        <Text color={"gray.100"} fontSize={"md"}>
          Olá,
        </Text>
        <Heading color={"gray.100"} fontSize={"md"}>
          Diogo
        </Heading>
      </VStack>
      <TouchableOpacity>
        <Icon as={MaterialIcons} name={"logout"} color={"gray.200"} size={7} />
      </TouchableOpacity>
    </HStack>
  );
};
