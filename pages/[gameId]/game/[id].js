import Head from "next/head";
import databases from "../../../ultils/databases";
import { useRouter } from "next/router";
import GameDetails from "../../../components/GameDetails";
import firebase from "firebase/app";
import { useEffect, useState } from "react";

export default function GameId() {
  const history = useRouter();
  const [firebaseAppsName, setFirebaseAppsName] = useState([]);
  const databasesName = databases.map((data) => data.id);
  const databaseId = databasesName.indexOf(history.query.gameId);
  useEffect(() => {
    if (!firebase.apps.length && databaseId >= 0) {
      for (let i = 0; i < databases.length; i++) {
        if (!databases[i].firebaseConfig) {
          continue;
        }
        let newApp = {
          id: databases[i].id,
          image: databases[i].image,
          firebaseApp: firebase.initializeApp(
            databases[i].firebaseConfig,
            databases[i].id
          ),
        };
        firebaseAppsName.push(newApp);
      }
    } else {
      for (let i = 0; i < firebase.apps.length; i++) {
        let newApp = {
          id: databases[i].id,
          image: databases[i].image,
          firebaseApp: firebase.apps[i],
        };
        firebaseAppsName.push(newApp);
      }
    }
    setFirebaseAppsName([...firebaseAppsName]);
  }, [databaseId]);

  // if (firebaseAppsName.length === 0) return "Loading";

  return (
    <GameDetails
      app={firebaseAppsName[databaseId]}
      databaseId={databaseId}
      id={history.query.id}
      gameId={history.query.gameId}
    />
  );
}
