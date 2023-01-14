import { ScrollView, VStack, Image, Text, Center, Heading } from "native-base";
import { useNavigation } from "@react-navigation/native";
import { AuthRoutesProps } from "@routes/auth.routes";

import BackGroundImg from "@assets/background.png";
import LogoSvg from "@assets/logo.svg";
import { Input } from "@components/Input";
import { Button } from "@components/Button";

export const SignUp = (): JSX.Element => {
  const navigation = useNavigation();

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
          <Input placeholder="Nome" />
          <Input
            placeholder="E-mail"
            keyboardType={"email-address"}
            autoCapitalize={"none"}
          />
          <Input secureTextEntry placeholder="Senha" />
          <Button title={"Criar e acessar"} />
          <Button
            mt={24}
            title={"Voltar para o Login"}
            variant={"outline"}
            onPress={handleGoBack}
          />
        </Center>
      </VStack>
    </ScrollView>
  );
};
