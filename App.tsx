import { Text, View, StatusBar } from "react-native";
import { NativeBaseProvider } from "native-base";
import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold,
} from "@expo-google-fonts/roboto";
import { Loading } from "@components/Loading";

import { THEME } from "./src/theme";

import { Routes } from "@routes/index";

export default function App() {
  const [fontsLoades] = useFonts({ Roboto_400Regular, Roboto_700Bold });
  return (
    <NativeBaseProvider theme={THEME}>
      <StatusBar
        translucent
        barStyle={"light-content"}
        backgroundColor={"transparent"}
      />
      {fontsLoades ? <Routes /> : <Loading />}
    </NativeBaseProvider>
  );
}
