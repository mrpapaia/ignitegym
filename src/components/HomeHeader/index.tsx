import { Heading, HStack, Text, VStack, Icon } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import { UserPhoto } from "@components/UserPhoto";
import { TouchableOpacity } from "react-native-gesture-handler";

import UserPhotoDefaultPng from "assets/userPhotoDefault.png";
import { useAuth } from "@hooks/useAuth";

import DefaultUserPhoto from "@assets/userPhotoDefault.png";
import { api } from "@service/api";

export const HomeHeader = () => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };
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
        source={
          user.avatar
            ? { uri: `${api.defaults.baseURL}/avatar/${user.avatar}` }
            : DefaultUserPhoto
        }
        defaultSource={UserPhotoDefaultPng}
        alt={"Foto do usuário"}
        mr={4}
      />
      <VStack flex={1}>
        <Text color={"gray.100"} fontSize={"md"}>
          Olá,
        </Text>
        <Heading fontFamily={"heading"} color={"gray.100"} fontSize={"md"}>
          {user.name}
        </Heading>
      </VStack>
      <TouchableOpacity onPress={handleSignOut}>
        <Icon as={MaterialIcons} name={"logout"} color={"gray.200"} size={7} />
      </TouchableOpacity>
    </HStack>
  );
};
