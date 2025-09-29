export const handleDownload = (type, searchResult) => {
  //TODO: Create loading animation and that sort of shandies
  if (searchResult) {
    const { downloadElement } = searchResult;
    document.body.appendChild(downloadElement);
    downloadElement.click();
    document.body.removeChild(downloadElement);
  }
};

export const handleView = (e, searchResult, isCvVisible, setIsCvVisible) => {
  // Simulated view functionality
  if (searchResult) {
    const { pdfElement } = searchResult;
    const viewCV = document.getElementById("view-cv-section");

    if (isCvVisible) {
      viewCV.classList.remove("flex");
      viewCV.classList.add("hidden");
      viewCV.removeChild(pdfElement);
      setIsCvVisible(false);
    } else {
      viewCV.classList.remove("hidden");
      viewCV.classList.add("flex");
      if (pdfElement) {
        setIsCvVisible(true);
        viewCV.appendChild(pdfElement);
      }
    }
  }
};

const transformCVData = ([{ meta, binary }]) => {
  let result = {};
  if (meta && meta.length > 0) {
    const { filename, uploadDate } = meta[0];
    result = { ...result, filename, uploadDate };
  }

  if (binary && binary.length > 0) {
    const { data } = binary[0];

    // For display purposes
    const pdfElement = document.createElement("object");
    pdfElement.style.width = "100%";
    pdfElement.style.height = "842pt";
    pdfElement.style.className = "rounded-md";
    pdfElement.type = "application/pdf";
    pdfElement.data = "data:application/pdf;base64," + data;

    // use the click attribute and then remove it from the document
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);
    const downloadElement = document.createElement("a");
    downloadElement.innerHTML = "Download PDF file";
    downloadElement.download = result.filename; // Change this to be more based on the info that is available
    downloadElement.href = "data:application/octet-stream;base64," + data;
    result = { ...result, pdfElement, downloadElement };
  }

  return result;
};

export const getDataWithPDF = ({ user_id, setIsFetching, setSearchResult }) => {
  try {
    const ROOT_PARAM = `/.netlify/functions/user`;
    let url = `${ROOT_PARAM}?user_id=${user_id}`;

    setIsFetching(true);

    fetch(url)
      .then((res) => res.json())
      .then((value) => {
        if (value && value.body.length > 0) {
          setSearchResult(transformCVData(value.body));
        }
        setIsFetching(false);
      });
    return;
  } catch (e) {
    setSearchResult(null);
    setIsFetching(false);
    console.warn("Error:", e);
    return;
  }
};
