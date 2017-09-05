import React, { PropTypes } from 'react'

const awayTimeout = 5 * 1000
const lostTimeout = 60 * 1000

const stateColors = {
  selected: 'hsl(187, 100%, 42%)',
  normal: 'hsl(115, 100%, 42%)',
  away: 'hsl(50, 100%, 42%)',
  error: 'hsl(0, 100%, 42%)',
  lost: 'hsl(0, 0%, 42%)'
}

/**
 * Element for displaying a number on a colored background.
 */
const ColoredContainer = ({ color, title, text }) => (
  <span className={'coloredContainer'} style={{
    padding: '5px',
    borderRadius: '10px',
    color: 'white',
    margin: '0px 5px',

    backgroundColor: color
  }}>
    <span>{title}: </span>
    {text}
  </span>
)

/**
 * Element for monitoring the count of UAVs in different states.
 */
class CountMonitor extends React.Component {
  constructor (props) {
    super(props)

    this.knownUAVIds = []
  }

  render () {
    const { selectedUAVIds, uavs } = this.props

    const selectedCount = selectedUAVIds.length

    const now = Date.now()

    const lostCount = uavs.filter(u => (now - u.lastUpdated) > lostTimeout).size
    const awayCount = uavs.filter(
      u => (now - u.lastUpdated) > awayTimeout
    ).size - lostCount

    const errorCount = 1 // Temporary constant to force display the indicator.

    const normalCount = uavs.size - awayCount - errorCount - lostCount

    return (
      <div style={{ padding: '10px' }}>
        <span>
          Count Monitor:
          <ColoredContainer
            color={stateColors.selected}
            title={'Selected'}
            text={`${selectedCount}`} />
          /
          <ColoredContainer
            color={stateColors.normal}
            title={'Normal'}
            text={`${normalCount}`} />

          {
            awayCount > 0 &&
            <span>
              + <ColoredContainer
                color={stateColors.away}
                title={'Away'}
                text={`${awayCount}`} />
            </span>
          }

          {
            errorCount > 0 &&
            <span>
              + <ColoredContainer
                color={stateColors.error}
                title={'Errored'}
                text={`${errorCount}`} />
            </span>
          }

          {
            lostCount > 0 &&
            <span>
              + <ColoredContainer
                color={stateColors.lost}
                title={'Lost'}
                text={`${lostCount}`} />
            </span>
          }
        </span>
      </div>
    )
  }
}

CountMonitor.propTypes = {
  selectedUAVIds: PropTypes.arrayOf(PropTypes.string)
}

export default CountMonitor