const Reactor = require('../lib/reactor');
const React = require('react');
const ReactDOM = require('react-dom');

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: []
        };
        this.refreshData = this.refreshData.bind(this);
    }

    componentDidMount() {
        this.refreshData();
    }

    randomInt(max = 100) {
        return Math.floor(Math.random() * Math.floor(max));
    }

    refreshData() {
        const data = [
      { key: this.randomInt(), name: 'First' },
      { key: this.randomInt(), name: 'Second' },
      { key: this.randomInt(), name: 'Third' },
      { key: this.randomInt(), name: 'Tenth' }
        ];
        this.setState({ data });
    }

    render() {
        const columns = [
            {
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
            }
        ];

        const rowFilter = r => true;

        const rows = this.state.data;

        const totalRow = [{ key: 15, name: 'TOTAL' }];

        return (
      <div>
        <button onClick={e => this.refreshData()}>Refresh data</button>
        <h2>Reactor Table</h2>
        <Reactor.Table
          columns={columns}
          rows={rows}
          rowFilter={rowFilter}
          totalRows={totalRow}
        />
      </div>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('root'));
