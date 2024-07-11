import React  , {useContext , useEffect} from 'react'
import Extra from './Extra'
import useFetch from 'src/hooks/useFetch'
import { curr_context } from 'src/contexts/Central'

export default function Demo() {
   const now_context = useContext(curr_context)
   console.log(now_context) 
   const body = {a:2 , b:4}
   const [data , loading , error] = useFetch("/sashrik")
   const [data_add , loading_add , error_add] = useFetch("/sashrik/add" , body) 

   console.log(data_add) ; 
   useEffect(()=>{console.log(error)} , [error])

  return (
    <div>Demo
      <Extra/>
      {loading_add && <>loading...</>}
    </div>
  )
}
