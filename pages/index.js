import Head from "next/head";
import { useState, useRef } from "react";
import AnswerList from "../components/Answer";
import Guide from "../components/Guide";


export default function Home() {
  // -------------------------------------
  const [selectedFile, setSelectedFile] = useState();
  // const [isFilePicked, setIsFilePicked] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [predictedValue, setpredictedValue] = useState('');
  const [answerArray, setAnswerArray] = useState([])

  const changeHandler = (event) => {
    setSelectedFile(event.target.files[0]);
    setIsSelected(true);
  };

  // Function will execute on click of button
  const onDownloadTemplateClick = () => {
    // using Java Script method to get PDF file
    fetch('samplePDF.pdf').then(response => {
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




  const handleSubmit = async(event)=> {

    event.preventDefault();
    // Create a FormData object and append the file
    const formData = new FormData();
    formData.append('image', selectedFile);



    const response=  await fetch ('http://localhost:5000/predict', {method:'POST', body: formData});
    const data = await response.json();
    setImageUrl(data.url); 
    setpredictedValue(data.prediction);
  };

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
  // const handleChange = function (e) {
  //   e.preventDefault();
  //   if (e.target.files && e.target.files[0]) {
  //     // handleFiles(e.target.files);
  //   }
  // };

  // triggers the input when the button is clicked
  // const onButtonClick = () => {
  //   inputRef.current.click();
  // };

  // const handleClick = () => {
  //   console.log("Uploaded")
  // }

  const getAnswersArray=(arr)=>{
    setAnswerArray(arr)
  }

  return (
    <>
      <Head>
        <title>51 Letters</title>
      </Head>
      <div className="m-8 w-1/3">
         <Guide />

        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded my-4" onClick={onDownloadTemplateClick}>
          Download Answer Template 
        </button>

        <h3 >Answers</h3>

        <AnswerList callbackFn={getAnswersArray} />


        <div className="mt-8">
          <h2>Upload</h2>
          <form id="form-file-upload" onSubmit={handleSubmit}>

            {dragActive && (
              <div
                id="drag-file-element"
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              ></div>
            )}

            <input type="file" name="file" onChange={changeHandler} />
            {isSelected ? (
              <div>
                <p>Filename: {selectedFile.name}</p>
                <p>Filetype: {selectedFile.type}</p>
                <p>Size in bytes: {selectedFile.size}</p>
              </div>
            ) : (
              <p>Select a file to show details</p>
            )}

            <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded my-4">
              Predict
            </button>
            {imageUrl && <img src={`http://localhost:5000/${imageUrl}`} alt="Uploaded image" />}
              {console.log(imageUrl, predictedValue, answerArray)}
              { console.log(`The length of ${answerArray[0]} is ${answerArray[0].length}`)}
              { console.log(`The length of ${answerArray[1]} is ${answerArray[1].length}`)}

              {predictedValue? predictedValue : "prediction not returned"}
            
          </form>

   
  
        </div>

        
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
