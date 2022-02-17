import React, { useEffect, useState } from "react";
import { roundNumber } from "../../ultils";

const StatItem = (props) => {
  const { item } = props;

  /*let isLeadingAway = (item?.showPercent
    ? item.away?.percent > item.home?.percent
    : item.away?.score > item.home?.score)
    && (item?.showPercent ? item.away?.percent !== 0 : item.away?.score !== 0)

  let isLeadingHome = (item?.showPercent
    ? item.away?.percent < item.home?.percent
    : item.away?.score < item.home?.score)
    && (item?.showPercent ? item.home?.percent !== 0 : item.home?.score !== 0)*/

  let isLeadingAway =
    item.away?.score > item.home?.score &&
    (item?.showPercent ? item.away?.percent !== 0 : item.away?.score !== 0);

  let isLeadingHome =
    item.away?.score < item.home?.score &&
    (item?.showPercent ? item.home?.percent !== 0 : item.home?.score !== 0);

  if (item.reverseColor && (isLeadingAway || isLeadingHome)) {
    isLeadingAway = !isLeadingAway;
    isLeadingHome = !isLeadingHome;
  }

  return (
    <div className="stat-item">
      <div className="item-score away">
        <div className="score-point">
          {item?.showPercent ? (
            <>
              {`${roundNumber(item.away?.percent)}%`} ({item.away?.score}/
              {item.away?.total || 0})
            </>
          ) : (
            item.away?.score || 0
          )}
        </div>
        <div
          className={`score-bar ${isLeadingAway ? "bar-blue" : "bar-gray"}`}
        ></div>
      </div>
      <div className="item-title">{item.title}</div>
      <div className="item-score home">
        <div
          className={`score-bar ${isLeadingHome ? "bar-blue" : "bar-gray"}`}
        ></div>
        <div className="score-point">
          {item?.showPercent ? (
            <>
              {`${roundNumber(item.home?.percent)}%`} ({item.home?.score}/
              {item.home?.total || 0})
            </>
          ) : (
            item.home?.score || 0
          )}
        </div>
      </div>
    </div>
  );
};

export default StatItem;
