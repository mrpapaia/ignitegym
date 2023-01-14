import {
  createStackNavigator,
  StackNavigationProp,
} from "@react-navigation/stack";
import { SignIn } from "@screens/SignIn";
import { SignUp } from "@screens/SignUp";

type AuthRoutes = {
  signIn: undefined;
  signUp: undefined;
};

export type AuthRoutesProps = StackNavigationProp<AuthRoutes>;

const { Navigator, Screen } = createStackNavigator<AuthRoutes>();

export const AuthRoutes = () => {
  return (
    <Navigator screenOptions={{ headerShown: false }}>
      <Screen name="signIn" component={SignIn} />
      <Screen name="signUp" component={SignUp} />
    </Navigator>
  );
};
