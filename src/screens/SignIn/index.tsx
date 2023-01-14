import { ScrollView, VStack, Image, Text, Center, Heading } from "native-base";
import { useNavigation } from "@react-navigation/native";
import { AuthRoutesProps } from "@routes/auth.routes";
import BackGroundImg from "@assets/background.png";
import LogoSvg from "@assets/logo.svg";
import { Input } from "@components/Input";
import { Button } from "@components/Button";

export const SignIn = (): JSX.Element => {
  const navigation = useNavigation<AuthRoutesProps>();
  const handleNewAccount = () => {
    navigation.navigate("signUp");
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
          <Input
            placeholder="E-mail"
            keyboardType={"email-address"}
            autoCapitalize={"none"}
          />
          <Input secureTextEntry placeholder="Senha" />
          <Button title={"Acessar"} />
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
