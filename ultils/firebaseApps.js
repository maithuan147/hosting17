import firebase from "firebase/app";
import databases from "./databases";

const firebaseApps = () => {
  let firebaseAppsName = [];
  if (!firebase.apps.length) {
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
  }
  return firebaseAppsName;
};

export default firebaseApps;
