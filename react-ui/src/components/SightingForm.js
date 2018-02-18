import React from 'react'
import {Form, Message, Button, Segment } from 'semantic-ui-react'

class SightingForm extends React.Component  {
  constructor(props) {
    super(props)
    this.state = {
      visible: false
    }
  }

  toggleVisibility = (e) => {
    if (e) e.preventDefault()
    this.setState({ visible: !this.state.visible })
  }

  render() {

    const state = this.props.state
    const dropDownSpecies = state.speciesAll.map(species => ({ key: species.id, text: species.name, value: species.name }))
    const handleChange = this.props.handleChange
    const handleSubmit = this.props.handleSubmit
    const showWhenVisible = { display: this.state.visible ? '' : 'none' }
    const hideWhenVisible = { display: this.state.visible ? 'none' : '' }

    return (
      <Segment>
        <Button style={hideWhenVisible} primary onClick={this.toggleVisibility}>New Sighting</Button>
        <Form style={showWhenVisible} onSubmit={handleSubmit} error>
          <Message
            hidden={state.errors.length === 0}
            error={state.errors.length !== 0}
            header='Invalid input'
            list={state.errors}
          />
          <Form.Group>
            <Form.Select width={6} options={dropDownSpecies} label='Species' name='species' placeholder='Species' value={state.species} onChange={handleChange}/>
            <Form.Field width={6} control='input' type='number' label='Count' name='count' value={state.count} onChange={handleChange}/>
          </Form.Group>
          <Form.Group>
            <Form.Field width={6} control='input' type='date' label='Date' name='date' value={state.date} onChange={handleChange}/>
            <Form.Field width={6} control='input' type='time' label='Time' name='time' value={state.time} onChange={handleChange}/>
          </Form.Group>
          <Form.Group>
            <Form.TextArea width={12} label='Description' name='description' value={state.description} onChange={handleChange}/>
          </Form.Group>
          <Form.Group>
          <Form.Button primary content='Submit'/>
          <Button secondary onClick={this.toggleVisibility}>Cancel</Button>
          </Form.Group>
        </Form>
      </Segment>
    )
  }
}

export default SightingForm