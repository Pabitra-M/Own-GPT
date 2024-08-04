import React, { useEffect, useRef, useState } from 'react'
import './newPromet.css'
import Upolode from '../uplode/Upolode';
import model from '../../lib/gemini';
import { IKImage } from 'imagekitio-react';
import Markdown from 'react-markdown'
import {

  useMutation,
  useQueryClient,

} from '@tanstack/react-query'
function NewPromet({ data }) {

  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")

  const [img, setImg] = useState({
    isLoading: false,
    error: "",
    dbData: {},
    aiData: {}

  });

  const chatHistory = data?.history.map(({ role, parts }) => ({ role, parts: [{ text: parts[0].text }] })) || [];
  if (chatHistory.length > 0 && chatHistory[0].role !== 'user') {
    console.warn("Chat history does not start with user. Adding default user message.");
    chatHistory.unshift({ role: 'user', parts: [{ text: "Hello!" }] });
  }
  const chat = model.startChat({
    history: chatHistory,
  
    generationConfig: {
      //   maxOutputTokens: 100,
    },
  });






  const endRef = useRef(null)
  const fromRef = useRef(null)
  useEffect(() => {
    endRef.current.scrollIntoView({ behavior: 'smooth' })
  }, [data, answer, question, img.dbData]);

  // const navigator =useNavigate()

  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: () => {
      return fetch(`${import.meta.env.VITE_API_URL}/api/chats/${data._id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: question.length ? question : undefined,
          answer,
          img: img.dbData?.filePath || undefined,
        }),
        
      }).then((res) => res.json());
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['chat', data._id] }).then(() => {
        fromRef.current.reset();
        setQuestion("");
        setAnswer("");
        setImg({
          isLoading: false,
          error: "",
          dbData: {},
          aiData: {}
        })
      })
    },

    onError: (error) => {
      console.log(error);
    },
  })












  const add = async (text, isInitial) => {
    if(!isInitial)setQuestion(text);
    try {
      const result = await chat.sendMessageStream(Object.entries(img.aiData).length ? [img.aiData, text] : [text]);
      let accumulatedText = '';
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        console.log(chunkText);
        accumulatedText += chunkText;
        setAnswer(accumulatedText);
      }
      mutation.mutate();


    } catch (error) {
      console.log(error);
    }


  }

  const handelSubmit = async (e) => {
    e.preventDefault();
    const text = e.target.text.value;
    if (!text) return;
    add(text, false);

  }

  const hasRan = useRef(false);

  useEffect(() => {
    if(!hasRan.current){
      
      if(data?.history?.length === 1){
        add(data.history[0].parts[0].text, true)
        
      }
    }

    hasRan.current = true
  }, []);






  return (
    <>

      {img.isLoading && <p>Loading...</p>}
      {img.dbData?.filePath && (
        <IKImage
          urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
          path={img.dbData?.filePath}
          width="380"
          transformation={[{ width: 380 }]}
        />
      )}

      {question && (
        <div className="message user">
          {question}
        </div>
      )}
      {answer && (
        <div className="message">
          <Markdown>{answer}</Markdown>
        </div>
      )}

      <div className="endChat" ref={endRef}></div>

      <form className="newFrom" onSubmit={handelSubmit} ref={fromRef}>

        <Upolode setImg={setImg} />
        <input type="file" id='file' multiple={false} hidden />
        <input type="text" name='text' placeholder='Enter the text' />
        <button>
          <img src="/arrow.png" alt="" />
        </button>

      </form>

    </>
  )
}

export default NewPromet
