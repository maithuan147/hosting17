import React, { useEffect, useState } from "react";
import "firebase/storage";

const GameLeaderBox = (props) => {
  const { item, avatar, app } = props;
  const [avatarPlayer, setAvatarPlayer] = useState();
  useEffect(() => {
    if (app?.firebaseApp) {
      const getAvataPlayer = async () => {
        try {
          const avatarPlayer = await app.firebaseApp
            .storage()
            .ref(`Player/${item.id}/profile.png`)
            .getDownloadURL();
          setAvatarPlayer(avatarPlayer);
        } catch (error) {
          setAvatarPlayer(avatar);
        }
      };
      getAvataPlayer();
    }
  }, [app?.firebaseApp]);
  return (
    <div className="leader-player-container">
      <div
        className="avatar"
        style={{ backgroundImage: `${`url(${avatarPlayer})`}` }}
      ></div>
      <div className="player-detail">
        <div className="player-name">
          #{item?.number} {item?.name}
        </div>
        <div className="player-stats">
          <div className="stats-wrapper">
            <div className="point">
              <div align="center">
                <strong>
                  {item?.["1g"] + 2 * item?.["2g"] + 3 * item?.["3g"]}
                </strong>
              </div>
              <div className="stat">
                <strong>
                  <font color="gray"> PTS</font>
                </strong>
              </div>
            </div>
          </div>
          <div className="stats-wrapper">
            <div className="point">
              <div align="center">
                <strong>
                  {item?.["2g"] + item?.["3g"]} -{" "}
                  {item?.["2g"] + item?.["3g"] + item?.["2m"] + item?.["3m"]}
                </strong>
              </div>
              <div className="stat">
                <strong>
                  <font color="gray">FG</font>
                </strong>
              </div>
            </div>
          </div>
          <div className="stats-wrapper">
            <div className="point">
              <strong>{item?.["or"] + item?.["r"]}</strong>
            </div>
            <div className="stat">
              <strong>
                <font color="gray"> REB</font>
              </strong>
            </div>
          </div>
          <div className="stats-wrapper">
            <div className="point">
              <strong>{item?.["a"]}</strong>
            </div>
            <div className="stat">
              <strong>
                <font color="gray"> AST</font>
              </strong>
            </div>
          </div>
          <div className="stats-wrapper">
            <div className="point">
              <strong>{item?.["s"]}</strong>
            </div>
            <div className="stat">
              <strong>
                <font color="gray"> STL</font>
              </strong>
            </div>
          </div>
          <div className="stats-wrapper">
            <div className="point">
              <strong>{item?.["t"]}</strong>
            </div>
            <div className="stat">
              <strong>
                <font color="gray">TO</font>
              </strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameLeaderBox;
