// state_annotation.ts
import { BaseMessage } from "@langchain/core/messages";
import { MessagesAnnotation } from "@langchain/langgraph";
import { Annotation } from "@langchain/langgraph";

export const StateAnnotation = Annotation.Root({
  ...MessagesAnnotation.spec,
  response:Annotation<BaseMessage[]>
});
