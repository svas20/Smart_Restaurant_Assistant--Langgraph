import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { ChatOpenAI } from "@langchain/openai";
import { tool } from '@langchain/core/tools';

const apiKey = process.env.OPENAI_API_KEY;

const ordered_format = {
  type: "json_object",
  schema: zodToJsonSchema(
    z.object({
      order: z.array(
        z.object({
          quantity: z.number().describe("Quantity of the ordered item."),
          item: z.string().describe("Name of the ordered item."),
          price: z.number().describe("Price per unit of the ordered item as per the Menu."),
          total_price: z.number().describe("Total cost for this item (quantity * price)."),
        })
      ).describe("Details of all ordered items.")
      .optional()
      .default([]),
      canceled: z.array(
        z.object({
          item: z.string().describe("Name of the canceled item."),
          quantity: z.number().describe("Quantity of the removed or canceled item."),
          price: z.number().describe("Price per unit of the removed or canceled item as per the Menu."),
          total_price: z.number().describe("Total cost for removed or canceled item (quantity * price)."),
        })
    ).describe("Details of all canceled items if previously ordered")
    .optional()
    .default([]),
    special_request: z.string()
        .optional()
        .describe("Any special instructions or requests")
        .default("")
    })
  ),
};

const ordered_model = new ChatOpenAI({
  model: "gpt-4o",
  temperature: 0.1,
  apiKey
}).withStructuredOutput(ordered_format)

const Ordered_prompts = `
    You are a restaurant waiter responsible for noting down the customer's ordered items. 
        - Extract the ordered and/or the canceled, and any special request provided by the customer, including the item name, quantity, price, and calculated total cost, and present the information in a well-structured format.
    `
export const order_tool = tool(

  async (input) => {
    const order_retriever_response = await ordered_model.invoke([
      { role: "system", content: Ordered_prompts },
      input
    ]);

    return order_retriever_response;
  }, {
    name: "OrderedTool",
    description: "Processes and formats the customer's order, including updates for removed or canceled items, ensuring all items align with the menu."
  },
);
