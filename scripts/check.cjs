const fs=require('fs'),path=require('path'),vm=require('vm');
for(const file of fs.readdirSync('js').filter(f=>f.endsWith('.js')))new vm.Script(fs.readFileSync(path.join('js',file),'utf8'),{filename:file});
for(const file of ['index.html','reset-password.html']){const html=fs.readFileSync(file,'utf8');if(html.includes('cdn.tailwindcss.com'))throw Error('Runtime Tailwind in '+file);for(const m of html.matchAll(/(?:src|href)="([^"?#]+)"/g)){if(/^(https?:|mailto:|tel:|data:)/.test(m[1]))continue;if(!fs.existsSync(decodeURIComponent(m[1])))throw Error('Missing local resource '+m[1]);}}
console.log('PASS: JavaScript syntax and local HTML resources');
