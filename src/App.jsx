import React, { useState, useEffect, useRef } from "react";
import { FcDownload } from "react-icons/fc";
import { MdOutlineRefresh } from "react-icons/md";
import { MdElectricBolt } from "react-icons/md";
import Loding from "./Component/Loding";
const HuggingFaceImage = () => {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const inputRef = useRef(null);
  const API_TOKEN = import.meta.env.VITE_API_KEY;

  const handleSearch = () => {
    const myInput = inputRef.current.value;

    setError(null);
    query({ inputs: myInput });
  };

  // Fetching function
  const query = async (data) => {
    try {
      setLoading(true);
      setImageUrl(null);

      const response = await fetch(
        "https://api-inference.huggingface.co/models/ZB-Tech/Text-to-Image",
        {
          headers: {
            Authorization: `Bearer ${API_TOKEN}`, // Replace with your actual token
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify(data),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch image");
      }
      // Get image blob from response
      // console.log("this is respoonse ", response);
      const result = await response.blob();
      // console.log("this is bolb ", result);
      // Convert blob to image URL
      const imageUrl = URL.createObjectURL(result);
      setImageUrl(imageUrl);
    } catch (error) {
      setError("Error fetching image: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" myContainer w-100 d-flex justify-content-center align-items-center">
      <div className="containerBody border border-primary-subtle p-3 rounded-2 text-center">
        <h1>Text-to-Image AI</h1>
        <p>Enter a prompt to generate an image.</p>
        {/* <label htmlFor="input">Enter a prompt to generate an image.</label> */}
        <input
          id="input"
          type="text"
          className=" myInput "
          ref={inputRef}
          placeholder="Type your prompt here"
        />
        <button className="btn btn-outline-primary my-3" onClick={handleSearch}>
          {!error ? (
            <>
              Create <MdElectricBolt size={20} />
            </>
          ) : (
            <>
              Retry <MdOutlineRefresh size={20} />
            </>
          )}
        </button>

        {loading && <Loding />}

        {error && <p style={{ color: "red" }}>{error}</p>}

        {!loading && imageUrl && (
          <div className="imgBody">
            <img
              className="myImage"
              src={imageUrl}
              alt="Generated from Hugging Face"
            />
            <a
              className="downloadBtn"
              href={imageUrl}
              download="generated-image.png"
            >
              <FcDownload size={30} />
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default HuggingFaceImage;
