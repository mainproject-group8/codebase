import {useState} from 'react'

const AnswerList = ({callbackFn}) =>  {
  const [answers,setAnswers] = useState(['പറ', 'ആമ'])
  const [newAnswer,setNewAnswer] = useState('')

  const handleChange = event => {
    setNewAnswer(event.target.value)
  }

  const handleSubmit = event => {
    event.preventDefault()
    setAnswers([...answers, newAnswer])
    setNewAnswer('')
  }

  const handleRemove = index => {
    setAnswers(answers.filter((answer, i) => i !== index))

  }


    return (
      <div id='answer-border'>
        <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder='type here..'
              className='rounded px-2 mx-2 py-1'
              value={newAnswer}
              onChange={handleChange}
              style={{ backgroundColor: 'lightgrey', color:'black' }}
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
          {answers.map((answer, index) => (
            <li key={answer} style={{ margin: '0.5rem', padding: '0.5rem' }}>
              {answer}
              <button
                onClick={() => handleRemove(index)}
                className="bg-red-500 hover:bg-red-600 rounded px-2 mx-2 py-1"
                style={{ margin: '0.5rem' }}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
        <button
        onClick={()=>{
         callbackFn(answers)
        }}
                className="bg-sky-600 white hover:bg-sky-300 shadow-lg rounded px-2 py-1 mx-2"
                style={{ margin: '0.5rem' }}
              >
                Submit
              </button>
      </div>
    )
  
}

export default AnswerList
