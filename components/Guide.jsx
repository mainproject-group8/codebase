import React from 'react'

class Guide extends React.Component{
    render(){
        return(
        <div className="guide">
            <b>Guide:</b>
        <ol className="ml-6">
          <li>Download the following template.</li>
          <li>
            Take the print out of the answer template. It is in this template
            the students are supposed to write the answers.
          </li>
          <li>
            Enter the words for spelling test under “Answers” heading and press
            “Submit”.
          </li>
          <li>Scan the answer sheet(s).</li>
          <li>Upload the scanned answer sheet(s).</li>
          <li>
            Press “Evaluate” and download the generated .xls file which contains
            the individual score for each question and also total score for each
            scanned paper.
          </li>
        </ol>
        </div>
        
        )
    }
}
export default Guide