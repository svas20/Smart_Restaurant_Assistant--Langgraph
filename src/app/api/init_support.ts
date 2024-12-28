import { createRetrieverTool } from "langchain/tools/retriever";
import { vectorStoreRetriever } from "./retriever";
import { ChatOpenAI } from "@langchain/openai";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { order_tool } from "./Ordered";
import { StateAnnotation } from "./stateAnnotation";
import { payment_tool } from "./payment";

const apiKey=process.env.OPENAI_API_KEY

const retriever_tool=createRetrieverTool(vectorStoreRetriever,{
    name:"Menu",
    description:"Retrieves available menu items based on user queries.",

})

export const tools=[retriever_tool,order_tool,payment_tool]
export const toolNode = new ToolNode<typeof StateAnnotation.State>(tools);


const initial_support_model=new ChatOpenAI({
    model:"gpt-4o",
    temperature:0.7,
    apiKey
    }).bindTools(tools)

export const init_support=async (state:typeof StateAnnotation.State)=>{
    const query_prompt=`
        As a professional and friendly restaurant waiter, your responsibilities include:
            - Respond very concisely 
            - Greeting Customers: Politely welcome customers
            - Menu Assistance: Suggest and recommend items based on queries; provide information about the menu and services without item descriptions or prices unless asked.
            - Order Management:
                Confirm the item is present in the menu 
                Record order details in the Ordered tool, including item name, quantity, and price, ensuring the price matches the menu accurately.
            - Cancelation Handling:
                Cancel as per the customer request if and only if the item is previously ordered
                Record cancellation details in the Ordered tool, including item name, quantity, and price, ensuring the price matches the menu accurately.
            - Special request:Include special requests in the Ordered tool if the customer mentions any specific instructions or preferences
            - Order Confirmation: Acknowledge order confirmation and ask for the preferred payment method.
            - payment method: After confirmation of the order and opted for payment method (Credit, Debit, Apple pay), Record the opted payment method using the payment_tool.
            - Do not summarize the order unless asked.
            - Do not provide with accepted payment methods unless asked
    ` 
    const init_response = await initial_support_model.invoke([
        {role:"system",content:query_prompt},
        ...state.messages,
    ])

    // console.log("response",init_response)
    // console.log("...state.messages",...state.messages)
    // console.log("state",state)
    // console.log("state.messages",state.messages)

   return {messages:[init_response],response:[]}
}