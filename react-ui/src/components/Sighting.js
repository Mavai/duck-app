import React from 'react'
import { Table, List } from 'semantic-ui-react'
import moment from 'moment'

class Sighting extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false
    }
  }

  toggleVisibility = () => {
    this.setState({ visible: !this.state.visible })
  }

  render() {
    const showWhenVisible = { display: this.state.visible ? '' : 'none' }
    const sighting = this.props.sighting

    return (
      <Table.Row>
        <Table.Cell onClick={this.toggleVisibility}>
          <b>{sighting.species}</b> <br/>
          <List style={showWhenVisible}>
            <List.Item>
              <List.Content>
                <List.Header>Description:</List.Header>
                <List.Description>{sighting.description}</List.Description>
              </List.Content>
            </List.Item>
            <List.Item>
              <List.Content>
                <List.Header>Time:</List.Header>
                <List.Description>{moment(sighting.dateTime).format('HH:mm')}</List.Description>
              </List.Content>
            </List.Item>
          </List>
        </Table.Cell>
        <Table.Cell>
          {moment(sighting.dateTime).format('DD.MM.YYYY')}
        </Table.Cell>
      </Table.Row>
      
    )
  }
}

export default Sighting