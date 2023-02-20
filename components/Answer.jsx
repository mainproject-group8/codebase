import React from 'react'

class AnswerList extends React.Component {
  state = {
    answers: ['പറ', 'ആമ'],
    newAnswer: ''
  }

  handleChange = event => {
    this.setState({ newAnswer: event.target.value })
  }

  handleSubmit = event => {
    event.preventDefault()
    this.setState({
      answers: [...this.state.answers, this.state.newAnswer],
      newAnswer: ''
    })
  }

  handleRemove = index => {
    this.setState({
      answers: this.state.answers.filter((answer, i) => i !== index)
    })
  }

  render() {
    return (
      <div id='answer-border'>
        <form onSubmit={this.handleSubmit}>
            <input
              type="text"
              className='rounded px-2 mx-2 py-1'
              value={this.state.newAnswer}
              onChange={this.handleChange}
              style={{ backgroundColor: 'white', color:'black' }}
            />
          <button
            type="submit"
            className="bg-green-400 hover:bg-green-500 rounded px-2 mx-2 py-1"
            style={{ margin: '0.5rem'}}
          >
            Add 
          </button>
        </form>
        <ul>
          {this.state.answers.map((answer, index) => (
            <li key={answer} style={{ margin: '0.5rem', padding: '0.5rem' }}>
              {answer}
              <button
                onClick={() => this.handleRemove(index)}
                className="bg-red-500 hover:bg-red-600 rounded px-2 mx-2 py-1"
                style={{ margin: '0.5rem' }}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
        <button
                className="bg-sky-800 hover:bg-sky-700 shadow-lg rounded px-2 py-1 mx-2"
                style={{ margin: '0.5rem' }}
              >
                Submit
              </button>
      </div>
    )
  }
}

export default AnswerList
