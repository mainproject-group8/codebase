import Head from "next/head";
import { useState, useRef } from "react";
import AnswerList from "../components/Answer";

export default function Home() {
  // -------------------------------------
  const [selectedFile, setSelectedFile] = useState();
  const [isFilePicked, setIsFilePicked] = useState(false);
  const [isSelected, setIsSelected] = useState(false);

  const changeHandler = (event) => {
    setSelectedFile(event.target.files[0]);
    setIsSelected(true);
  };

  // Function will execute on click of button
  const onDownloadTemplateClick = () => {
    // using Java Script method to get PDF file
    fetch('SamplePDF.pdf').then(response => {
        response.blob().then(blob => {
            // Creating new object of PDF file
            const fileURL = window.URL.createObjectURL(blob);
            // Setting various property values
            let alink = document.createElement('a');
            alink.href = fileURL;
            alink.download = 'SamplePDF.pdf';
            alink.click();
        })
    })
  }
  // ---------------------------------------


  // drag state
  const [dragActive, setDragActive] = useState(false);
  // ref
  const inputRef = useRef(null);

  // handle drag events
  const handleDrag = function (e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // triggers when file is dropped
  const handleDrop = function (e) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      // handleFiles(e.dataTransfer.files);
    }
  };

  // triggers when file is selected with click
  const handleChange = function (e) {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      // handleFiles(e.target.files);
    }
  };

  // triggers the input when the button is clicked
  const onButtonClick = () => {
    inputRef.current.click();
  };

  const handleClick = () => {
    console.log("Uploaded")
  }

  return (
    <>
      <Head>
        <title>51 Letters</title>
      </Head>
      <div className="m-8 w-1/3">
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

        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded my-4" onClick={onDownloadTemplateClick}>
          Download Answer Template 
        </button>

        <h3 >Answers</h3>

        <AnswerList />

        <div className="mt-8">
          <h2>Upload</h2>
          <form id="form-file-upload">

            {/* {dragActive && (
              <div
                id="drag-file-element"
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              ></div>
            )} */}
            <input type="file" name="file" onChange={changeHandler} />
            {isSelected ? (
              <div>
                <p>Filename: {selectedFile.name}</p>
                <p>Filetype: {selectedFile.type}</p>
                <p>Size in bytes: {selectedFile.size}</p>
                <p>
                  lastModifiedDate:{' '}
                  {selectedFile.lastModifiedDate.toLocaleDateString()}
                </p>
              </div>
            ) : (
              <p>Select a file to show details</p>
            )}
          </form>
        </div>

        <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded my-4">
          Evaluate Answer Sheets
        </button>
      </div>
      <div className="w-full text-center">
        <hr className="h-6" />
        <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-8 rounded my-4" onClick={onDownloadTemplateClick}>
          Download Result
        </button>
      </div>
    </>
  );
}
