const Reactor = require('../lib/reactor')
const React = require('react')
const ReactDOM = require('react-dom')

class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      data: []
    }
    this.refreshData = this.refreshData.bind(this)
  }

  componentDidMount () {
    this.refreshData()
  }

  refreshData () {
    const data = [
      { 'key': 1, 'name': 'First' },
      { 'key': 2, 'name': 'Second' },
      { 'key': 3, 'name': 'Third' },
      { 'key': 10, 'name': 'Tenth' }
    ]
    this.setState({ data })
  }

  render () {
    const columns = [{
      id: 'id',
      name: 'ID',
      accessor: d => d.key,
      displayAccessor: d => d.key
    },
    {
      id: 'name',
      name: 'Name',
      accessor: d => d.name,
      filterable: true
    }]

    const rowFilter = (r) => true

    const rows = this.state.data

    return (
      <div>
        <h2>Reactor Table</h2>
        <Reactor.Table
          columns={columns}
          rows={rows}
          rowFilter={rowFilter}
        />
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'))
