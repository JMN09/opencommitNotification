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
    
    const url = 'http://localhost:3000/api/v1/prediction/ab3ded23-ae59-43d0-8a3d-4d60046671b6'; // to be determined
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
