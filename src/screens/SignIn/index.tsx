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
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { AuthRoutesProps } from "@routes/auth.routes";
import BackGroundImg from "@assets/background.png";
import LogoSvg from "@assets/logo.svg";
import { Input } from "@components/Input";
import { Button } from "@components/Button";

import { useAuth } from "@hooks/useAuth";
import { AppError } from "@utils/AppError";
import { useState } from "react";

type LoginFormProps = {
  email: string;
  password: string;
};
const loginSchema = yup.object({
  email: yup.string().required("Informe o e-mail.").email("E-mail invalido."),
  password: yup
    .string()
    .required("Informe a senha.")
    .min(6, "A senha deve ter pelo menos 6 dígitos."),
});

export const SignIn = (): JSX.Element => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormProps>({ resolver: yupResolver(loginSchema) });
  const navigation = useNavigation<AuthRoutesProps>();
  const { signIn } = useAuth();

  const toast = useToast();

  const [loading, setLoading] = useState(false);

  const handleNewAccount = () => {
    navigation.navigate("signUp");
  };

  const handleSignIn = async ({ email, password }: LoginFormProps) => {
    setLoading(true);

    try {
      await signIn(email, password);
    } catch (error) {
      if (error instanceof AppError) {
        return toast.show({
          title: error.message,
          placement: "top",
          bgColor: "red.500",
        });
      }
      toast.show({
        title: "Não é possivel entrar. Tente novamente mais tarde.",
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setLoading(false);
    }
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
            Acesse sua conta
          </Heading>
          <Controller
            control={control}
            name={"email"}
            render={({ field: { value, onChange } }) => (
              <Input
                placeholder="E-mail"
                keyboardType={"email-address"}
                autoCapitalize={"none"}
                value={value}
                onChangeText={onChange}
                errorMessage={errors.email?.message}
              />
            )}
          />
          <Controller
            control={control}
            name={"password"}
            render={({ field: { value, onChange } }) => (
              <Input
                secureTextEntry
                placeholder="Senha"
                value={value}
                onChangeText={onChange}
                errorMessage={errors.password?.message}
                onSubmitEditing={handleSubmit(handleSignIn)}
                returnKeyType={"send"}
              />
            )}
          />

          <Button
            title={"Acessar"}
            onPress={handleSubmit(handleSignIn)}
            isLoading={loading}
          />
        </Center>
        <Center mt={24}>
          <Text mb={3} color={"gray.100"} fontFamily={"body"} fontSize={"sm"}>
            Ainda não tem acesso?
          </Text>
          <Button
            title={"Criar conta"}
            variant={"outline"}
            onPress={handleNewAccount}
          />
        </Center>
      </VStack>
    </ScrollView>
  );
};
