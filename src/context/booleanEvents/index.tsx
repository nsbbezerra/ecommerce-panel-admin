import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from "react";

type BooleanEventsProps = {
  isSiderOpen: boolean;
};

type PropsBooleanEventsContext = {
  is: BooleanEventsProps;
  setIs: Dispatch<SetStateAction<BooleanEventsProps>>;
};

const DEFAULT_VALUE = {
  is: {
    isSiderOpen: false,
  },
  setIs: () => {},
};

const BooleanEventsContext =
  createContext<PropsBooleanEventsContext>(DEFAULT_VALUE);

type ProviderProps = {
  children: ReactNode | ReactNode[];
};

const BooleanEventsProvider = ({ children }: ProviderProps) => {
  const [is, setIs] = useState(DEFAULT_VALUE.is);

  return (
    <BooleanEventsContext.Provider value={{ is, setIs }}>
      {children}
    </BooleanEventsContext.Provider>
  );
};

export { BooleanEventsProvider };

export default BooleanEventsContext;
