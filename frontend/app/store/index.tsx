import { WalletProvider } from "./Wallet";
type RootContextProviderProps = {
  children?: React.ReactNode;
};
const RootContextProvider: React.FC<RootContextProviderProps> = ({
  children,
}) => {
  return <WalletProvider>{children}</WalletProvider>;
};
export default RootContextProvider;
