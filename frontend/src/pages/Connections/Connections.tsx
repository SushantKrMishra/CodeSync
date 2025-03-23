import ErrorIndicator from "../../components/ErrorIndicator";
import LoadingIndicator from "../../components/LoadingIndicator";
import { ConnectionUser } from "../ConnectionSuggestion/hooks";
import { useConnections } from "./hooks";

const Connections = () => {
  const { data, isPending, isError } = useConnections();

  if (isError) {
    return <ErrorIndicator />;
  }

  if (isPending || data === undefined) {
    return <LoadingIndicator />;
  }

  return <ConnectionsView data={data} />;
};

export default Connections;

type Props = {
  data: ConnectionUser[];
};

const ConnectionsView: React.FC<Props> = ({ data }) => {
  console.log(data);
  return <>data</>;
};
