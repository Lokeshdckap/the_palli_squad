// Working to access the file locally visible data of the file
// import React, { useState } from 'react';

// const FileDownloader = () => {
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [fileDownloaded, setFileDownloaded] = useState(false);
//   const [encryptedContent, setEncryptedContent] = useState('');
//   const [decryptedContent, setDecryptedContent] = useState('');
//   const defaultPassword = 'akash@123';
//   const textContent = `1. Modified the add batch functionality.
// 2. The task badge hardcoded removed and due date minutes calculations issue fixed.
// 3. For student work show view added a useEffect.
// 4. When student assigned the loading message added.
// 5. If the current batch don’t a student the placeholder added.
// 6. The comments profile icon name firstname and lastname hardcoded removed and also added the current date and time for the comment.
// 7. In the weightage list component added the minimum and maximum attribute and the value converted to the float because the backend team gives the percentage as a string that’s why I am using that float ex: Percentage: “50.00” using a float to convert the string value into a float so the output will be 50.
// 8. In the weightage list component the percentage input increment and decrement spin button removed by using CSS.
// 9. The user info get the endpoint I wrote the one utility function that function used for login and sidebar component.
// 10. Permission functionality added in application page. 
// 11. The task badge hardcoded removed and due date minutes calculations issue fixed in student login.
// 12. Removed the unwanted console.log and navbar component removed.`;

//   const encryptContent = (content, key) => {
//     return Array.from(content)
//       .map((char, index) => String.fromCharCode(char.charCodeAt(0) ^ key.charCodeAt(index % key.length)))
//       .join('');
//   };

//   const decryptContent = (content, key) => {
//     return encryptContent(content, key); // Since XOR encryption is symmetric
//   };

//   const handlePasswordChange = (e) => {
//     setPassword(e.target.value);
//   };

//   const handleDownload = () => {
//     if (password === defaultPassword) {
//       const encrypted = encryptContent(textContent, defaultPassword);
//       setEncryptedContent(encrypted);
//       setFileDownloaded(true);
//       setError('');
//     } else {
//       setError('Incorrect password. Please try again.');
//     }
//   };

//   const handleFileOpen = () => {
//     if (fileDownloaded) {
//       const decrypted = decryptContent(encryptedContent, password);
//       setDecryptedContent(decrypted);
//     } else {
//       setError('Please download the file and enter the correct password to access.');
//     }
//   };

//   return (
//     <div>
//       <input
//         type="password"
//         value={password}
//         onChange={handlePasswordChange}
//         placeholder="Enter Password"
//       />
//       <button onClick={handleDownload}>Download File</button>
//       <button onClick={handleFileOpen}>Open File</button>
//       {error && <p>{error}</p>}
//       {fileDownloaded && <p>File downloaded successfully.</p>}
//       {decryptedContent && (
//         <div>
//           <h2>Decrypted Content:</h2>
//           <p>{decryptedContent}</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default FileDownloader;







// import React from 'react';
// import JSZip from 'jszip';
// import sampleFileContent from "../assets/sample.txt";
// import invitePeople from "../assets/images/TeamMeeting.png"

// export default function FilePassword() {
//     function downloadPasswordFile() {
//         const zip = new JSZip();
//         const password = prompt("Enter password to encrypt ZIP file");

//         // Add the file to the ZIP archive
//         zip.file('sample.txt', sampleFileContent);

//         // Generate the ZIP file with encryption
//         zip.generateAsync({ type: "blob", compression: "DEFLATE", password: password })
//             .then(function (blob) {
//                 const url = window.URL.createObjectURL(blob);
//                 const link = document.createElement('a');
//                 link.href = url;
//                 link.download = 'password_protected_sample.zip';
//                 link.click();
//                 window.URL.revokeObjectURL(url);
//             })
//             .catch(function (err) {
//                 console.log('Error creating password-protected ZIP file:', err);
//             });
//     }

//     function openPasswordFile() {
//         const fileInput = document.createElement('input');
//         fileInput.type = 'file';
//         fileInput.accept = '.zip';
//         fileInput.addEventListener('change', handleFileSelect);
//         fileInput.click();
//     }

//     function handleFileSelect(event) {
//         const file = event.target.files[0];
//         const password = prompt("Enter password to decrypt ZIP file");

//         const reader = new FileReader();
//         reader.onload = function (event) {
//             const zip = new JSZip();
//             zip.loadAsync(event.target.result, { password: password })
//                 .then(function (contents) {
//                     console.log('ZIP file contents:', contents);
//                     // Do something with the extracted contents
//                 })
//                 .catch(function (err) {
//                     console.log('Error decrypting ZIP file:', err);
//                 });
//         };
//         reader.readAsArrayBuffer(file);
//     }

//     return (
//         <>
//             <button onClick={downloadPasswordFile}>Download </button>
//             <button onClick={openPasswordFile}>Open</button>
//         </>
//     );
// }


