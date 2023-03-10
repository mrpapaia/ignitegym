import { useState } from "react";
import {
  ScrollView,
  VStack,
  Image,
  Text,
  Center,
  Heading,
  useToast,
} from "native-base";
import { useNavigation } from "@react-navigation/native";
import { useForm, Controller } from "react-hook-form";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { useAuth } from "@hooks/useAuth";
import BackGroundImg from "@assets/background.png";
import LogoSvg from "@assets/logo.svg";
import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { api } from "@service/api";

import { AppError } from "@utils/AppError";

type FormDataProps = {
  name: string;
  email: string;
  password: string;
  password_confirm: string;
};

const signUpSchema = yup.object({
  name: yup.string().required("Informe o nome."),
  email: yup.string().required("Informe o email.").email("E-mail invalido."),
  password: yup
    .string()
    .required("Informe a senha")
    .min(6, "A senha deve ter pelo menos 6 dígitos."),
  password_confirm: yup
    .string()
    .required("Confirme a senha.")
    .oneOf([yup.ref("password"), null], "A confirmação da senha não confere"),
});

export const SignUp = (): JSX.Element => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataProps>({ resolver: yupResolver(signUpSchema) });

  const navigation = useNavigation();
  const toast = useToast();
  const { signIn } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSignUp = ({ name, email, password }: FormDataProps) => {
    setLoading(true);
    api
      .post("/users", { name: name, email: email, password: password })
      .then(async (response) => {
        await signIn(email, password);
      })
      .catch((error) => {
        if (error instanceof AppError) {
          return toast.show({
            title: error.message,
            placement: "top",
            bgColor: "red.500",
          });
        }

        toast.show({
          title: "Não foi possivel criar a conta. Tente Novamente mais tarde",
          placement: "top",
          bgColor: "red.500",
        });
      })
      .finally(() => setLoading(false));
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <VStack flex={1} px={10} pb={16}>
        <Image
          source={BackGroundImg}
          defaultSource={BackGroundImg}
          alt={"Pessoas treinando"}
          resizeMode={"contain"}
          position={"absolute"}
        />
        <Center my={24}>
          <LogoSvg />
          <Text color={"gray.100"} fontSize={"sm"}>
            Treine sua mente e o seu corpo
          </Text>
        </Center>
        <Center>
          <Heading
            color={"gray.100"}
            fontSize={"xl"}
            mb={6}
            fontFamily={"heading"}
          >
            Crie sua conta
          </Heading>

          <Controller
            control={control}
            name={"name"}
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Nome"
                onChangeText={onChange}
                value={value}
                errorMessage={errors.name?.message}
              />
            )}
          />

          <Controller
            control={control}
            name={"email"}
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="E-mail"
                keyboardType={"email-address"}
                autoCapitalize={"none"}
                onChangeText={onChange}
                value={value}
                errorMessage={errors.email?.message}
              />
            )}
          />

          <Controller
            control={control}
            name={"password"}
            render={({ field: { onChange, value } }) => (
              <Input
                secureTextEntry
                placeholder="Senha"
                onChangeText={onChange}
                value={value}
                errorMessage={errors.password?.message}
              />
            )}
          />

          <Controller
            control={control}
            name={"password_confirm"}
            render={({ field: { onChange, value } }) => (
              <Input
                secureTextEntry
                placeholder="Confirmar senha"
                onChangeText={onChange}
                value={value}
                onSubmitEditing={handleSubmit(handleSignUp)}
                errorMessage={errors.password_confirm?.message}
                returnKeyType={"send"}
              />
            )}
          />

          <Button
            title={"Criar e acessar"}
            onPress={handleSubmit(handleSignUp)}
            isLoading={loading}
          />
          <Button
            mt={16}
            title={"Voltar para o Login"}
            variant={"outline"}
            onPress={handleGoBack}
          />
        </Center>
      </VStack>
    </ScrollView>
  );
};
