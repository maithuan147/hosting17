import React, { useEffect, useState } from 'react'
import { Table } from 'react-bootstrap'
import { Line } from 'react-chartjs-2';
import StatItem from './StatItem';
import { BsChevronCompactDown } from 'react-icons/bs'
import { BsChevronCompactUp } from 'react-icons/bs'
import { Col, Row } from 'react-bootstrap'
import GameLeaderBox from './GameLeaderBox'


const mapEvent = {
  '1g': '1pt Make',
  '2g': '2pt Make',
  '3g': '3pt Make',
  '1m': '1pt Miss',
  '2m': '2pt Miss',
  '3m': '3pt Miss',
  'r': 'Rebound',
  'or': 'Rebound',
  't': 'Turnover',
  's': 'Steal',
  'a': 'Assist',
  'b': 'Block'
}

const mapPoint = {
  '1g': 1,
  '2g': 2,
  '3g': 3,
}

const PlayByPlayTab = (props) => {
  const { currentGame, eventData, homePlayers, awayPlayers, bothPlayers,avatar,app } = props
  const [events, setEvents] = useState([])
  const [graphData, setGraphData] = useState([])
  const [isDropdown, setIsDropDown] = useState(false)
  const [statsData, setStatsData] = useState({})

  useEffect(() => {
    if (awayPlayers && homePlayers && eventData) {
      let events = []
      let stats_initial = {
        shots_made: 0,
        total_shots: 0,
        made_3pt: 0,
        total_3pt_shots: 0,
        made_ft: 0,
        total_ft_shots: 0,
        three_pointers: 0,
        free_throws: 0,
        assists: 0,
        rebounds: 0,
        steals: 0,
        blocks: 0,
        turnovers: 0,
        fouls: 0,
        biggest_lead: 0
      }

      let stats_data = {
        home: { ...stats_initial },
        away: { ...stats_initial }
      }

      const mapTeam = (id) => {
        if (id === currentGame?.away) {
          return currentGame?.a_name
        }
        if (id === currentGame?.home) {
          return currentGame?.h_name
        }
      }

      const checkAwayOrHome = id => {
        if (id === currentGame?.away) {
          return 'away'
        }
        if (id === currentGame?.home) {
          return 'home'
        }
      }

      const mapPlayer = (id) => {
        let homePlayer = homePlayers.find(i => i.id === id)
        if (homePlayer) {
          return homePlayer
        }

        let awayPlayer = awayPlayers.find(i => i.id === id)
        if (awayPlayer) {
          return awayPlayer
        }
      }

      const mapStatData = (stats_data, event, awayOrHome, newEvent) => {

        switch (event) {
          case '2g':
            stats_data[awayOrHome].shots_made += 1
            stats_data[awayOrHome].total_shots += 1
            break;
          case '3g':
            stats_data[awayOrHome].shots_made += 1
            stats_data[awayOrHome].total_shots += 1
            stats_data[awayOrHome].made_3pt += 1
            stats_data[awayOrHome].total_3pt_shots += 1
            break;
          case '2m':
            stats_data[awayOrHome].total_shots += 1
            break;
          case '3m':
            stats_data[awayOrHome].total_shots += 1
            stats_data[awayOrHome].total_3pt_shots += 1
            break;
          case '1g':
            stats_data[awayOrHome].made_ft += 1
            stats_data[awayOrHome].total_ft_shots += 1
            break;
          case '1m':
            stats_data[awayOrHome].total_ft_shots += 1
            break;
          case 'r':
            stats_data[awayOrHome].rebounds += 1
            break;
          case 'or':
            stats_data[awayOrHome].rebounds += 1
            break;
          case 't':
            stats_data[awayOrHome].turnovers += 1
            break;
          case 's':
            stats_data[awayOrHome].steals += 1
            break;
          case 'a':
            stats_data[awayOrHome].assists += 1
            break;
          case 'b':
            stats_data[awayOrHome].blocks += 1
            break;
          case 'fp':
            stats_data[awayOrHome].fouls += 1
            break;
          case 'ft':
            stats_data[awayOrHome].fouls += 1
            break;
          case 'ff':
            stats_data[awayOrHome].fouls += 1
            break;
          default:
            break;
        }
        if (newEvent?.homePoint > newEvent?.awayPoint) {
          let new_biggest_lead = newEvent?.homePoint - newEvent?.awayPoint
          if (stats_data.home.biggest_lead < new_biggest_lead) {
            stats_data.home.biggest_lead = new_biggest_lead
          }
        }
        if (newEvent?.homePoint < newEvent?.awayPoint) {
          let new_biggest_lead = newEvent?.awayPoint - newEvent?.homePoint
          if (stats_data.away.biggest_lead < new_biggest_lead) {
            stats_data.away.biggest_lead = new_biggest_lead
          }
        }
      }

      let awayPoint = 0
      let homePoint = 0
      for (let i = 0; i < eventData.length; i++) {
        let event = eventData[i].split(' ')
        if (event.length === 3) {
          let newEvent = {
            awayOrHome: checkAwayOrHome(event[0]),
            team: mapTeam(event[0]),
            player: mapPlayer(event[1]),
            event: mapEvent?.[event[2]],
            homePoint: checkAwayOrHome(event[0]) === 'home' ? homePoint += mapPoint?.[event[2]] || 0 : homePoint,
            awayPoint: checkAwayOrHome(event[0]) === 'away' ? awayPoint += mapPoint?.[event[2]] || 0 : awayPoint,
          }
          events.push(newEvent)
          mapStatData(stats_data, event[2], checkAwayOrHome(event[0]), newEvent)
        }
        if (event.length === 2) {
          let newEvent = {
            awayOrHome: checkAwayOrHome(event[0]),
            team: mapTeam(event[0]),
            player: '',
            event: mapEvent?.[event[1]],
            homePoint: checkAwayOrHome(event[0]) === 'home' ? homePoint += mapPoint?.[event[1]] || 0 : homePoint,
            awayPoint: checkAwayOrHome(event[0]) === 'away' ? awayPoint += mapPoint?.[event[1]] || 0 : awayPoint,
          }
          events.push(newEvent)
          mapStatData(stats_data, event[1], checkAwayOrHome(event[0]), newEvent)
        }
      }
      setStatsData(stats_data)

      setEvents(events.reverse())

      events = JSON.parse(JSON.stringify(events))
      events.reverse()

      let xAxisMap = events.map((_, index) => index)
      let homePointGraph = events.map(i => i.homePoint)
      let awayPointGraph = events.map(i => i.awayPoint)
      let graphData = {
        labels: xAxisMap,
        datasets: [
          {
            label: currentGame?.h_name,
            fill: false,
            lineTension: 0,
            borderColor: '#7494b1',
            data: homePointGraph
          },
          {
            label: currentGame?.a_name,
            fill: false,
            lineTension: 0,
            borderColor: '#000',
            data: awayPointGraph
          },
        ],
      }
      setGraphData(graphData)
    }
  }, [eventData, homePlayers, awayPlayers])

  if (!currentGame || !eventData) {
    return 'Loading stats...'
  }

  const options = {
    scales: {
      yAxes: [{
        display: true,
        position: 'right',
      }],
      xAxes: [{
        display: false,
      }]
    }
  }
  let players = Number(currentGame?.a_score) > Number(currentGame?.h_score) ? awayPlayers : homePlayers
  if (!players || players?.length < 1) {
    players = awayPlayers.concat(homePlayers)
  }

  const stats = [
    {
      id: 'field_goals',
      title: 'FIELD GOALS',
      showPercent: true,
      showPreview: true,
      home: {
        percent: (statsData?.home?.shots_made / statsData?.home?.total_shots) * 100 || 0,
        score: statsData?.home?.shots_made,
        total: statsData?.home?.total_shots,
      },
      away: {
        percent: (statsData?.away?.shots_made / statsData?.away?.total_shots) * 100 || 0,
        score: statsData?.away?.shots_made,
        total: statsData?.away?.total_shots,
      },
    },
    {
      id: 'three_pointers',
      title: 'THREE POINTERS',
      showPercent: true,
      showPreview: true,
      home: {
        percent: (statsData?.home?.made_3pt / statsData?.home?.total_3pt_shots) * 100 || 0,
        score: statsData?.home?.made_3pt,
        total: statsData?.home?.total_3pt_shots,
      },
      away: {
        percent: (statsData?.away?.made_3pt / statsData?.away?.total_3pt_shots) * 100 || 0,
        score: statsData?.away?.made_3pt,
        total: statsData?.away?.total_3pt_shots,
      },
    },
    {
      id: 'free_throws',
      title: 'FREE THROWS',
      showPercent: true,
      showPreview: true,
      home: {
        percent: (statsData?.home?.made_ft / statsData?.home?.total_ft_shots) * 100 || 0,
        score: statsData?.home?.made_ft,
        total: statsData?.home?.total_ft_shots,
      },
      away: {
        percent: (statsData?.away?.made_ft / statsData?.away?.total_ft_shots) * 100 || 0,
        score: statsData?.away?.made_ft,
        total: statsData?.away?.total_ft_shots,
      },
    },
    {
      id: 'rebounds',
      title: 'REBOUNDS',
      showPreview: true,
      home: {
        score: statsData?.home?.rebounds,
      },
      away: {
        score: statsData?.away?.rebounds,
      },
    },
    {
      id: 'turnovers',
      title: 'TURNOVERS',
      showPreview: true,
      home: {
        score: statsData?.home?.turnovers + statsData?.away?.steals,
      },
      away: {
        score: statsData?.away?.turnovers + statsData?.home?.steals,
      },
    },
    {
      id: 'fouls',
      title: 'FOULS',
      showPreview: true,
      home: {
        score: statsData?.home?.fouls,
      },
      away: {
        score: statsData?.away?.fouls,
      },
    },
    {
      id: 'assists',
      title: 'ASSISTS',
      home: {
        score: statsData?.home?.assists,
      },
      away: {
        score: statsData?.away?.assists,
      },
    },
    {
      id: 'steals',
      title: 'STEALS',
      showPreview: false,
      home: {
        score: statsData?.home?.steals,
      },
      away: {
        score: statsData?.away?.steals,
      },
    },
    {
      id: 'blocks',
      title: 'BLOCKS',
      showPreview: false,
      home: {
        score: statsData?.home?.blocks,
      },
      away: {
        score: statsData?.away?.blocks,
      },
    },
    {
      id: 'biggest_lead',
      title: 'BIGGEST LEAD',
      showPreview: false,
      home: {
        score: statsData?.home?.biggest_lead,
      },
      away: {
        score: statsData?.away?.biggest_lead,
      },
    },
  ]

  return (
    <>
      <div className='stats-container'>
        {stats.filter(i => i?.showPreview).map((item, index) => (
          <StatItem item={item} key={index} />
        ))}
        {isDropdown ? <>
          {stats.filter(i => !i?.showPreview).map((item, index) => (
            <StatItem item={item} key={index} />
          ))}
        </> : ''}
        <div className='dropdown-wrapper'>
          {isDropdown
            ? <div className='dropdown-button' onClick={() => setIsDropDown(false)}>
              <BsChevronCompactUp size={25} />
            </div>
            : <div className='dropdown-button' onClick={() => setIsDropDown(true)}>
              <BsChevronCompactDown size={25} />
            </div>}
        </div>
      </div>
       <h3 className='heading'>Game Leaders</h3>
      <Row>
        {/* {console.log(bothPlayers)} */}
        {players ? bothPlayers.map((item, index) => {
          if (index < 3) {
            return (<Col xl={4} lg={4} md={6} sm={12} key={index}>
              <GameLeaderBox item={item} avatar={avatar} app={app} />
            </Col>)
          }
        }) : ''}
      </Row>
      <h3 className='heading'>Gamecast</h3>
      <div className='chart-container'>
        <Line data={graphData} options={options} />
      </div>
      <h3 className='heading'>Play-by-Play</h3>
      <Table striped bordered hover size="sm" className='box-score-table'>
        <thead>
          <tr>
            <th>Team</th>
            <th>Play</th>
            <th style={{ width: '90px' }}>Score</th>
          </tr>
        </thead>
        <tbody>
          {events && events.map((item, idx) => <tr key={idx}>
            <td>{item.team}</td>
            <td>{item.player ? `#${item.player?.number} ${item.player?.name} ` : item.team} {item.event}</td>
            <td style={{ color: '#7494b1' }}>{item.awayPoint} - {item.homePoint}</td>
          </tr>)}
        </tbody>
      </Table>
    </>
  )
}

export default PlayByPlayTab