//File download in application



// import React, { useState } from 'react';

// const FileDownloader = () => {
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [fileDownloaded, setFileDownloaded] = useState(false);
//   const [decryptedContent, setDecryptedContent] = useState('');
//   const defaultPassword = 'password123'; // Change this to your desired default password
//   const textContent = `This is the content of the file.`; // Update this with your file content

//   const handlePasswordChange = (e) => {
//     setPassword(e.target.value);
//   };

//   const handleDownload = () => {
//     setFileDownloaded(true);
//   };

//   const handleFileOpen = () => {
//     if (password === defaultPassword) {
//       // Decrypt the content
//       // For demonstration, we'll just set the decrypted content as the original content
//       setDecryptedContent(textContent);
//       setError('');
//     } else {
//       setError('Incorrect password. Please try again.');
//     }
//   };

//   const handleLogout = () => {
//     setPassword('');
//     setDecryptedContent('');
//     setError('');
//   };

//   return (
//     <div>
//       {!fileDownloaded ? (
//         <div>
//           <button onClick={handleDownload}>Download File</button>
//         </div>
//       ) : (
//         <div>
//           <input
//             type="password"
//             value={password}
//             onChange={handlePasswordChange}
//             placeholder="Enter Password"
//           />
//           <button onClick={handleFileOpen}>Open File</button>
//           <button onClick={handleLogout}>Logout</button>
//           {error && <p>{error}</p>}
//           {decryptedContent && (
//             <div>
//               <h3>File Content:</h3>
//               <p>{decryptedContent}</p>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };


// import React, { useState } from 'react';

// const FileDownloader = () => {
//   const [downloaded, setDownloaded] = useState(false);
// //   const [password, setPassword] = useState('');
// const password = 'password123'; 
//   const [enteredPassword, setEnteredPassword] = useState('');
//   const [fileOpened, setFileOpened] = useState(false);

//   // Simulated file URL
//   const fileUrl = 'https://example.com/your-file.pdf';

//   const handleDownload = () => {
//     // Simulate file download process
//     // Here you would typically have your file download logic
//     // For demonstration purpose, we're just setting downloaded to true after a timeout
//     setTimeout(() => {
//       setDownloaded(true);
//     }, 2000);
//   };

//   const handlePasswordChange = (e) => {
//     setEnteredPassword(e.target.value);
//   };

//   const handlePasswordSubmit = (e) => {
//     e.preventDefault();
//     // Check if entered password matches the correct password
//     if (enteredPassword === password) {
//       setFileOpened(true);
//       // Once the correct password is entered, you can redirect to the file URL
//       window.open(fileUrl, '_blank');
//     } else {
//       alert('Incorrect password!');
//       setEnteredPassword('');
//     }
//   };

//   return (
//     <div>
//       {!downloaded ? (
//         <button onClick={handleDownload} className='bg-red-500'>Download File</button>
//       ) : (
//         <div>
//           <form onSubmit={handlePasswordSubmit}>
//             <label>
//               Enter Password:
//               <input
//                 type="password"
//                 value={enteredPassword}
//                 onChange={handlePasswordChange}
//               />
//             </label>
//             <button type="submit">Open File</button>
//           </form>
//           {fileOpened && <p>File opened successfully!</p>}
//         </div>
//       )}
//     </div>
//   );
// };

// export default FileDownloader;

// import React, { useState } from 'react';





// -------------Optionally corrected----------------
// const App = () => {
//   const [fileData, setFileData] = useState('');
//   const [password, setPassword] = useState('');
//   const [errorMessage, setErrorMessage] = useState('');
//   const [fileDataVisible, setFileDataVisible] = useState(false);

//   const handleDownloadFile = () => {
//     // Dummy file data
//     const dummyFileData = 'This is dummy file data.\nIt can be any text or content.';
//     setFileData(dummyFileData);
//   };

//   const handlePasswordChange = (event) => {
//     setPassword(event.target.value);
//   };

//   const handleOpenFile = () => {
//     // This is where you would validate the password
//     const correctPassword = 'akash@123';

//     if (password === correctPassword) {
//       setErrorMessage('');
//       // If password is correct, show file data
//       setFileDataVisible(true);
//     } else {
//       setErrorMessage('Incorrect password. Please try again.');
//       // Clear file data if password is incorrect
//       setFileData('');
//     }
//   };

//   return (
//     <div>
//       <h1>Secure File Viewer</h1>
//       <button onClick={handleDownloadFile}>Download File</button>
//       <br />
//       <br />
//       {fileDataVisible && <pre>{fileData}</pre>}
//       {!fileDataVisible && (
//         <>
//           <input
//             type="password"
//             placeholder="Enter password"
//             value={password}
//             onChange={handlePasswordChange}
//           />
//           <button onClick={handleOpenFile}>Open File</button>
//           {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
//         </>
//       )}
//     </div>
//   );
// };

// export default App;
