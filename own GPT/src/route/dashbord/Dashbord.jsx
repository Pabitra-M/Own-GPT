import React from 'react'
import './dashbord.css'
import { useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom'
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

function Dashbord() {
  const navigator =useNavigate()

  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (text) =>{
      return fetch(`${import.meta.env.VITE_API_URL}/api/chats`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      }).then((res) => res.json());
    },
    onSuccess: (id) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['userChats'] })
      navigator(`/dashbord/chats/${id}`)
    },
  })


  const handelSubmit = async (e) => {
    e.preventDefault();
    const text = e.target.text.value;
    if(!text) return;

    mutation.mutate(text);
      
    }





    return (
      <div className='dashbord'>
        <div className="texts">
          <div className="logo">
            <img src="/logo.png" alt="" />
            <h1>Own GPT</h1>
          </div>
          <div className="options">
            <div className="option">
              <img src="/chat.png" alt="" />
              <span>Create a New Chat</span>
            </div>
            <div className="option">
              <img src="/image.png" alt="" />
              <span> Analize a New Image</span>
            </div>
            <div className="option">
              <img src="/code.png" alt="" />
              <span>Help ne with my Code</span>
            </div>

          </div>
        </div>
        <div className="formConatiner">
          <form onSubmit={handelSubmit}>
            <input type="text" name ='text' placeholder='Enter the text' />
            <button>
              <img src="/arrow.png" alt="" />
            </button>
          </form>

        </div>
      </div>
    )
  }

  export default Dashbord
