import { spawn } from "child_process";

const target = process.argv[2] || "tagungsbaende";

const spawnCool = (name, ...args) => {
	const proc = spawn(...args);
	proc.stdout.on('data', (data) => console.log(`stdout: ${data}`));
	proc.stderr.on('data', (data) => console.error(`stderr: ${data}`));
	proc.on('close', code => console.log(`[${name}] - process exited with code ${code}`));
};
spawnCool("Shop", 'node', ['./index.mjs', '--mode="development"', '--', `${target}.shop`]);
spawnCool("Next.js", 'npm', ['run', 'dev', '--mode="development"'], {cwd: `${process.cwd()}/modules/userLogin/front_end`});
