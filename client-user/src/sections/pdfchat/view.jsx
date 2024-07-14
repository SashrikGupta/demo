import React, { useState, useEffect, useContext } from 'react';
import DU from './uploader';
import Card from '@mui/material/Card';
import { curr_context } from './PdfSrc';
import {marked} from 'marked'

import Button from '@mui/material/Button'
import html2pdf from 'html2pdf.js';




export default function View() {
   const [chat, setChat] = useState([]);
    const now_context = useContext(curr_context);
    const [pdfFile, setPdfFile] = useState(null);
    const [question, setQuestion] = useState('');
    const [loady, setloady] = useState(false);
    const [load, setLoad] = useState(false);
    const [userInput, setUserInput] = useState('');
    const [boka , bokadoka] = useState(false) ; 
    const [pp , spp] = useState(true) ; 
    // Function to upload PDF
    const uploadPDF = async () => {
        try {
            setLoad(true) ; 
            const response = await fetch(now_context.vsrc);
            if (!response.ok) {
                throw new Error('Failed to fetch PDF');
            }
            const blob = await response.blob();
            const formData =  new FormData();
            setPdfFile(blob);
            formData.append('pdf', blob, 'data.pdf');
            console.log(blob)
         
            console.log(pdfFile)
            const uploadResponse = await fetch('https://beta-free.onrender.com/ask', {
                method: 'POST',
                body: formData,
            });
            if (!uploadResponse.ok) {
                throw new Error('Failed to upload PDF');
            }
            const data = await uploadResponse.text();
            console.log(data); 
            spp(true) ;
            setChat([{cont : "i have gone through the pdf how can i help you "  , ai : true}])
            setLoad(false)// Response from the server
        } catch (error) {
            console.error('Error uploading PDF:', error);
        }
    };

    // Upload PDF file on component mount
    useEffect(() => {
        if (now_context?.vsrc) {
            
            uploadPDF();
        }
        // Cleanup function to delete PDF on component unmount

    }, [now_context?.vsrc]);

    // Function to delete the uploaded PDF


    // Function to handle file input change
    const chat_handler = async () => {
      if (userInput.trim() === '') return;
      setloady(true);
      const newChat = [...chat, { cont: userInput, ai: false }];
      setChat(newChat);
      const aiResponse = await askQuestion() ;
      setUserInput('');
   
      
      setloady(false);
      setChat((prevChat) => [...prevChat, { cont: aiResponse, ai: true }]);
    };

    // Function to handle question input change
    const handleQuestionChange = (event) => {
        setQuestion(event.target.value);
    };

    // Function to ask the question
    const askQuestion = async () => {
        try {
            const response = await fetch('https://beta-free.onrender.com/query', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query: userInput }),
            });
            if (!response.ok) {
                throw new Error('Failed to ask question');
            }
            const data = await response.json();
            return data.result // Result from the query
        } catch (error) {
            console.error('Error asking question:', error);
        }
    };

    const askTest = async () => {
        try {
            const response = await fetch('https://beta-free.onrender.com/query', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query: `
                  based on the full content 
                  give full summary of the content  
                  `}),
            });
            if (!response.ok) {
                throw new Error('Failed to ask question');
            }
            const data = await response.json();
            return data.result // Result from the query
        } catch (error) {
            console.error('Error asking question:', error);
        }
    };











    
const genQ = async () => {
  bokadoka(true) ;
  console.log("button clicked ");
  const test = await askTest();
  const markedContent = marked(test);

  const html_format = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Document</title>
          <style>
              #title {
                  margin-top : 40px ;
                  font-size: 25px;
                  font-weight: bold;
                  text-align: center;
              }
              img {
                  height: 35px;
                  position: absolute;
                  left: 20px;
              }
              #cont {
                  display: flex;
                  justify-content: center;
              }
                #all{
                 margin : 20px ; 
                }
          </style>
      </head>
      <body>
          <div id="cont">
              <img src="https://www.gramurja.org/assets/images/logo/Gram%20Urja%20logo.png" alt="Gram Urja Logo">
              <div id="title">odoo library</div>
          </div>
          <hr>
          <div id="all">${markedContent}</div>
      </body>
      </html>
  `;

  // Create a temporary container for the HTML content
  const container = document.createElement('div');
  container.innerHTML = html_format;

  // Convert the HTML content to a PDF and download it
  await html2pdf()
      .from(container)
      .save();
 
  bokadoka(false)
  
};








    return (
        <>
            <Card className="flex justify-around mb-2 p-2 text-bold text-[3vh] w-[80vw] m-[auto] justify-around">
                AI PDF reader ✨
                { pp ?
                   (
                   <div className='flex '>
                    {
 
                    !boka ? 
                     
                    <Button
                      onClick={genQ}
                      className='shadow-lg'
                      sx={{
                        background : "linear-gradient(45deg , aqua , violet , pink)" ,
                        color : "white" , 
                        fontWeight : "bold"
                        }}> 
                        Generate summary  
                      </Button>
                      :
                      <><div className='loader3 mr-2 h-[2vh]'/> <div className='loader3 mr-2 h-[2vh]'/> <div className='loader3 mr-2 h-[2vh]'/></>
                        
                       }
                      </div>
                    )
                      :<>
                      </>
                  }
            </Card>
            <Card className="flex w-[80vw] h-[80vh] m-[auto] justify-around ">
                <div className="w-[45vw] h-[60vh] flex pt-4">
                    <DU />
                </div>

                <Card className='flex mt-4 justify-center items-center h-[70vh] w-[29vw] rounded-xl backdrop-blur-xl bg-white/40 rounded-lg shadow-lg border-2'>
                  {chat[0] ? (
                    <div>
                      <div className='w-[29vw] h-[60vh] overflow-y-scroll text-left' style={{ scrollbarColor: 'white', WebkitBackdropFilter: 'blur(10px)', backdropFilter: 'blur(10px)' }}>
                        {chat.map((el, index) => (
                          <div key={index}>
                            {el.ai ? (
                              <div style={{background: "linear-gradient(45deg , aqua  , #7FFFD4 , aqua)"}} className='w-[20vw] pl-2 m-2 rounded-md' dangerouslySetInnerHTML={{ __html: marked(el.cont)}}>
                              </div>
                            ) : (
                              <div className='w-[22vw] flex-col items-end'>
                                <div className='flex w-[29vw]'>
                                  <div className='w-[9vw]'></div>
                                  <div className='w-[20vw] pl-2 m-2 rounded-md bg-black/10'>
                                    {el.cont}
                                  </div>
                                </div>
                                {
                                  (loady && index==chat.length-1) ? (
                                    <>
                                      <div className='loader2'> </div>
                                    </>
                                  ) : <></>
                                }
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      <div className='flex justify-around'>
                        <input 
                          id="ok" 
                          className='w-[22vw] mt-3 h-[4vh] bg-white/50 rounded-md border-2'
                          value={userInput}
                          onChange={(e) => setUserInput(e.target.value)}
                        />
                        <div>
                          <button 
                            onClick={chat_handler} 
                            style={{background: "linear-gradient(45deg , aqua  , #7FFFD4 , aqua)"}} 
                            className='flex text-[4vh] justify-center items-center w-[2vw] mt-3 ml-[1vw] h-[4vh] rounded-lg'
                          >
                            ➡️
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      {load && <div className='loader2 mr-2'/>}
                    </>
                  )}
                </Card>   

            </Card>
               
        </>
    );
}
