import { HistoryProvider } from "./History";

type RootContextProviderProps = {
  children?: React.ReactNode;
};

const RootContextProvider: React.FC<RootContextProviderProps> = ({
  children,
}) => {
  return <HistoryProvider>{children}</HistoryProvider>;
};

export default RootContextProvider;
