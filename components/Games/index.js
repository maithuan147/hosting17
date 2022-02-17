import Head from "next/head";
import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Container, Form, Col, Row } from "react-bootstrap";
import { AiOutlineSearch } from "react-icons/ai";
import { FaAngleRight, FaPlus } from "react-icons/fa";
import moment from "moment";
import "firebase/database";
import firebase from "firebase/app";
import databases from "../../ultils/databases";

export default function Games({ databaseId }) {
  const [games, setGames] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [avatar, setAvatar] = useState();
  const history = useRouter();

  const openGame = (id) => {
    history.push(`${databases[databaseId].id}/game/${id}`);
  };

  const getApp = useCallback(() => {
    let firebaseAppsName = [];
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

    return firebaseAppsName[databaseId];
  }, [databaseId]);

  useEffect(() => {
    const app = getApp();
    setAvatar(app?.image);
    if (app?.firebaseApp) {
      let myref = app.firebaseApp.database().ref("Games");
      setIsLoading(true);
      myref.on("value", (snap) => {
        let games = snap.val();
        let gamesData = [];
        for (const [key, value] of Object.entries(games)) {
          if (value.a_score) {
            gamesData.push({
              id: key,
              ...value,
            });
          }
        }
        setGames(gamesData);
        setIsLoading(false);
      });
    }
  }, [getApp]);
  const app = getApp();
  return (
    <Container className="game-container">
      <div className="header">
        <Head>
          <title>{app?.id} Stats</title>
          <meta name="title" content={`${app?.id} Stats`} />
          <meta name="description" content={`${app?.id} Stats`} />
          <meta property="og:type" content="website" />
          <meta property="og:title" content={`${app?.id} Stats`} />
          <meta property="og:description" content={`${app?.id} Stats`} />
          <meta property="og:image" content={app?.image} />

          <meta property="twitter:title" content={`${app?.id} Stats`} />
          <meta property="twitter:description" content={`${app?.id} Stats`} />
          <meta property="twitter:image" content={app?.image} />
        </Head>

        <h2 className="heading">All Games</h2>
        <FaPlus size={20} className="add-icon" />
      </div>
      <div className="search-container">
        <Form.Control
          type="text"
          placeholder="Search"
          className="search-input"
          onChange={(e) => setSearch(e.target.value.toLowerCase())}
        />
        <AiOutlineSearch className="icon-search" />
      </div>
      <div className="games-container">
        <Row>
          {isLoading ? <Col>Loading games...</Col> : ""}
          {games
            ? games
                .filter(
                  (i) =>
                    i.a_name.toLowerCase().includes(search) ||
                    i.h_name.toLowerCase().includes(search)
                )
                .sort(function (a, b) {
                  return b.last_updated - a.last_updated;
                })
                .map((item, index) => (
                  <Col key={index} xl={4} lg={4} md={6} sm={12}>
                    <div
                      className="game-wrapper"
                      onClick={() => openGame(item.id)}
                    >
                      <div
                        className="avatar"
                        style={{ backgroundImage: `url(${avatar}` }}
                      ></div>
                      <div className="game-info">
                        <div className="game-info__header">
                          {moment.duration(
                            moment(new Date()).diff(item?.last_updated)
                          ) > 600000 ? (
                            <div>FINAL</div>
                          ) : (
                            <div className="text-inprogress">
                              GAME IN PROGRESS
                            </div>
                          )}
                        </div>
                        <div className="game-info__team">
                          <div className="team__name">{item.a_name}</div>
                          <div className="team__score">{item?.a_score}</div>
                        </div>
                        <div className="game-info__team">
                          <div className="team__name">{item?.h_name}</div>
                          <div className="team__score">{item?.h_score}</div>
                        </div>
                        <div className="game-time">
                          {moment(item?.last_updated).format("LLL")}
                        </div>
                      </div>
                      <FaAngleRight size={30} className="right-arrow" />
                    </div>
                  </Col>
                ))
            : ""}
        </Row>
      </div>
    </Container>
  );
}
