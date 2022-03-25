import { exec, spawn } from "child_process";
import { promisify } from "util";
const aExec = promisify(exec);

const target = process.argv[2] || "tagungsbaende";

console.log("building nextjs production");
await aExec("npm run build", {cwd: "modules/userLogin/front_end"});

const spawnCool = (name, ...args) => {
	const proc = spawn(...args);
	proc.stdout.on('data', data => console.log(`[${name}]:: ${String(data)}`));
	proc.stderr.on('data', data => console.error(`[${name}]:: ${String(data)}`));
	proc.on('close', code => console.log(`[${name}] - process exited with code ${code}`));
};

spawnCool("Shop", 'node', ['./index.mjs', '--mode=production', '--', `${target}.shop`]);
if(process.platform === "win32"){
	spawnCool("Next.js", 'cmd.exe', ['/K','npm','run', 'start'], {cwd: `${process.cwd()}/modules/userLogin/front_end`});
}else{
	spawnCool("Next.js", 'npm', ['run', 'start'], {cwd: `${process.cwd()}/modules/userLogin/front_end`});
}