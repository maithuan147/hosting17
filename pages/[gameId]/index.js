import Head from "next/head";
import Games from "../../components/Games";
import databases from "../../ultils/databases";
import { useRouter } from "next/router";

export default function GameId() {
  const history = useRouter();
  const databasesName = databases.map((data) => data.id);
  const databaseId = databasesName.indexOf(history.query.gameId);
  console.log(history.query.gameId);
  return (
    <>
      <Games databaseId={databaseId} />
    </>
  );
}
