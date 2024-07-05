import axios, { AxiosError } from 'axios';
import { ChatCompletionRequestMessage } from 'openai';
import { AiEngine } from './Engine';

import {
  getConfig
} from '../commands/config';

const config = getConfig();

export class FlowiseAi implements AiEngine {

  async generateCommitMessage(
    messages: Array<ChatCompletionRequestMessage>
  ): Promise<string | undefined> {

    //console.log(messages);
    //process.exit()

    const gitDiff = messages[ messages.length - 1 ]?.content?.replace(/\\/g, '\\\\')  // Escape backslashes
                                                            .replace(/"/g, '\\"')    // Escape double quotes
                                                            .replace(/\n/g, '\\n')   // Escape newlines
                                                            .replace(/\r/g, '\\r')   // Escape carriage returns
                                                            .replace(/\t/g, '\\t');  // Escape tabs (if any)
                                                            //fix diffs format for the embedding backend, also removed role and content fields
    const url = `http://${config?.OCO_FLOWISE_ENDPOINT}/api/v1/prediction/${config?.OCO_FLOWISE_API_KEY}`; // this key is specific to flowise
    const payload = {
        question : gitDiff,
        overrideConfig : {
          systemMessagePrompt: messages[0]?.content,
        },
        history : messages.slice( 1, -1 ) 
        // omitting 0, the system prompt, will be given to the llm in flowise
        // omitting the user prompt, which will be the question
    }
    try {
      const response = await axios.post(url, payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const message = response.data;
      // have to check the returned message from flowise, it's not documented in their api page

      return message?.text;
    } catch (err: any) {
      const message = err.response?.data?.error ?? err.message;
      throw new Error('local model issues. details: ' + message);
    }
  }
}

export const flowiseAi = new FlowiseAi();
