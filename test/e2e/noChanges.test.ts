import { resolve } from 'path'
import { render } from 'cli-testing-library' //used to interact with the CLI
import 'cli-testing-library/extend-expect'; // extends jest expect function
import { prepareEnvironment } from './utils';

it('cli flow when there are no changes', async () => {
  const { gitDir, cleanup } = await prepareEnvironment(); // returns git directory and a cleanup function

  const { findByText } = await render(`OCO_AI_PROVIDER='test' node`, [resolve('./out/cli.cjs')], { cwd: gitDir }); // set an env variable in linux then run cli.cjs
  // resolve ./out/cli.cjs to an absolute path from the current working directory gitDir
  // then execute the command `OCO_AI_PROVIDER='test' node` on the resolved path 
  expect(await findByText('No changes detected')).toBeInTheConsole();
  // wait until the text 'No changes detected' is found in the console
  // if it takes too long time out will occur for the async function - set to 2 seconds
  // the code execution proceeds to cleanup then
  await cleanup();
});
