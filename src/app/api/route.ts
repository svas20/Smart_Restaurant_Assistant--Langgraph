import { NextRequest, NextResponse } from "next/server";
import { graph } from "./graph";

export async function POST(req: NextRequest) {
    // try {
        const body = await req.json();
        const { input } = body;

        const configurable = {
            configurable: {
                thread_id: "thread_test",
            }
        };

        // Invoke the graph API
        const response = await graph.invoke(
            {
                messages: [
                    {
                        role: "user",
                        content: input
                    }
                ]
            },
            configurable
        );

        
        for(let i=1; i<(response.messages.length); i++){
            if(response.messages[response.messages.length-i].name=="OrderedTool" && response.messages[response.messages.length -i].content!=""){
                console.log(response.messages[response.messages.length-i].content)
               
            }
            else{
                break
            }
        }
        //console.log("messages:",response.messages)
        if(response.messages[response.messages.length-1].name!="OrderedTool" && response.messages[response.messages.length -1].content!=""){
            console.log(response.messages[response.messages.length-1].content)
        }

        console.log(response?.response[0]?.content ?? 'null');
        return NextResponse.json(response.messages[response.messages.length - 1].content)
    }