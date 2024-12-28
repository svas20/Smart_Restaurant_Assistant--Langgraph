import { StateAnnotation } from "./stateAnnotation";
export function preference(state: typeof StateAnnotation.State): string {
    const { messages } = state;
    //console.log("---DECIDE TO RETRIEVE---");
    const lastMessage = messages[messages.length - 1];
    //console.log("last_message in should_retrieve",lastMessage)
  
    if ( lastMessage.name=="Menu") {
      //console.log("---DECISION: RETRIEVE---");
      return "init_support";
    }
    else{
    return "__end__";
    }
}