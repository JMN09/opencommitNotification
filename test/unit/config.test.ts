import { getConfig } from '../../src/commands/config';
import { prepareFile } from './utils';

describe('getConfig', () => { // creating a test suite
  const originalEnv = { ...process.env }; // creating a copy of the current environment, one utility is to fallback to the original state after the test
  function resetEnv(env: NodeJS.ProcessEnv) { // function that goes over the key value pairs in the current process env
                                              // if a key is not in the env passed in object, then it is deleted from process.env
                                              // o.w. the value of the key in process.env is updated to the value of the key in the env passed in object
    Object.keys(process.env).forEach((key) => { 
      if (!(key in env)) {
        delete process.env[key];
      } else {
        process.env[key] = env[key];
      }
    });
  }

  beforeEach(() => { // before each test, the process.env is reset to the original environment
    resetEnv(originalEnv);
  });

  afterAll(() => { // after all tests, the process.env is reset to the original environment
    resetEnv(originalEnv);
  });

  it('return config values from the global config file', async () => {
    const configFile = await prepareFile( 
      '.opencommit',
      `
OCO_OPENAI_API_KEY="sk-key"
OCO_ANTHROPIC_API_KEY="secret-key"
OCO_TOKENS_MAX_INPUT="8192"
OCO_TOKENS_MAX_OUTPUT="1000"
OCO_OPENAI_BASE_PATH="/openai/api"
OCO_DESCRIPTION="true"
OCO_EMOJI="true"
OCO_MODEL="gpt-4"
OCO_LANGUAGE="de"
OCO_MESSAGE_TEMPLATE_PLACEHOLDER="$m"
OCO_PROMPT_MODULE="@commitlint"
OCO_AI_PROVIDER="ollama"
OCO_GITPUSH="false"
OCO_ONE_LINE_COMMIT="true"
`
    ); // create a temporary file with the given content
    const config = getConfig({ configPath: configFile.filePath, envPath: '' });

    expect(config).not.toEqual(null);
    expect(config!['OCO_OPENAI_API_KEY']).toEqual('sk-key');
    expect(config!['OCO_ANTHROPIC_API_KEY']).toEqual('secret-key');
    expect(config!['OCO_TOKENS_MAX_INPUT']).toEqual(8192);
    expect(config!['OCO_TOKENS_MAX_OUTPUT']).toEqual(1000);
    expect(config!['OCO_OPENAI_BASE_PATH']).toEqual('/openai/api');
    expect(config!['OCO_DESCRIPTION']).toEqual(true);
    expect(config!['OCO_EMOJI']).toEqual(true);
    expect(config!['OCO_MODEL']).toEqual('gpt-4');
    expect(config!['OCO_LANGUAGE']).toEqual('de');
    expect(config!['OCO_MESSAGE_TEMPLATE_PLACEHOLDER']).toEqual('$m');
    expect(config!['OCO_PROMPT_MODULE']).toEqual('@commitlint');
    expect(config!['OCO_AI_PROVIDER']).toEqual('ollama');
    expect(config!['OCO_GITPUSH']).toEqual(false);
    expect(config!['OCO_ONE_LINE_COMMIT']).toEqual(true);
    // checking that get config returns the expected values, which were directly written into the temporary test file
    await configFile.cleanup(); 
  });

  it('return config values from the local env file', async () => {
    const envFile = await prepareFile(
      '.env',
      `
OCO_OPENAI_API_KEY="sk-key"
OCO_ANTHROPIC_API_KEY="secret-key"
OCO_TOKENS_MAX_INPUT="8192"
OCO_TOKENS_MAX_OUTPUT="1000"
OCO_OPENAI_BASE_PATH="/openai/api"
OCO_DESCRIPTION="true"
OCO_EMOJI="true"
OCO_MODEL="gpt-4"
OCO_LANGUAGE="de"
OCO_MESSAGE_TEMPLATE_PLACEHOLDER="$m"
OCO_PROMPT_MODULE="@commitlint"
OCO_AI_PROVIDER="ollama"
OCO_GITPUSH="false"
OCO_ONE_LINE_COMMIT="true"
    `
    );
    const config = getConfig({ configPath: '', envPath: envFile.filePath });

    expect(config).not.toEqual(null);
    expect(config!['OCO_OPENAI_API_KEY']).toEqual('sk-key');
    expect(config!['OCO_ANTHROPIC_API_KEY']).toEqual('secret-key');
    expect(config!['OCO_TOKENS_MAX_INPUT']).toEqual(8192);
    expect(config!['OCO_TOKENS_MAX_OUTPUT']).toEqual(1000);
    expect(config!['OCO_OPENAI_BASE_PATH']).toEqual('/openai/api');
    expect(config!['OCO_DESCRIPTION']).toEqual(true);
    expect(config!['OCO_EMOJI']).toEqual(true);
    expect(config!['OCO_MODEL']).toEqual('gpt-4');
    expect(config!['OCO_LANGUAGE']).toEqual('de');
    expect(config!['OCO_MESSAGE_TEMPLATE_PLACEHOLDER']).toEqual('$m');
    expect(config!['OCO_PROMPT_MODULE']).toEqual('@commitlint');
    expect(config!['OCO_AI_PROVIDER']).toEqual('ollama');
    expect(config!['OCO_GITPUSH']).toEqual(false);
    expect(config!['OCO_ONE_LINE_COMMIT']).toEqual(true);
    // using envPath instead of configPath to get the configuration values
    await envFile.cleanup();
  });
});
