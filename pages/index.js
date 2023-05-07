import Head from "next/head";
import { useState, useRef } from "react";
import AnswerList from "../components/Answer";
import Guide from "../components/Guide";
import axios from "axios";
import { CSVLink } from "react-csv";
import dictionary from "./charEncode";
import TemplateDownload from "../components/TemplateDownload";

const headers = [
  { label: "File Name", key: "filename" },
  { label: "Score", key: "score" },
];

let scoreData = [];
export default function Home() {
  // -------------------------------------
  const [selectedFiles, setselectedFiles] = useState([]);
  const [isSelected, setIsSelected] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [predictedValue, setpredictedValue] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [answerArray, setAnswerArray] = useState([]);
  const [score, setScore] = useState([]);
  const [scoreData, setScoreData] = useState([]);

  const changeHandler = (event) => {
    setselectedFiles(event.target.files);
    setIsSelected(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setpredictedValue([]);
    setIsProcessing(true);
    setScoreData([]);
    for (let i = 0; i < selectedFiles.length; i++) {
      const formData = new FormData();
      if (isSelected) {
        formData.append("image", selectedFiles[i]);
      }
      await axios
        .post("http://localhost:5000/predict", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((data) => {
          console.log(data);
          // setImageUrl(data.data.url);
          let predictedAnswers = data.data.prediction;
          setpredictedValue(predictedAnswers);

          let maxScore = predictedAnswers.length;
          let totalScore = 0;

          for (let i = 0; i < maxScore; i++) {
            if (predictedAnswers[i] == answerArray[i]) {
              totalScore += 1;
            }
          }

          console.log({
            pred: predictedAnswers,
            ans: answerArray,
            filename: selectedFiles[i].name,
            score: totalScore,
          });

          let scoreObject = {
            filename: selectedFiles[i].name,
            score: totalScore,
          };
          setScoreData((prevState) => [...prevState, scoreObject]);
          setScore([...score, totalScore]);
          setIsProcessing(false);
        });
    }
  };

  // // handle drag events
  // const handleDrag = function (e) {
  //   e.preventDefault();
  //   e.stopPropagation();
  //   if (e.type === "dragenter" || e.type === "dragover") {
  //     setDragActive(true);
  //   } else if (e.type === "dragleave") {
  //     setDragActive(false);
  //   }
  // };

  // // triggers when file is dropped
  // const handleDrop = function (e) {
  //   e.preventDefault();
  //   e.stopPropagation();
  //   setDragActive(false);
  //   if (e.dataTransfer.files && e.dataTransfer.files[0]) {
  //     // handleFiles(e.dataTransfer.files);
  //   }
  // };

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
        <TemplateDownload />
        <AnswerList callbackFn={getAnswersArray} />

        <div className="mt-8">
          <h2>
            <strong>Upload</strong>
          </h2>
          <form id="form-file-upload" onSubmit={handleSubmit}>
            <input type="file" multiple name="image" onChange={changeHandler} />
            {isSelected ? (
              <div>
                {/* <p>Filename: {selectedFiles.name}</p>
                <p>Filetype: {selectedFiles.type}</p> */}
              </div>
            ) : (
              <p>Select a file to show details</p>
            )}
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded my-4"
            >
              Calculate Score
            </button>
          </form>
        </div>

        <div>
          {isProcessing ? (
            <>
              <h2>SCORES</h2>
              <img src="Gear.gif"></img>
            </>
          ) : scoreData.length == 0 ? (
            <></>
          ) : (
            <>
              <h2>SCORES</h2>
              <table>
                <thead>
                  <tr>
                    <th>Filename</th>
                    <th>Score</th>
                  </tr>
                </thead>
                <tbody>
                  {scoreData.map((scoreItem, i) => {
                    return (
                      <tr key={i}>
                        <td>{scoreItem.filename}</td>
                        <td>{scoreItem.score}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>
      <div className="w-full text-center">
        <hr className="h-6" />
        <button
          disabled={score}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-8 rounded my-4"
          onClick={() => {}}
        >
          <CSVLink data={scoreData} headers={headers} filename="score-card.csv">
            Download Result
          </CSVLink>
        </button>
      </div>
    </>
  );
}
