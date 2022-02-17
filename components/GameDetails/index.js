import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Container, Tabs, Tab } from "react-bootstrap";
import { FaAngleLeft } from "react-icons/fa";
import moment from "moment";
import "firebase/database";
import "firebase/storage";
import PlayerTab from "./PlayerTab";
import PlayByPlayTab from "./PlayByPlayTab";
import Head from "next/head";

const GameDetails = ({ app, databaseId, id, gameId }) => {
  const [currentGame, setCurrentGame] = useState("");
  const [homePlayers, setHomePlayers] = useState("");
  const [awayPlayers, setAwayPlayers] = useState("");
  const [bothplayers, setBothPlayers] = useState("");
  const [avatar, setAvatar] = useState();
  const [leftTeam, setLeftTeam] = useState();
  const [rightTeam, setRightTeam] = useState();
  const [eventData, setEventData] = useState([]);
  const [isLoadingPlayer, setIsLoadingPlayer] = useState(true);
  const [stats, setStats] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [key, setKey] = useState("");
  const history = useRouter();
  useEffect(() => {
    setAvatar(app?.image);
    if (app?.firebaseApp) {
      let gameRef = app.firebaseApp.database().ref("Games/" + id);
      gameRef.on("value", async (snap) => {
        let gameData = snap.val();
        setCurrentGame(gameData);
        try {
          const leftTeam = await app.firebaseApp
            .storage()
            .ref(`Team/${gameData.away}/profile.png`)
            .getDownloadURL();
          setLeftTeam(leftTeam);
        } catch (error) {
          setLeftTeam();
        }

        try {
          const rightTeam = await app.firebaseApp
            .storage()
            .ref(`Team/${gameData.home}/profile.png`)
            .getDownloadURL();
          setRightTeam(rightTeam);
        } catch (error) {
          setRightTeam();
        }
        setIsLoading(false);
      });
    }
  }, [app, id]);

  useEffect(() => {
    if (currentGame && app?.firebaseApp) {
      setKey(currentGame?.a_name);

      let playerRef = app.firebaseApp.database().ref("Player");
      playerRef.on("value", (snap) => {
        let playerData = snap.val();
        let homePlayers = [];
        let awayPlayers = [];
        let bothplayers = [];

        for (const [key, value] of Object.entries(playerData)) {
          if (value?.assignedTeams) {
            for (const [key2, value2] of Object.entries(value?.assignedTeams)) {
              if (value2 === currentGame.away) {
                if (!awayPlayers.find((v) => v.id === key)) {
                  awayPlayers.push({ id: key, ...value });
                  bothplayers.push({ id: key, ...value });
                }
              }
              if (value2 === currentGame.home) {
                if (!homePlayers.find((v) => v.id === key)) {
                  homePlayers.push({ id: key, ...value });
                  bothplayers.push({ id: key, ...value });
                }
              }
            }
          }
        }
        setHomePlayers(homePlayers || []);
        setAwayPlayers(awayPlayers || []);
        setBothPlayers(bothplayers || []);
        setIsLoadingPlayer(false);
      });

      let eventRef = app.firebaseApp
        .database()
        .ref("Events/" + currentGame?.events_id);
      eventRef.on("value", (snap) => {
        let eventData = snap.val();
        setEventData(eventData);
      });
    }
  }, [currentGame, app, id]);

  useEffect(() => {
    if (!isLoadingPlayer && app?.firebaseApp) {
      let statRef = app.firebaseApp.database().ref("Stats/Player");
      statRef.on("value", (snap) => {
        let statData = snap.val();
        setHomePlayers((prev) => {
          let players = JSON.parse(JSON.stringify(prev));
          for (let i = 0; i < players.length; i++) {
            players[i] = {
              ...players[i],
              ...statData?.[players[i].id].game?.[id],
            };
          }
          players.sort(
            (a, b) =>
              b?.["1g"] +
              2 * b?.["2g"] +
              3 * b?.["3g"] -
              (a?.["1g"] + 2 * a?.["2g"] + 3 * a?.["3g"])
          );
          return players;
        });
        setAwayPlayers((prev) => {
          let players = JSON.parse(JSON.stringify(prev));
          for (let i = 0; i < players.length; i++) {
            players[i] = {
              ...players[i],
              ...statData?.[players[i].id].game?.[id],
            };
          }
          players.sort(
            (a, b) =>
              b?.["1g"] +
              2 * b?.["2g"] +
              3 * b?.["3g"] -
              (a?.["1g"] + 2 * a?.["2g"] + 3 * a?.["3g"])
          );
          return players;
        });
        setBothPlayers((prev) => {
          let players = JSON.parse(JSON.stringify(prev));
          for (let i = 0; i < players.length; i++) {
            players[i] = {
              ...players[i],
              ...statData?.[players[i].id].game?.[id],
            };
          }
          players.sort(
            (a, b) =>
              b?.["1g"] +
              2 * b?.["2g"] +
              3 * b?.["3g"] -
              (a?.["1g"] + 2 * a?.["2g"] + 3 * a?.["3g"])
          );
          return players;
        });
      });
    }
  }, [isLoadingPlayer, app, id]);

  const goBack = () => {
    history.push(`/${gameId}`);
  };

  if (isLoading) {
    return "Loading games...";
  }

  if (!currentGame) {
    return "No game found";
  }
  return (
    <div className="white-bg">
      <Head>
        <title>
          {currentGame?.a_name} vs. {currentGame?.h_name}
        </title>
        <meta
          name="title"
          content={`${currentGame?.a_name} vs. ${currentGame?.h_name}`}
        />
        <meta
          name="description"
          content={`${currentGame?.a_name} vs. ${currentGame?.h_name}`}
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content={`${currentGame?.a_name} vs. ${currentGame?.h_name}`}
        />
        <meta
          property="og:description"
          content={`${currentGame?.a_name} vs. ${currentGame?.h_name}`}
        />
        <meta property="og:image" content={app?.image} />

        <meta
          property="twitter:title"
          content={`${currentGame?.a_name} vs. ${currentGame?.h_name}`}
        />
        <meta
          property="twitter:description"
          content={`${currentGame?.a_name} vs. ${currentGame?.h_name}`}
        />
        <meta property="twitter:image" content={app?.image} />
      </Head>

      <Container className="game-detail-container">
        <div className="header">
          <FaAngleLeft
            size={30}
            className="left-arrow"
            onClick={() => goBack()}
          />
          <div className="date">
            {moment(currentGame?.last_updated).format("LL")}
          </div>
        </div>
        <div className="game-body">
          <div className="game-wrapper">
            <div
              className="avatar"
              style={{
                backgroundImage: `${
                  leftTeam ? `url(${leftTeam})` : `url(${avatar})`
                }`,
              }}
            >
              <div className="team-name">{currentGame?.a_name}</div>
            </div>
            <div className="team-score" style={{ marginLeft: 30 }}>
              {currentGame?.a_score}
            </div>
          </div>
          <div className="game-wrapper">
            <div className="team-score" style={{ marginRight: 30 }}>
              {currentGame?.h_score}
            </div>
            <div
              className="avatar"
              style={{
                backgroundImage: `${
                  rightTeam ? `url(${rightTeam})` : `url(${avatar})`
                }`,
              }}
            >
              <div className="team-name">{currentGame?.h_name}</div>
            </div>
          </div>
          {moment.duration(moment(new Date()).diff(currentGame?.last_updated)) >
          600000 ? (
            <div className="text-final">FINAL</div>
          ) : (
            <div className="text-final text-inprogress">LIVE</div>
          )}
        </div>
        <div className="game-stats">
          {isLoadingPlayer ? (
            <div>Loading player stats...</div>
          ) : (
            <Tabs defaultActiveKey="play-by-play">
              <Tab eventKey="play-by-play" title="Game Recap">
                <PlayByPlayTab
                  currentGame={currentGame}
                  eventData={eventData}
                  homePlayers={homePlayers}
                  awayPlayers={awayPlayers}
                  bothPlayers={bothplayers}
                  avatar={avatar}
                  app={app}
                />
              </Tab>
              <Tab
                eventKey={currentGame?.away}
                title={currentGame?.a_name + "\nTeam Stats"}
              >
                <PlayerTab players={awayPlayers} avatar={avatar} app={app} />
              </Tab>
              <Tab
                eventKey={currentGame?.home}
                title={currentGame?.h_name + "\nTeam Stats"}
              >
                <PlayerTab players={homePlayers} avatar={avatar} app={app} />
              </Tab>
            </Tabs>
          )}
        </div>
      </Container>
    </div>
  );
};

export default GameDetails;
