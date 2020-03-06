import React, { useRef, useState, useEffect } from "react";

import Button from "./Button";
import "./ImageUpload.css";

function ImageUpload(props) {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isValid, setIsValid] = useState(props.initialIsValid || false);

  const filePickerRef = useRef();

  function pickImageHandler() {
    filePickerRef.current.click();
  }

  function pickedImageHandler(event) {
    let pickedFile;
    let fileIsValid;
    if (event.target.files && event.target.files.length === 1) {
      pickedFile = event.target.files[0];
      setFile(pickedFile);
      fileIsValid = true;
    } else fileIsValid = false;
    setIsValid(fileIsValid);
    props.onInput(props.id, pickedFile, fileIsValid);
  }

  useEffect(() => {
    if (props.initialValue)
      setPreviewUrl(process.env.REACT_APP_ASSET_URL + props.initialValue);
  }, []);

  useEffect(() => {
    if (!file) return;
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  }, [file]);

  return (
    <div className="form-control">
      <input
        id={props.id}
        ref={filePickerRef}
        style={{ display: "none" }}
        type="file"
        accept=".jpg,.png,.jpeg"
        onChange={pickedImageHandler}
      />
      <div className={"image-upload " + (props.center && "center")}>
        <div className="image-upload__preview">
          {previewUrl && <img src={previewUrl} alt="Preview" />}
          {!previewUrl && <p>Please pick an image.</p>}
        </div>{" "}
        <Button type="button" onClick={pickImageHandler}>
          PICK IMAGE
        </Button>
      </div>
      {!isValid && <p>{props.errorText}</p>}
    </div>
  );
}

export default ImageUpload;
