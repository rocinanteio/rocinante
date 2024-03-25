import { __NOOP__ } from '../constants';
const { spawn } = require('child_process');

type ExecuteCommand = {
  command: string;
  args?: string[];
  stdOutHandler?: (out: string) => void;
  stdErrHandler?: (out: string) => void;
  errHandler?: (out: string) => void;
  closeHandler?: (out: string) => void;
};
export const executeCommand = ({
  command,
  args = [],
  stdOutHandler = __NOOP__,
  stdErrHandler = __NOOP__,
  errHandler = __NOOP__,
  closeHandler = __NOOP__,
}: ExecuteCommand): Promise<void> => {
  return new Promise((resolve, reject) => {
    const ls = spawn(command, args, {
      shell: true,
    });

    ls.stdout.on('data', (data: Buffer) => {
      stdOutHandler(data.toString());
    });

    ls.stderr.on('data', (data: Buffer) => {
      stdErrHandler(data.toString());
    });

    ls.on('error', (error: string) => {
      errHandler(error);
      reject();
    });

    ls.on('close', (code: string) => {
      closeHandler(code);
      resolve();
    });
  });
};
