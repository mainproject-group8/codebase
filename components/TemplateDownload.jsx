import React from "react";

function TemplateDownload() {
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
  return (
    <button
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded my-4"
      onClick={onDownloadTemplateClick}
    >
      Download Answer Template
    </button>
  );
}

export default TemplateDownload;
