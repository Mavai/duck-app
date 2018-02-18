import React from 'react'
import moment from 'moment'
import { Container, Table, Header, Input } from 'semantic-ui-react'
import sightingsService from './services/sightings'
import speciesService from './services/species'
import SightingForm from './components/SightingForm'
import Pagination from './components/Pagination'
import Sighting from './components/Sighting'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.sightingsForm = null
    this.state = {
      errors: [],
      sightings: [],
      speciesAll: [],
      date: moment().format(moment.HTML5_FMT.DATE),
      time: moment().format(moment.HTML5_FMT.TIME),
      direction: 'ascending',
      description: '',
      species: '',
      filter: '',
      currentPage: 1,
      pageSize: 10,
      count: 1
    }
  }

  componentDidMount = async () => {
    let sightings = await sightingsService.getAll()
    const speciesAll = await speciesService.getAll()
    sightings = sightings.sort(this.compareSightingTime)
    this.setState({ sightings, speciesAll })
  }

  compareSightingTime = (a, b) => {
    const direction = this.state.direction === 'ascending' ? 1 : -1
    return (Date.parse(b.dateTime) - Date.parse(a.dateTime)) * direction
  }

  reverseOrder = () => {
    const sightings = this.state.sightings.reverse()
    this.setState({ 
      sightings,
      direction: this.state.direction === 'ascending' ? 'descending' : 'ascending'
    })
  }

  handleInputChange = (event, data) => {
    if (data) this.setState({ [data.name]: data.value })
    else this.setState({ [event.target.name]: event.target.value })
  }

  handleFilterChange = (event, data) => {
    const filter = data.value
    this.setState({ filter, currentPage: 1 })
  }

  handleSubmit = async (event) => {
    event.preventDefault()
    const sighting = {
      species: this.state.species,
      count: this.state.count,
      description: this.state.description,
      dateTime: new Date(Date.parse(`${this.state.date} ${this.state.time}`)).toISOString()
    }
    await this.validate(sighting)
    if (this.state.errors.length === 0) {
      const newSighting = await sightingsService.create(sighting)
      const sightings = this.state.sightings.concat(newSighting).sort(this.compareSightingTime)
      this.setState({
        sightings,
        count: 1,
        species: '',
        description: '',
        date: moment().format(moment.HTML5_FMT.DATE),
        time: moment().format(moment.HTML5_FMT.TIME)
      })
      this.sightingsForm.toggleVisibility()
    }
  }

  validate = (sighting) => {
    let errors = []
    if (!this.state.speciesAll.find(species => species.name === sighting.species)){
      errors = errors.concat('That species doesn\'t exist')
    }
    if (sighting.count <= 0) errors = errors.concat('Count must be at least 1')
    this.setState({ errors })
  }

  sightingsOnPage = (sightings) => {
    const currentPage = this.state.currentPage
    const startIndex = (currentPage - 1) * this.state.pageSize
    const endIndex = startIndex + this.state.pageSize
    const sightingsOnPage = sightings.slice(startIndex , endIndex)
    return sightingsOnPage
  }

  handlePageChange = (event, data) => {
    let currentPage = 1
    if (data.name === 'previous') currentPage = this.state.currentPage - 1
    else if (data.name === 'next') currentPage = this.state.currentPage + 1
    else currentPage = Number(data.name)
    this.setState({ currentPage })
  }

  render() {
    const filteredSightings = this.state.sightings.filter(sighting => sighting.species.toLowerCase().includes(this.state.filter.toLowerCase()))
    const sightingsOnPage = this.sightingsOnPage(filteredSightings)
    const pageCount = Math.ceil(filteredSightings.length / this.state.pageSize)

    return (
      <Container >
        <Header as='h1'>Duck sightings</Header>
        <SightingForm
          state={this.state}
          handleSubmit={this.handleSubmit}
          handleChange={this.handleInputChange}
          ref={component => this.sightingsForm = component}
        />
        <Input icon='search' placeholder='Search...' name='filter' value={this.state.filter} onChange={this.handleFilterChange}/>
        <Table striped selectable unstackable sortable>
          <Table.Header>
            <Table.Row className="d-flex">
              <Table.HeaderCell width={10}>Species</Table.HeaderCell>
              <Table.HeaderCell width={2} sorted={this.state.direction} onClick={this.reverseOrder}>Date</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {sightingsOnPage.map(sighting => 
              <Sighting key={sighting.id} sighting={sighting}/>
            )}
          </Table.Body>
          <Table.Footer>
            <Table.Row>
              <Table.HeaderCell colSpan='2'>
                <Pagination state={this.state} handlePageChange={this.handlePageChange} pageCount={pageCount}/>
              </Table.HeaderCell>
            </Table.Row>
          </Table.Footer>
        </Table>
      </Container>
    )
  }
}

export default App
