import React from 'react'

const filter = (filter, filterAccessor, array) => {
  if (filter && filter.length > 0) {
    if (!filterAccessor) {
      console.error('Reactor.Table: No filter accessor defined')
    } else {
      array = array.filter(c => {
        return ('' + filterAccessor(c)).toLowerCase()
          .includes(filter.toLowerCase())
      })
    }
  }
  return array
}

class Table extends React.Component {
  constructor () {
    super()
    this.state = {
      rows: [],
      filteredRows: [],
      columns: []
    }
    this._sortColumn = this._sortColumn.bind(this)
    this._filterColumnsOnChange = this._filterColumnsOnChange.bind(this)
  }

  componentDidMount () {
    this.processData()
  }

  componentDidUpdate () {
    this.processData()
  }

  processData () {
    if (this.props.rows.length !== this.state.rows.length) {
      const rows = this.props.rows
      this.setState({ rows, filteredRows: rows })
    }
    if (this.props.columns.length !== this.state.columns.length) {
      this.setState({ columns: this.props.columns })
    }
  }

  _sortColumn (columnId, ascending = true) {
    // Make copies so we don't edit in-place
    const filteredRows = [...this.state.filteredRows]
    const columns = [...this.state.columns]

    const column = this.state.columns.filter(c => c.id === columnId)[0]

    const accessor = column.accessor
    const bsColumnId = this.props.baseSortColumnId

    const bsAccessor = bsColumnId && bsColumnId !== columnId
      ? this.state.columns.filter(c => c.id === bsColumnId)[0].accessor
      : (d) => ''

    const sortDirectionA = ascending ? -1 : 1
    const sortDirectionB = ascending ? 1 : -1

    filteredRows.sort((a, b) => {
      return accessor(a) < accessor(b) ? sortDirectionA
           : accessor(a) > accessor(b) ? sortDirectionB
           : (
                bsAccessor(a) < bsAccessor(b) ? -1
              : bsAccessor(a) > bsAccessor(b) ? 1
              : 0
             )
    })

    // Remove sort indicators on all other columns
    columns.forEach(c => delete (c.sortedAsc))

    column.sortedAsc = ascending

    this.setState({ filteredRows, columns })
  }

  _filterColumnsOnChange (columnId, filter) {
    const columns = [...this.state.columns]
    const column = columns.filter(c => c.id === columnId)[0]
    column.filter = filter.length > 0 ? filter : null
    this.setState({ columns }, () => this._filterColumns())
  }

  _filterColumns () {
    let filteredRows = [...this.state.rows]
    this.state.columns.forEach(c => {
      filteredRows = filter(c.filter, c.accessor, filteredRows)
    })
    this.setState({ filteredRows })
  }

  render () {
    const columnHeaders = this.state.columns.map(c => {
      const caretClass = c.sortedAsc === true
        ? 'sortable-asc'
        : c.sortedAsc === false
          ? 'sortable-desc'
          : 'sortable'
      return (
        <th key={c.id} className={c.headerClass}>
          <span className={caretClass} onClick={() => this._sortColumn(c.id, !c.sortedAsc)}>
            {c.name}
          </span>
          {c.filterable &&
            <span>
              <br />
              <input
                className={this.props.filterInputClass}
                type='text'
                placeholder='Filter'
                onChange={(e) => this._filterColumnsOnChange(c.id, e.target.value)}
              />
            </span>
          }
        </th>
      )
    })

    const filteredRows = this.state.filteredRows.filter(this.props.rowFilter)

    const rows = filteredRows.map(r => {
      const rowCells = []
      this.state.columns.forEach((c, i) => {
        const value = c.displayAccessor ? c.displayAccessor(r) : c.accessor(r)
        const key = `${r.key}-${i}`
        rowCells.push(<td key={key} className={c.cellClass}>{value}</td>)
      })
      return <tr key={r.id || r.key}>{rowCells}</tr>
    })

    return (
      <table className={`ReactorTable ${this.props.tableClass}`}>
        <thead><tr>{columnHeaders}</tr></thead>
        <tbody>{rows}</tbody>
      </table>
    )
  }
}

module.exports = Table
