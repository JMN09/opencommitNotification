import path from 'path'
import { mkdtemp, rm } from 'fs'
import { promisify } from 'util';
import { tmpdir } from 'os';
import { exec } from 'child_process';
const fsMakeTempDir = promisify(mkdtemp);
const fsExec = promisify(exec);
const fsRemove = promisify(rm);

/**
 * Prepare the environment for the test
 * Create a temporary git repository in the temp directory
 */
export const prepareEnvironment = async (): Promise<{
  gitDir: string;
  cleanup: () => Promise<void>;
}> => {
  const tempDir = await fsMakeTempDir(path.join(tmpdir(), 'opencommit-test-'));
  //similar to the procedure in the unit test prepareFile, except we execute git commands to make it a git repository 
  await fsExec('git init --bare remote.git', { cwd: tempDir }); 
  await fsExec('git clone remote.git test', { cwd: tempDir }); //clones a testing repo, I imagine with a preset content, in tempDir - by setting cwd current working directory to be tempDir
  const gitDir = path.resolve(tempDir, 'test');
  //finds the absolute path for the file called test in the tempDir directory.
  const cleanup = async () => {
    return fsRemove(tempDir, { recursive: true }); // clean up by calling clean up recursively on the tempDir, if its a directory recur, if its a file remove.
  }
  return {
    gitDir,
    cleanup,
  }
}
