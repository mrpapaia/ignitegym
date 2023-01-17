import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { useTheme, Box } from "native-base";
import { AppRoutes } from "./app.routes";

import { AuthRoutes } from "./auth.routes";

import { useAuth } from "@hooks/useAuth";
import { Loading } from "@components/Loading";

export const Routes = () => {
  const { colors } = useTheme();
  const { user, loading } = useAuth();
  const theme = DefaultTheme;
  theme.colors.background = colors.gray[700];

  if (loading) {
    return <Loading />;
  }

  return (
    <Box flex={1} bg={"gray.700"}>
      <NavigationContainer theme={theme}>
        {user.email ? <AppRoutes /> : <AuthRoutes />}
      </NavigationContainer>
    </Box>
  );
};
