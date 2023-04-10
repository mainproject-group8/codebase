import Head from "next/head";
import { useState, useRef } from "react";
import AnswerList from "../components/Answer";
import Guide from "../components/Guide";
import axios from "axios";
import dictionary from "./charEncode";

export default function Home() {
  // -------------------------------------
  const [selectedFile, setSelectedFile] = useState();
  const [isSelected, setIsSelected] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [predictedValue, setpredictedValue] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [answerArray, setAnswerArray] = useState([]);

  const changeHandler = (event) => {
    setSelectedFile(event.target.files[0]);
    setIsSelected(true);
  };

  // Function will execute on click of button
  const onDownloadTemplateClick = () => {
    // using Java Script method to get PDF file
    fetch("template.jpg").then((response) => {
      response.blob().then((blob) => {
        // Creating new object of PDF file
        const fileURL = window.URL.createObjectURL(blob);
        // Setting various property values
        let alink = document.createElement("a");
        alink.href = fileURL;
        alink.download = "template.jpg";
        alink.click();
      });
    });
  };
  // ---------------------------------------

  // drag state

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Create a FormData object and append the file
    const formData = new FormData();
    if (isSelected) {
      formData.append("image", selectedFile);
    }
    setIsProcessing(true);
    // const response = await fetch('http://localhost:5000/predict', { method: 'POST', body: formData });
    axios
      .post("http://localhost:5000/predict", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((data) => {
        console.log(data);
        setIsProcessing(false);
        setImageUrl(data.data.url);
        let new_arr = [];
        for (let i = 0; i < data.data.prediction.length; i++) {
          new_arr.push(dictionary[data.data.prediction[i]]);
        }
        setpredictedValue(new_arr);
      });
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

  const getAnswersArray = (arr) => {
    setAnswerArray(arr);
  };

  return (
    <>
      <Head>
        <title>51 Letters</title>
      </Head>
      <div className="m-8 w-1/3">
        <Guide />

        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded my-4"
          onClick={onDownloadTemplateClick}
        >
          Download Answer Template
        </button>

        <h3>Answers</h3>

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

            <input type="file" name="image" onChange={changeHandler} />
            {isSelected ? (
              <div>
                <p>Filename: {selectedFile.name}</p>
                <p>Filetype: {selectedFile.type}</p>
                <p>Size in bytes: {selectedFile.size}</p>
              </div>
            ) : (
              <p>Select a file to show details</p>
            )}
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded my-4"
            >
              Predict
            </button>
          </form>
        </div>
        {isProcessing ? (
          <h2>
            Predicted value :{" "}
            <span>
              <img src="/Gear.gif" />
            </span>
          </h2>
        ) : predictedValue ? (
          <h2>Predicted value : {predictedValue}</h2>
        ) : (
          ""
        )}
      </div>

      <div className="w-full text-center">
        <hr className="h-6" />
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-8 rounded my-4"
          onClick={onDownloadTemplateClick}
        >
          Download Result
        </button>
      </div>
    </>
  );
}
