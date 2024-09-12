import { DateProvider } from "@/context/DateContext";

const RecordsLayout = ({ children }) => {
  return <DateProvider>{children}</DateProvider>;
};

export default RecordsLayout;
