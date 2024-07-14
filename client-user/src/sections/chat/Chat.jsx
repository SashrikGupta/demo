import React, { useState, useEffect, useContext } from 'react';

import Card from '@mui/material/Card';


import {marked} from 'marked'

import Button from '@mui/material/Button'





export default function View() {
   const [chat, setChat] = useState([ { cont: "hi ! i am recommender bot can help you recommend any book in our data base ask for any recommendaation you want ", ai:true }]);

    const [pdfFile, setPdfFile] = useState("hcsxe");
    const [question, setQuestion] = useState(' ');
    const [loady, setloady] = useState(false);
    const [load, setLoad] = useState(false);
    const [userInput, setUserInput] = useState('');
    const [boka , bokadoka] = useState(true) ; 
    const [pp , spp] = useState(true) ; 
    // Function to upload PDF


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
            const response = await fetch('http://localhost:5000/ask', {
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
            return data.response // Result from the query
        } catch (error) {
            console.error('Error asking question:', error);
        }
    };











 














    return (
        <>
            <Card className="flex justify-around mb-2 p-2 text-bold text-[3vh] w-[80vw] m-[auto] justify-around">
                AI Recommender ✨
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
                        Generate Test  
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
                <Card className='flex mt-4 justify-center items-center h-[75vh] w-[75vw] rounded-xl backdrop-blur-xl bg-white/40 rounded-lg shadow-lg border-2'>
                  {chat[0] ? (
                    <div>
                      <div className='w-[74vw] h-[60vh] overflow-y-scroll text-left' style={{ scrollbarColor: 'white', WebkitBackdropFilter: 'blur(10px)', backdropFilter: 'blur(10px)' }}>
                        {chat.map((el, index) => (
                          <div key={index}>
                            {el.ai ? (
                              <div style={{background: "linear-gradient(45deg , aqua  , #7FFFD4 , aqua)"}} className='w-[20vw] pl-2 m-2 rounded-md' dangerouslySetInnerHTML={{ __html: marked(el.cont)}}>
                              </div>
                            ) : (
                              <div className='w-[70vw] flex-col items-end'>
                                <div className='flex w-[70vw]'>
                                  <div className='w-[50vw]'></div>
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
                          className='w-[60vw] mt-3 h-[4vh] bg-white/50 rounded-md border-2'
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