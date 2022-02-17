import React, { useEffect, useState } from 'react'
import { Col, Row, Table } from 'react-bootstrap'
import GameLeaderBox from './GameLeaderBox'

const PlayerTab = (props) => {
  const { players, avatar,app } = props
  if (!players) {
    return ''
  }
  return (
    <>
      <h3 className='heading'>Game Leaders</h3>
      <Row>
        {players ? players.map((item, index) => {
          if (index < 3) {
            return (<Col xl={4} lg={4} md={6} sm={12} key={index}>
              <GameLeaderBox item={item} avatar={avatar} app={app} />
            </Col>)
          }
        }) : ''}
      </Row>
      <Table striped bordered hover size="sm" className='box-score-table'>
        <thead>
          <tr>
            <th>BOX SCORE</th>
            <th>PTS</th>
            <th>REB</th>
            <th>AST</th>
            <th>STL</th>
            <th>BLK</th>
            <th>TO</th>
            <th>FG</th>
             <th>3PM</th>
  
          </tr>
        </thead>
        <tbody>
          {players ? players.map((item, index) => <tr key={index}>
            <td>#{item?.number} {item?.name}</td>
            <td>{item?.['1g'] + 2 * item?.['2g'] + 3 * item?.['3g']}</td>
            <td>{item?.['or'] + item?.['r']}</td>
            <td>{item?.['a']}</td>
            <td>{item?.['s']}</td>
            <td>{item?.['b']}</td>
            <td>{item?.['t']}</td>
            <td>{(item?.['2g'] + item?.['3g'])} - {(item?.['2g'] + item?.['3g'] + item?.['2m'] + item?.['3m'])}</td>
             <td>{(item?.['3g'])} - {(item?.['3g'] + item?.['3m'])}</td>

          </tr>) : ''}
        </tbody>
      </Table>
    </>
  )
}

export default PlayerTab
