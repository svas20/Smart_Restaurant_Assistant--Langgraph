import { StateAnnotation } from "./stateAnnotation"
import { ChatOpenAI } from "@langchain/openai"
import { tools } from "./init_support"


const apiKey=process.env.OPENAI_API_KEY

const response_model=new ChatOpenAI({
    model:"gpt-4o",
    temperature:0.7,
    apiKey
})

export const Response =async (state:typeof StateAnnotation.State)=>{
    const response_system_prompts = ` 
    You are a friendly and professional waiter at a restaurant.
        - A prior conversation has addressed customer queries, and the order is being noted down in parallel.
        - Your role is to ask the customer if they would like to add more items until the order is confirmed.
        - Respond very concisely.
        - Do not summarize the order at any time.

    `
    //console.log (state.messages)
      let trimmedHistory = state.messages || []; 
        trimmedHistory = trimmedHistory.slice(0, -1);
        //console.log("trimmedHistory",trimmedHistory) 
    const response=await response_model.invoke([
        {role:"system",content:response_system_prompts},
        ...trimmedHistory
        ])
        return {response:[response]}
    }


     





