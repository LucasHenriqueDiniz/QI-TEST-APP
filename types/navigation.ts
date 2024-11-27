import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

export type RootStackParamList = {
  Home: undefined;
  Test: undefined;
  Results: {
    answers: string;
    age: number;
  };
  Profile: undefined;
  About: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> = {
  navigation: NativeStackNavigationProp<RootStackParamList, T>;
  route: {
    key: string;
    name: T;
    params: RootStackParamList[T];
  };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
