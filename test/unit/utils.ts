import path from 'path';
import { mkdtemp, rm, writeFile } from 'fs';
import { promisify } from 'util';
import { tmpdir } from 'os';
const fsMakeTempDir = promisify(mkdtemp);
const fsRemove = promisify(rm);
const fsWriteFile = promisify(writeFile); // making the functions asynchronous and hence they return promises

/**
 * Prepare tmp file for the test
 */
export async function prepareFile(
  fileName: string,
  content: string
): Promise<{
  filePath: string;
  cleanup: () => Promise<void>;
}> {
  const tempDir = await fsMakeTempDir(path.join(tmpdir(), 'opencommit-test-')); // creating the temporary directory where the testing occurs
  const filePath = path.resolve(tempDir, fileName); // getting the file path for testing
  await fsWriteFile(filePath, content); // writing or creating then writing the file
  const cleanup = async () => {
    return fsRemove(tempDir, { recursive: true }); //  a clean up function for post processing
  };
  return {
    filePath,
    cleanup
  };
}
