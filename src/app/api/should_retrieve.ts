import { StateAnnotation } from "./stateAnnotation";
export function shouldRetrieve(state: typeof StateAnnotation.State): string[] {
    const { messages } = state;
    //console.log("---DECIDE TO RETRIEVE---");
    const lastMessage = messages[messages.length - 1];
    //console.log("last_message in should_retrieve",lastMessage)
  
    if ("tool_calls" in lastMessage && Array.isArray(lastMessage.tool_calls) && lastMessage.tool_calls.length &&  (lastMessage.tool_calls[0].name == "Menu" || lastMessage.tool_calls[0].name == "payment_choice")) {
      //console.log("---DECISION: RETRIEVE---");
      return ["toolNode"];
    }
    else if("tool_calls" in lastMessage && Array.isArray(lastMessage.tool_calls) && lastMessage.tool_calls.length && lastMessage.tool_calls[0].name=="OrderedTool"){
    return ["toolNode","Response"];
    }
    else{
      return ["__end__"]
    }
  }