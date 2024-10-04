// src/FileUploader.js
import React, { useState } from 'react';
import mammoth from 'mammoth';
import validator from 'email-validator';

const FileUploader = () => {
  const [emails, setEmails] = useState([]);

  const handleFileChange = (event) => {
    const files = event.target.files;
    const emailSet = new Set(emails); // Start with current emails

    Array.from(files).forEach((file) => {
      if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || file.type === "application/msword") {
        const reader = new FileReader();

        reader.onload = (e) => {
          mammoth.extractRawText({ arrayBuffer: e.target.result })
            .then((result) => {
              const text = result.value;
              extractEmails(text, emailSet);
            })
            .catch((err) => console.error(err));
        };

        reader.readAsArrayBuffer(file);
      }
    });
  };

  const extractEmails = (text, emailSet) => {
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const foundEmails = text.match(emailRegex);
    if (foundEmails) {
      foundEmails.forEach((email) => {
        if (validator.validate(email)) {
          emailSet.add(email);
        }
      });
      setEmails(Array.from(emailSet)); // Update state with new email list
    }
  };

  return (
    <div>
      <h1>Email Extractor</h1>
      <input type="file" multiple accept=".doc, .docx" onChange={handleFileChange} />
      <h2>Extracted Emails:</h2>
      <ul>
        {emails.map((email, index) => (
          <li key={index}>{email}</li>
        ))}
      </ul>
    </div>
  );
};

export default FileUploader;
