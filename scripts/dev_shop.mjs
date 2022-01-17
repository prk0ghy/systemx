import { spawn } from "child_process";

const target = process.argv[2] || "tagungsbaende";


const spawnCool = (name, ...args) => {
	const proc = spawn(...args);
	proc.stdout.on('data', data => console.log(String(data)));
	proc.stderr.on('data', data => console.error(String(data)));
	proc.on('close', code => console.log(`[${name}] - process exited with code ${code}`));
};
spawnCool("Shop", 'node', ['./index.mjs', '--mode="development"', '--', `${target}.shop`]);
if(process.platform === "win32"){
	spawnCool("Next.js", 'cmd.exe', ['/K','npm','run', 'dev'], {cwd: `${process.cwd()}/modules/userLogin/front_end`});
}else{
	spawnCool("Next.js", 'npm', ['run', 'dev'], {cwd: `${process.cwd()}/modules/userLogin/front_end`});
}