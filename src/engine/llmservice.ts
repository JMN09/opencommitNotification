import axios, { AxiosError } from 'axios';
import { ChatCompletionRequestMessage } from 'openai';
import { AiEngine } from './Engine';

import {
  getConfig
} from '../commands/config';

const config = getConfig();

export class LlmServiceAi implements AiEngine {

  async generateCommitMessage(
    messages: Array<ChatCompletionRequestMessage>
  ): Promise<string | undefined> {

    //console.log(messages);
    //process.exit()
    
    const url = 'http://localhost:3000/api/v1/prediction/4795e9cb-3a02-4a4c-9a6f-4c7218af84d1'; // this key is specific to flowise
    const p = {
        question : messages[ messages.length - 1 ],
        history : messages.slice( 1, -1 ) 
        // omitting 0, the system prompt, will be given to the llm in flowise
        // omitting the user prompt, which will be the question
    }
    try {
      const response = await axios.post(url, p, {
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

export const llmServiceAi = new LlmServiceAi();
