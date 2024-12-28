import { tool } from "@langchain/core/tools";
import { ChatOpenAI } from "@langchain/openai";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

const apiKey = process.env.OPENAI_API_KEY;
const payment_format={
    type:"json_object",
    schema:zodToJsonSchema(
        z.object({
        payment_method: z.enum(["Credit","Debit","Apple"]).describe("payement type opted by the customer")
        }))
    }


const payment_choice_model = new ChatOpenAI({
    model:"gpt-4o",
    temperature:0.1,
    apiKey
}).withStructuredOutput(payment_format)
const payment_choice_prompts =`
    you are responsible for handling payment options
    - Identify and extract the payment method chosen by the customer 
`

export const  payment_tool = tool(
    async (input)=>{
        const payment_choice=await payment_choice_model.invoke([
            {role:"system",content: payment_choice_prompts},
            input
        ])
        
        return payment_choice
    },{
        name:"payment_choice",
        description:"Extracts the customer's payment choice and provides it in a structured format.",
    }

)

