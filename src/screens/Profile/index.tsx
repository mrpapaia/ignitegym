import { useState } from "react";
import { TouchableOpacity } from "react-native";
import {
  Center,
  Heading,
  ScrollView,
  Skeleton,
  Text,
  useToast,
  VStack,
} from "native-base";

import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";

import { UserPhoto } from "@components/UserPhoto";
import { ScreenHeader } from "@components/ScreenHeader";

import UserPhotoDefaultPng from "assets/userPhotoDefault.png";
import { Input } from "@components/Input";
import { Button } from "@components/Button";

const PHOTO_SIZE = 33;

const profileSchema = yup.object({
  name: yup.string().required("Informe o nome"),
  email: yup.string().required("Informe o e-mail.").email(),
  password: yup
    .string()
    .required("Informe a senha")
    .min(6, "A senha deve contaer pelo menos 6 caracteres"),

  password_confirm: yup
    .string()
    .required("Confirme a senha")
    .oneOf([yup.ref("password"), null], "A confirmação da senha não confere"),
});

type FormeDataProps = {
  name: string;
  email: string;
  password: string;
  password_confirm: string;
};

export const Profile = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormeDataProps>({
    defaultValues: { name: "Diogo", email: "dj@gmail.com" },
    resolver: yupResolver(profileSchema),
  });

  const [photoIsLoagind, setPhotoIsLoading] = useState(false);
  const [userPhoto, setUserPhoto] = useState("https://github.com/mrpapaia.png");

  const toast = useToast();
  const handlePhotoSelect = async () => {
    setPhotoIsLoading(true);
    try {
      const selectedPhoto = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        aspect: [4, 4],
        allowsEditing: true,
      });
      if (selectedPhoto.canceled) {
        return;
      }
      if (selectedPhoto.assets[0].uri) {
        const photoInfo = await FileSystem.getInfoAsync(
          selectedPhoto.assets[0].uri
        );

        if (photoInfo.size && photoInfo.size / 1024 / 1024 > 5) {
          return toast.show({
            title: "Essa imagem é muito grande. Escolha uma com ate 5 MB.",
            placement: "top",
            bgColor: "red.500",
          });
        }
        setUserPhoto(selectedPhoto.assets[0].uri);
      }
    } catch (erro) {
      console.log();
    } finally {
      setPhotoIsLoading(false);
    }
  };

  const handleUpdate = (data: any) => {};
  return (
    <VStack flex={1}>
      <ScreenHeader title="Perfil" />
      <ScrollView contentContainerStyle={{ paddingBottom: 36 }}>
        <Center mt={6} px={10}>
          {photoIsLoagind ? (
            <Skeleton
              h={PHOTO_SIZE}
              w={PHOTO_SIZE}
              rounded={"full"}
              startColor={"gray.500"}
              endColor={"gray.400"}
            />
          ) : (
            <UserPhoto
              size={PHOTO_SIZE}
              source={{ uri: userPhoto }}
              defaultSource={UserPhotoDefaultPng}
              alt={"Foto do usuário"}
            />
          )}
          <TouchableOpacity onPress={handlePhotoSelect}>
            <Text
              color={"green.500"}
              fontWeight={"bold"}
              fontSize={"md"}
              mt={3}
              mb={8}
            >
              Alterar foto
            </Text>
          </TouchableOpacity>
          <Controller
            name={"name"}
            control={control}
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Nome"
                value={value}
                onChangeText={onChange}
                bg={"gray.600"}
                errorMessage={errors.name?.message}
              />
            )}
          />
          <Controller
            name={"email"}
            control={control}
            render={({ field: { value } }) => (
              <Input
                placeholder="E-mail"
                value={value}
                bg={"gray.600"}
                isDisabled
              />
            )}
          />
        </Center>
        <VStack px={10} mt={12} mb={9}>
          <Heading
            fontFamily={"heading"}
            color={"gray.200"}
            fontSize={"md"}
            mb={2}
          >
            Alterar senha
          </Heading>
          <Controller
            name={"password"}
            control={control}
            render={({ field: { onChange, value } }) => (
              <Input
                secureTextEntry
                placeholder="Senha atual"
                onChangeText={onChange}
                value={value}
                bg={"gray.600"}
                errorMessage={errors.password?.message}
              />
            )}
          />
          <Controller
            name={"password_confirm"}
            control={control}
            render={({ field: { onChange, value } }) => (
              <Input
                secureTextEntry
                placeholder="Confirme a nova senha"
                onChangeText={onChange}
                value={value}
                bg={"gray.600"}
                errorMessage={errors.password_confirm?.message}
                onSubmitEditing={handleSubmit(handleUpdate)}
                returnKeyType={"send"}
              />
            )}
          />

          <Button title={"Atualizar"} onPress={handleSubmit(handleUpdate)} />
        </VStack>
      </ScrollView>
    </VStack>
  );
};
