export type AuthStackParams = {
  Login: undefined;
  Register: undefined;
};

export type HomeStackParams = {
  Home: undefined;
};

export type ListsStackParams = {
  Lists: undefined;
  ListDetail: { categoryId: string; categoryTitle: string };
};

export type AppTabParams = {
  HomeTab: undefined;
  ListsTab: undefined;
  SearchTab: undefined;
  ProfileTab: undefined;
};
