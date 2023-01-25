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
import { useAuth } from "@hooks/useAuth";
import { api } from "@service/api";
import { AppError } from "@utils/AppError";
import DefaultUserPhoto from "@assets/userPhotoDefault.png";

const PHOTO_SIZE = 33;

const profileSchema = yup.object({
  name: yup.string().required("Informe o nome"),
  email: yup.string().required("Informe o e-mail.").email(),
  old_password: yup
    .string()
    .nullable()
    .transform((value) => (!!value ? value : null)),
  password: yup
    .string()

    .min(6, "A senha deve conter pelo menos 6 caracteres")
    .nullable()
    .transform((value) => (!!value ? value : null)),

  password_confirm: yup
    .string()
    .nullable()
    .transform((value) => (!!value ? value : null))
    .oneOf([yup.ref("password"), null], "A confirmação da senha não confere")
    .when("password", {
      is: (field: any) => field,
      then: yup
        .string()
        .required("A confirmação da senha não confere")
        .nullable(),
    }),
});

type FormeDataProps = {
  name: string;
  email: string;
  old_password: string;
  password: string;
  password_confirm: string;
};

export const Profile = () => {
  const { user, updateUser } = useAuth();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormeDataProps>({
    defaultValues: { name: user.name, email: user.email },
    resolver: yupResolver(profileSchema),
  });

  const [photoIsLoagind, setPhotoIsLoading] = useState(false);

  const [loading, setLoading] = useState(false);

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
        const fileExtension = selectedPhoto.assets[0].uri.split(".").pop();
        const photoFile = {
          name: `${user.name}.${fileExtension}`.toLowerCase(),
          uri: selectedPhoto.assets[0].uri,
          type: `${selectedPhoto.assets[0].type}/${fileExtension}`,
        } as any;
        //

        const userPhotoUploadFrom = new FormData();
        userPhotoUploadFrom.append("avatar", photoFile);
        const avatarResponse = await api.patch(
          "/users/avatar",
          userPhotoUploadFrom,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        toast.show({
          title: "Foto atualizada",
          placement: "top",
          bgColor: "green.500",
        });
        const updatedUser = user;
        updatedUser.avatar = avatarResponse.data.avatar;
        updateUser(updatedUser);
      }
    } catch (error) {
      toast.show({
        title: error.message,
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setPhotoIsLoading(false);
    }
  };

  const handleUpdate = async (data: FormeDataProps) => {
    try {
      setLoading(true);
      await api.put("/users", data);
      toast.show({
        title: "Perfil atualizado com sucesso!",
        placement: "top",
        bgColor: "green.500",
      });
      await updateUser({ ...user, name: data.name });
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : "Não foi possivel carregar os detalhes do exeircicio";
      toast.show({ title, placement: "top", bgColor: "red.500" });
    } finally {
      setLoading(false);
    }
  };

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
              source={
                user.avatar
                  ? { uri: `${api.defaults.baseURL}/avatar/${user.avatar}` }
                  : DefaultUserPhoto
              }
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
            name={"old_password"}
            control={control}
            render={({ field: { onChange, value } }) => (
              <Input
                secureTextEntry
                placeholder="Senha atual"
                onChangeText={onChange}
                value={value}
                bg={"gray.600"}
                errorMessage={errors.old_password?.message}
              />
            )}
          />
          <Controller
            name={"password"}
            control={control}
            render={({ field: { onChange, value } }) => (
              <Input
                secureTextEntry
                placeholder="Nova Senha"
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

          <Button
            isLoading={loading}
            title={"Atualizar"}
            onPress={handleSubmit(handleUpdate)}
          />
        </VStack>
      </ScrollView>
    </VStack>
  );
};
