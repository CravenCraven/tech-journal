mport { useState, useMemo, useCallback, useRef } from "react";
const THEMES = {
sysadmin: { label: "Sysadmin"
, color: "#00ff41"
, icon: "
🖥
"
, bg: "rgba(0,255,65,0.08)"
, border:
"rgba(0,255,65,0.25)" },
devops: { label: "DevOps"
, color: "#00d4ff"
, icon: "⚙"
, bg: "rgba(0,212,255,0.08)"
, border:
"rgba(0,212,255,0.25)" },
kali: { label: "Kali Linux"
, color: "#ff3e6c"
, icon: "💀"
, bg: "rgba(255,62,108,0.08)"
, border:
"rgba(255,62,108,0.25)" },
hackerbox: { label: "HackerBox"
, color: "#b44aff"
, icon: "🔌"
, bg: "rgba(180,74,255,0.08)"
,
border: "rgba(180,74,255,0.25)" },
};
const CONTACT = { email: "craventhegreat@gmail.com"
, github:
"https://github.com/CravenCraven"
, linkedin:
"https://www.linkedin.com/in/craven-craven-43b813a8" };
const SORT
_
OPTIONS = [ { key: "newest"
, label: "Newest" }, { key: "oldest"
, label: "Oldest" }, {
key: "az"
, label: "A–Z" }, { key: "drafts"
, label: "Drafts first" } ];
const SAMPLE = [
{ id:1, theme:"sysadmin"
, status:"complete"
, pinned:false, title:"Configuring LVM & Extending
Logical Volumes"
, date:"2026-04-07"
, objective:"Practice creating and managing LVM volumes
— a key RHCSA exam objective.
"
, environment:"RHEL 9 VM (VirtualBox), 2 additional 5GB
virtual disks"
, steps:"1. Created physical volumes with pvcreate\n2. Created volume group
spanning both PVs\n3. Created logical volume at 4GB\n4. Formatted with xfs and mounted\n5.
Added fstab entry using UUID\n6. Extended using lvextend -r\n7. Verified after reboot"
,
codeBlocks:"# Create PVs\npvcreate /dev/sdb /dev/sdc\n\n# Create VG\nvgcreate vg_
data
/dev/sdb /dev/sdc\n\n# Create LV\nlvcreate -L 4G -n lv
_projects vg_
data\n\n# Format &
mount\nmkfs.xfs /dev/vg_
data/lv
_projects\nmount /dev/vg_
data/lv
_projects /mnt/projects\n\n#
Extend live\nlvextend -r -L +2G /dev/vg_
data/lv
_projects"
, errors:"Forgot -r flag on lvextend.
"
,
outcome:"LVM volume created and persists across reboot.
"
, takeaways:"Always use -r with
lvextend. Use UUIDs in fstab.
"
, references:"RHCSA EX200 Objectives, man lvm"
, screenshots:[]
},
{ id:2, theme:"sysadmin"
, status:"draft"
, pinned:false, title:"Configuring Firewalld Zones & Rich
Rules"
, date:"2026-04-05"
, objective:"Understand firewalld zones and rich rules.
"
,
environment:"RHEL 9 VM, Apache httpd, SSH access"
, steps:"1. Checked default zone\n2.
Added http/https services\n3. Created rich rule for SSH\n4. Made permanent and reloaded\n5.
Verified with list-all"
, codeBlocks:"firewall-cmd --get-default-zone\nfirewall-cmd --zone=public
--add-service=http --permanent\nfirewall-cmd --zone=public --add-service=https
--permanent\nfirewall-cmd --zone=public --add-rich-rule='rule family=ipv4 source
address=192.168.1.0/24 service name=ssh accept'
--permanent\nfirewall-cmd --reload"
,
errors:"Forgot --permanent on first attempt.
"
, outcome:"Firewall configured with rich rules.
"
,
takeaways:"Always pair with --permanent.
"
, references:"man firewalld.richlanguage"
,
screenshots:[] },
{ id:3, theme:"devops"
, status:"complete"
, pinned:false, title:"Building a Multi-Stage Dockerfile
for Node.js"
, date:"2026-04-06"
, objective:"Reduce Docker image from 950MB to under
200MB.
"
, environment:"Docker Desktop on Fedora, Node.js 20, VS Code"
, steps:"1. Audited
existing Dockerfile — 948MB\n2. Rewrote as two-stage build\n3. Switched to node:20-alpine\n4.
Added .dockerignore\n5. Compared sizes\n6. Tested container"
, codeBlocks:"# Stage 1:
Build\nFROM node:20 AS builder\nWORKDIR /app\nCOPY package*
.json ./\nRUN npm
ci\nCOPY . .\nRUN npm run build\n\n# Stage 2: Production\nFROM node:20-alpine\nWORKDIR
/app\nCOPY --from=builder /app/dist ./dist\nCOPY --from=builder /app/node
modules
_
./node
_
modules\nEXPOSE 3000\nCMD [\"node\"
, \"dist/index.js\"]"
, errors:"Alpine missing
native deps for bcrypt.
"
, outcome:"Image reduced to 187MB.
"
, takeaways:"Multi-stage builds are
essential.
"
, references:"Docker docs"
, screenshots:[] },
{ id:4, theme:"devops"
, status:"complete"
, pinned:false, title:"Ansible Playbook: LAMP Stack
Deployment"
, date:"2026-04-03"
, objective:"Automate LAMP stack on RHEL 9.
"
,
environment:"Ansible control node (Fedora), RHEL 9 target VM"
, steps:"1. Set up inventory\n2.
Created role structure\n3. Tested with --check\n4. Verified idempotency"
, codeBlocks:"#
site.yml\n- hosts: webservers\n become: true\n roles:\n - apache\n - mariadb\n - php\n\n#
roles/apache/tasks/main.yml\n- name: Install httpd\n dnf:\n name: httpd\n state: present"
,
errors:"mysql
_
user needs PyMySQL on target.
"
, outcome:"Full LAMP deploys in under 2
minutes.
"
, takeaways:"Always run --check first.
"
, references:"Ansible Galaxy docs"
,
screenshots:[] },
{ id:5, theme:"kali"
, status:"complete"
, pinned:true, title:"HackTheBox: Pilgrimage — Full
Walkthrough"
, date:"2026-04-04"
, objective:"Root the Pilgrimage machine on HackTheBox.
"
,
environment:"Kali Linux VM, OpenVPN to HTB"
, steps:"1. Nmap: ports 22, 80\n2. Found
exposed .git\n3. CVE-2022-44268 file read\n4. Extracted creds from SQLite\n5. SSH as
emily\n6. CVE-2022-4510 for root"
, codeBlocks:"# Initial scan\nnmap -sC -sV -oN
pilgrimage.nmap 10.10.11.219\n\n# Dump exposed git repo\ngit-dumper
http://pilgrimage.htb/.git/ ./repo\n\n# CVE-2022-44268\npython3 exploit.py generate -o
payload.png -r /var/db/pilgrimage\n\nssh emily@10.10.11.219"
, errors:"Tried to read
/root/root.txt directly — permission denied.
"
, outcome:"Machine fully compromised.
"
,
takeaways:"Exposed .git dirs are goldmines.
"
, references:"CVE-2022-44268, CVE-2022-4510"
,
screenshots:[] },
{ id:6, theme:"kali"
, status:"draft"
, pinned:false, title:"Building a Custom Nmap Recon Script"
,
date:"2026-04-02"
, objective:"Automate nmap recon workflow.
"
, environment:"Kali Linux, Bash,
nmap"
, steps:"1. Defined workflow\n2. Wrote Bash script\n3. Parsed open ports\n4. Organized
output"
, codeBlocks:"#!/bin/bash\nTARGET=$1\nOUTDIR=$2\nmkdir -p $OUTDIR\n\necho \"[*]
Quick scan...\"\nnmap -T4 --top-ports 1000 -oG $OUTDIR/quick.gnmap
$TARGET\n\nPORTS=$(grep 'open' $OUTDIR/quick.gnmap | cut -d'/'
-f1 | tr '\\n' '
,
')\n\nnmap -sV
-sC -p$PORTS -oN $OUTDIR/deep.nmap $TARGET\nnmap --script=vuln -p$PORTS -oN
$OUTDIR/vulns.nmap $TARGET"
, errors:"Initial regex missed UDP ports.
"
, outcome:"Saves
10-15 minutes per target.
"
, takeaways:"Automate repetitive recon.
"
, references:"nmap docs"
,
screenshots:[] },
{ id:7, theme:"hackerbox"
, status:"complete"
, pinned:false, title:"HackerBox 0097: LED Matrix
with Arduino Nano"
, date:"2026-04-01"
, objective:"Complete HackerBox 0097 kit.
"
,
environment:"HackerBox 0097 kit, Arduino Nano, Hakko FX-888D"
, steps:"1. Inventoried
components\n2. Soldered headers\n3. Soldered MAX7219 circuit\n4. Connected LED matrix\n5.
Uploaded test pattern"
, codeBlocks:"#include <LedControl.h>\n\nLedControl lc = LedControl(12,
11, 10, 1);\n\nvoid setup() {\n lc.shutdown(0, false);\n lc.setIntensity(0, 8);\n
lc.clearDisplay(0);\n}\n\nvoid loop() {\n byte smile[] = {\n B00111100, B01000010, B10100101,
B10000001,\n B10100101, B10011001, B01000010, B00111100\n };\n for (int i = 0; i < 8; i++)
lc.setRow(0, i, smile[i]);\n delay(2000);\n}"
, errors:"Cold solder joint on CS pin.
"
, outcome:"LED
matrix works.
"
, takeaways:"Cold joints are #1 beginner issue.
"
, references:"HackerBox 0097
instructions"
, screenshots:[] },
];
const STORAGE
_
KEY = 'tech-journal-entries';
const ADMIN
_
KEY = 'tech-journal-admin';
function loadEntries() { try { const s = localStorage.getItem(STORAGE
_
JSON.parse(s); } catch {} return SAMPLE; }
function persistEntries(entries) { try { localStorage.setItem(STORAGE
_
JSON.stringify(entries)); } catch {} }
KEY); if (s) return
KEY,
const EMPTY = { title:""
, theme:"sysadmin"
, status:"draft"
, pinned:false, date:new
Date().toISOString().split("T")[0], objective:""
, environment:""
, steps:""
, codeBlocks:""
, errors:""
,
outcome:""
, takeaways:""
, references:""
, screenshots:[] };
const FIELDS = [
{ key:"objective"
, label:"OBJECTIVE"
, placeholder:"What are you trying to accomplish?"
,
rows:3 },
{ key:"environment"
, label:"ENVIRONMENT / TOOLS"
, placeholder:"VM setup, OS, tools,
versions...
"
, rows:2 },
{ key:"steps"
, label:"STEP-BY-STEP WALKTHROUGH"
, placeholder:"Detailed steps of what
you did...
"
, rows:6 },
{ key:"codeBlocks"
, label:"COMMANDS & CODE"
, placeholder:"$ paste your commands and
code here...
"
, rows:6, isCode:true },
{ key:"errors"
, label:"ERRORS & TROUBLESHOOTING"
, placeholder:"What went wrong and
how you fixed it...
"
, rows:3 },
{ key:"outcome"
, label:"OUTCOME / RESULTS"
, placeholder:"What was the end result?"
,
rows:3 },
{ key:"takeaways"
, label:"KEY TAKEAWAYS"
, placeholder:"What did you learn?"
, rows:3 },
{ key:"references"
, label:"REFERENCES & LINKS"
, placeholder:"Docs, URLs, man pages...
"
,
rows:2 },
];
const fmtDate = d => new
Date(d+"T00:00:00").toLocaleDateString("en-US"
,{month:"short"
,day:"numeric"
,year:"numeric"});
const daysAgo = d => Math.floor((new Date()-new Date(d+"T00:00:00"))/864e5);
const slug = t => t.toLowerCase().replace(/[^a-z0-9]+/g,
"
-
").replace(/^
-|-$/g,
"");
const CMDS = new
Set(['ls'
'cd'
'cat'
,
,
,
'cp'
'mv'
'rm'
'mkdir'
'rmdir'
'touch'
'find'
'locate'
'ln'
,
,
,
,
,
,
,
,
,
'pwd'
'tree'
'chmod'
'chown'
'ch
,
,
,
,
grp'
'umask'
,
,
'chage'
,
'passwd'
'setfacl'
,
,
'getfacl'
'useradd'
'userdel'
'usermod'
,
,
,
,
'groupadd'
,
'groupdel'
'
,
groupmod'
'id'
'whoami'
'who'
'su'
'sudo'
'dnf'
,
,
,
,
,
,
,
'yum'
,
'rpm'
,
'apt'
,
'pip'
,
'npm'
,
'systemctl'
'service'
,
,
'journ
alctl'
,
'ps'
,
'top'
,
'htop'
'kill'
'killall'
'nice'
'renice'
,
,
,
,
,
'ip'
'ss'
'netstat'
,
,
,
'ping'
'curl'
,
,
'wget'
,
'dig'
,
'nslookup'
'trace
,
route'
'hostname'
'nmcli'
'firewall-cmd'
'mount'
'umount'
'lsblk'
'fdisk'
'mkfs'
,
,
,
,
,
,
,
,
,
'pvcreate'
,
'vgcreate'
'lv
,
create'
'lvextend'
,
,
'vgextend'
,
'pvs'
,
'vgs'
'lvs'
'df'
'du'
'blkid'
,
,
,
,
,
'grep'
'awk'
'sed'
'cut'
'sort'
,
,
,
,
,
'uniq'
'wc'
'he
,
,
ad'
'tail'
'less'
'more'
'diff'
'tr'
'tar'
,
,
,
,
,
,
,
'gzip'
,
'bzip2'
,
'zip'
,
'unzip'
,
'scp'
,
'rsync'
,
'sftp'
'uname'
'hostnamectl'
'ti
,
,
,
medatectl'
'free'
,
,
'uptime'
'vmstat'
'iostat'
'sar'
,
,
,
,
'dmesg'
,
'getenforce'
'setenforce'
'chcon'
'restorecon'
,
,
,
'setsebool'
,
,
'semanage'
,
'audit2why'
'audit2allow'
'docker'
,
,
,
'podman'
'kubectl'
'buildah'
,
,
,
'git'
'ansible'
,
,
'terraform'
,
'vagrant'
,
'jenkins'
'make'
'ssh'
,
,
,
'ssh-keygen'
,
'nmap'
'nikto'
'dirb'
,
,
,
'gobuster'
,
'hydra'
,
'john'
'
,
hashcat'
'msfconsole'
'msfvenom'
,
,
,
'aircrack-ng'
,
'sqlmap'
'enum4linux'
'smbclient'
,
,
,
'crackmapexec'
'
,
bloodhound'
,
'linpeas'
,
'responder'
'echo'
,
,
'printf'
,
'export'
'source'
'alias'
,
,
,
'history'
'man'
'which'
'where
,
,
,
is'
'date'
'cron'
'crontab'
'at'
,
,
,
,
,
'sleep'
,
'xargs'
'tee'
'visudo'
,
,
,
'chpasswd'
,
'newgrp'
,
'loginctl'
'resolvectl'
'n
,
,
mtui'
,
'tcpdump'
,
'iptables'
'nft'
,
,
'parted'
,
'mkswap'
,
'swapon'
,
'swapoff'
'xfs
,
_growfs'
'resize2fs'
'tune2fs'
,
,
'fsck'
'dd'
,
,
,
'modprobe'
'lsmod'
'dmidecode'
,
,
,
'lscpu'
,
'lspci'
'lsusb'
,
,
'logrotate'
'mailx'
'vi'
'vim'
'nano'
,
,
,
,
,
'eg
rep'
,
'fgrep'
,
'jq'
'nc'
'socat'
,
,
,
'openssl']);
const KWDS = new
Set(['if'
'then'
'else'
'elif'
'fi'
'for'
'do'
'done'
'while'
'until'
'case'
'esac'
'in'
'function'
'return'
'exit'
'brea
,
,
,
,
,
,
,
,
,
,
,
,
,
,
,
,
k'
'continue'
'select'
,
,
,
'trap'
'shift'
'eval'
'exec'
'set'
'unset'
,
,
,
,
,
,
'readonly'
'local'
'declare'
,
,
,
'typeset']);
function hLine(line) {
if (!line || !line.trim()) return [{t:line||' '
,c:'#00ff41'}];
if (line.trimStart().startsWith('#')) return [{t:line,c:'#666'}];
var toks=[],rem=line;
while(rem.length>0){
if(rem[0]===' '||rem[0]==='\t'){var w='';while(rem.length>0&&(rem[0]==='
'||rem[0]==='\t')){w+=rem[0];rem=rem.slice(1);}toks.push({t:w,c:'#00ff41'});continue;}
if(rem[0]==='"'||rem[0]==="'"){var
q=rem[0],s=q,j=1;while(j<rem.length&&rem[j]!==q){s+=rem[j];j++;}if(j<rem.length){s+=rem[j];j++;}
toks.push({t:s,c:'#ffaa00'});rem=rem.slice(j);continue;}
var wd='';while(rem.length>0&&rem[0]!=='
'&&rem[0]!=='\t'&&rem[0]!=='"'&&rem[0]!=="'"){wd+=rem[0];rem=rem.slice(1);}
if(KWDS.has(wd)||wd==='['||wd===']'){toks.push({t:wd,c:'#00d4ff'});}
else if(wd.startsWith('
-
')&&wd.length>1){toks.push({t:wd,c:'#b44aff'});}
else if(/^\d+$/.test(wd)){toks.push({t:wd,c:'#ff3e6c'});}
else if(CMDS.has(wd)){toks.push({t:wd,c:'#f1fa8c'});}
else{toks.push({t:wd,c:'#00ff41'});}
}
return toks;
}
function CodeBlock({children}){
const[copied,setCopied]=useState(false);
const lines=(children||"").split("\n");
const
copy=()=>{navigator.clipboard.writeText(children).then(()=>{setCopied(true);setTimeout(()=>set
Copied(false),1500);}).catch(()=>{});};
return(<div style={{position:"relative"
,background:"#0a0a0a"
,border:"1px solid
#333"
,borderRadius:6,margin:"8px 0"
,overflow:"hidden"}}><button onClick={copy}
style={{position:"absolute"
,top:6,right:6,background:"rgba(255,255,255,0.06)"
,border:"1px solid
#333"
,borderRadius:4,color:copied?"#00ff41":"#666"
,padding:"3px
10px"
,cursor:"pointer"
,fontFamily:"'Fira
Code'
,monospace"
,fontSize:10,zIndex:2}}>{copied?"COPIED":"COPY"}</button><div
style={{display:"flex"
,overflowX:"auto"}}><div style={{padding:"12px
0"
,minWidth:36,textAlign:"right"
,userSelect:"none"
,borderRight:"1px solid
#222"}}>{lines.map(function(_,i){return(<div key={i} style={{padding:"0
8px"
,fontSize:12,lineHeight:"1.6"
,color:"#333"
,fontFamily:"'Fira
Code'
,monospace"}}>{i+1}</div>);})}</div><pre style={{flex:1,padding:"12px
16px"
,margin:0,fontFamily:"'Fira Code'
'Courier
,
New'
,monospace"
,fontSize:13,lineHeight:1.6,whiteSpace:"pre-wrap"
,wordBreak:"break-all"}}>{lin
es.map(function(line,i){return(<div key={i}>{hLine(line).map(function(tk,j){return(<span key={j}
style={{color:tk.c}}>{tk.t}</span>);})}</div>);})}</pre></div></div>);
}
function Badge({theme,small}){var t=THEMES[theme];if(!t)return null;return <span
style={{display:"inline-flex"
,alignItems:"center"
,gap:4,padding:small?"2px 8px":"4px
12px"
,background:t.bg,border:"1px solid
"+t.border,borderRadius:999,fontSize:small?11:12,color:t.color,fontFamily:"'Fira
Code'
,monospace"
,fontWeight:600}}>{t.icon} {t.label}</span>;}
function StatusDot({status}){var c=status==="complete"?"#00ff41":"#ffaa00";return <span
style={{display:"inline-flex"
,alignItems:"center"
,gap:4,fontSize:11,color:c,fontFamily:"'Fira
Code'
,monospace"}}><span
style={{width:7,height:7,borderRadius:"50%"
,background:c,boxShadow:"0 0 6px
"+c+"44"}}/>{status==="complete"?"COMPLETE":"DRAFT"}</span>;}
function StatCard({label,value,color,sub}){return <div
style={{background:"rgba(255,255,255,0.03)"
,border:"1px solid
#2a2a2a"
,borderRadius:8,padding:"16px 20px"
,flex:"1 1 130px"
,minWidth:130}}><div
style={{fontSize:28,fontWeight:700,color:color,fontFamily:"'Fira
Code'
,monospace"}}>{value}</div><div
style={{fontSize:13,color:"#888"
,marginTop:4}}>{label}</div>{sub&&<div
style={{fontSize:11,color:"#555"
,marginTop:4}}>{sub}</div>}</div>;}
function ContactBar(){return(<div
style={{display:"flex"
,flexWrap:"wrap"
,gap:16,alignItems:"center"
,justifyContent:"center"
,padding:
"20px 0 8px"
,borderTop:"1px solid #1a1a1a"
,marginTop:24}}><a
href={"mailto:"+CONTACT.email} style={{color:"#888"
,fontSize:12,fontFamily:"'Fira
Code'
,monospace"
,textDecoration:"none"}}>{CONTACT.email}</a><a href={CONTACT.github}
target="
_
blank" rel="noopener noreferrer" style={{color:"#888"
,fontSize:12,fontFamily:"'Fira
Code'
,monospace"
,textDecoration:"none"}}>GitHub</a><a href={CONTACT.linkedin}
target="
_
blank" rel="noopener noreferrer" style={{color:"#888"
,fontSize:12,fontFamily:"'Fira
Code'
,monospace"
,textDecoration:"none"}}>LinkedIn</a></div>);}
function exportMd(e){var t=THEMES[e.theme];var md="# "+e.title+"\n\n";md+="**Theme:**
"+(t?t.label:e.theme)+" | **Date:** "+fmtDate(e.date)+" | **Status:**
"+e.status+"\n\n";if(e.objective)md+="##
Objective\n"+e.objective+"\n\n";if(e.environment)md+="## Environment /
Tools\n"+e.environment+"\n\n";if(e.steps)md+="##
Step-by-Step\n"+e.steps+"\n\n";if(e.codeBlocks)md+="## Commands &
Code\n
```bash\n"+e.codeBlocks+"\n
```\n\n";if(e.errors)md+="## Errors &
Troubleshooting\n"+e.errors+"\n\n";if(e.outcome)md+="##
Outcome\n"+e.outcome+"\n\n";if(e.takeaways)md+="## Key
Takeaways\n"+e.takeaways+"\n\n";if(e.references)md+="##
References\n"+e.references+"\n\n";var blob=new Blob([md],{type:"text/markdown"});var
a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=slug(e.title)+"
.
md";a.click();URL.revokeObjectURL(a.href);}
function ScreenshotManager({screenshots,onChange,themeColor}){
const
fileRef=useRef(null);const[urlInput,setUrlInput]=useState("");const[captionInput,setCaptionInput]
=useState("");const[mode,setMode]=useState(null);const[exp,setExp]=useState(null);
const
addUrl=()=>{if(!urlInput.trim())return;onChange([...screenshots,{src:urlInput.trim(),caption:captio
nInput.trim(),type:"url"}]);setUrlInput("");setCaptionInput("");setMode(null);};
const
handleFile=ev=>{Array.from(ev.target.files||[]).forEach(f=>{if(!f.type.startsWith("image/"))return;v
ar r=new
FileReader();r.onload=e=>onChange(prev=>[...prev,{src:e.target.result,caption:f.name,type:"file"
}]);r.readAsDataURL(f);});setMode(null);if(fileRef.current)fileRef.current.value="";};
const remove=i=>onChange(screenshots.filter((_,idx)=>idx!==i));
const updCap=(i,c)=>onChange(screenshots.map((s,idx)=>idx===i?{...s,caption:c}:s));
return(<div style={{marginBottom:20}}>
<div style={{fontSize:11,fontWeight:700,color:themeColor,fontFamily:"'Fira
Code'
,monospace"
,letterSpacing:1.5,marginBottom:8,paddingLeft:2,display:"flex"
,alignItems:"ce
nter"
,gap:8}}><span
style={{display:"inline-block"
,width:12,height:1,background:themeColor}}/>SCREENSHOTS</div
>
{screenshots.length>0&&<div
style={{display:"grid"
,gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))"
,gap:10,margin
Bottom:12}}>{screenshots.map((s,i)=><div key={i}
style={{position:"relative"
,background:"#1a1a1a"
,border:"1px solid
#2a2a2a"
,borderRadius:6,overflow:"hidden"}}><img src={s.src} alt={s.caption||""}
onClick={()=>setExp(s)}
style={{width:"100%"
,height:100,objectFit:"cover"
,cursor:"pointer"
,display:"block"}}/><div
style={{padding:"6px 8px"}}><input value={s.caption} onChange={e=>updCap(i,e.target.value)}
placeholder="Caption...
"
style={{width:"100%"
,background:"transparent"
,border:"none"
,color:"#999"
,fontSize:11,fontFamil
y:"'Fira Code'
,monospace"
,outline:"none"
,padding:0,boxSizing:"border-box"}}/></div><button
onClick={()=>remove(i)}
style={{position:"absolute"
,top:4,right:4,background:"rgba(0,0,0,0.7)"
,border:"none"
,color:"#ff3e6
c"
,width:20,height:20,borderRadius:4,cursor:"pointer"
,fontSize:12,lineHeight:"20px"
,textAlign:"ce
nter"
,padding:0}}>x</button></div>)}</div>}
{exp&&<div onClick={()=>setExp(null)}
style={{position:"fixed"
,top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.85)"
,zIndex:9999,di
splay:"flex"
,alignItems:"center"
,justifyContent:"center"
,cursor:"pointer"
,padding:20}}><div
style={{maxWidth:"90%"
,maxHeight:"90%"}}><img src={exp.src} alt={exp.caption}
style={{maxWidth:"100%"
,maxHeight:"80vh"
,borderRadius:8,border:"1px solid
#333"}}/>{exp.caption&&<p style={{color:"#999"
,fontSize:12,fontFamily:"'Fira
Code'
,monospace"
,textAlign:"center"
,marginTop:8}}>{exp.caption}</p>}</div></div>}
{!mode&&<div style={{display:"flex"
,gap:8,flexWrap:"wrap"}}><button
onClick={()=>setMode("upload")} style={{background:"rgba(255,255,255,0.03)"
,border:"1px
dashed #333"
,color:"#888"
,padding:"10px
16px"
,borderRadius:6,cursor:"pointer"
,fontFamily:"'Fira Code'
,monospace"
,fontSize:12}}>+
Upload image</button><button onClick={()=>setMode("url")}
style={{background:"rgba(255,255,255,0.03)"
,border:"1px dashed
#333"
,color:"#888"
,padding:"10px 16px"
,borderRadius:6,cursor:"pointer"
,fontFamily:"'Fira
Code'
,monospace"
,fontSize:12}}>+ Paste URL</button></div>}
{mode==="upload"&&<div style={{background:"#1a1a1a"
,border:"1px dashed
#333"
,borderRadius:6,padding:16,textAlign:"center"}}><input ref={fileRef} type="file"
accept="image/*" multiple onChange={handleFile} style={{display:"none"}}/><button
onClick={()=>fileRef.current?.click()} style={{background:"rgba(180,74,255,0.1)"
,border:"1px
solid rgba(180,74,255,0.3)"
,color:"#b44aff"
,padding:"10px
24px"
,borderRadius:6,cursor:"pointer"
,fontFamily:"'Fira
Code'
,monospace"
,fontSize:12,fontWeight:600}}>Choose files...
</button><p
style={{color:"#555"
,fontSize:11,fontFamily:"'Fira
Code'
,monospace"
,marginTop:8,marginBottom:0}}>PNG, JPG, GIF</p><button
onClick={()=>setMode(null)}
style={{background:"none"
,border:"none"
,color:"#555"
,fontSize:11,cursor:"pointer"
,marginTop:8,f
ontFamily:"'Fira Code'
,monospace"}}>cancel</button></div>}
{mode==="url"&&<div style={{background:"#1a1a1a"
,border:"1px solid
#2a2a2a"
,borderRadius:6,padding:14}}><input value={urlInput}
onChange={e=>setUrlInput(e.target.value)} placeholder="https://i.imgur.com/example.png"
style={{width:"100%"
,background:"#0d0d0d"
,border:"1px solid
#2a2a2a"
,borderRadius:4,padding:"8px 12px"
,color:"#ccc"
,fontSize:13,fontFamily:"'Fira
Code'
,monospace"
,outline:"none"
,marginBottom:8,boxSizing:"border-box"}}/><input
value={captionInput} onChange={e=>setCaptionInput(e.target.value)} placeholder="Caption
(optional)" style={{width:"100%"
,background:"#0d0d0d"
,border:"1px solid
#2a2a2a"
,borderRadius:4,padding:"8px 12px"
,color:"#ccc"
,fontSize:12,fontFamily:"'Fira
Code'
,monospace"
,outline:"none"
,marginBottom:8,boxSizing:"border-box"}}/><div
style={{display:"flex"
,gap:8}}><button onClick={addUrl} disabled={!urlInput.trim()}
style={{background:urlInput.trim()?"rgba(0,255,65,0.1)":"transparent"
,border:"1px solid
"+(urlInput.trim()?"rgba(0,255,65,0.3)":"#2a2a2a"),color:urlInput.trim()?"#00ff41":"#444"
,padding:
"6px 16px"
,borderRadius:4,cursor:urlInput.trim()?"pointer":"not-allowed"
,fontFamily:"'Fira
Code'
,monospace"
,fontSize:12,fontWeight:600}}>ADD</button><button
onClick={()=>{setMode(null);setUrlInput("");setCaptionInput("");}}
style={{background:"none"
,border:"1px solid #333"
,color:"#666"
,padding:"6px
16px"
,borderRadius:4,cursor:"pointer"
,fontFamily:"'Fira
Code'
,monospace"
,fontSize:12}}>CANCEL</button></div></div>}
</div>);
}
function ScreenshotGallery({screenshots}){
const[exp,setExp]=useState(null);if(!screenshots||!screenshots.length)return null;
return(<div style={{marginBottom:24}}><div
style={{display:"grid"
,gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))"
,gap:10}}>{scre
enshots.map((s,i)=><div key={i} style={{background:"#1a1a1a"
,border:"1px solid
#2a2a2a"
,borderRadius:6,overflow:"hidden"
,cursor:"pointer"}} onClick={()=>setExp(s)}><img
src={s.src} alt={s.caption||""}
style={{width:"100%"
,height:130,objectFit:"cover"
,display:"block"}}/>{s.caption&&<div
style={{padding:"6px 10px"
,fontSize:11,color:"#888"
,fontFamily:"'Fira
Code'
,monospace"}}>{s.caption}</div>}</div>)}</div>{exp&&<div onClick={()=>setExp(null)}
style={{position:"fixed"
,top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.85)"
,zIndex:9999,di
splay:"flex"
,alignItems:"center"
,justifyContent:"center"
,cursor:"pointer"
,padding:20}}><div
style={{maxWidth:"90%"
,maxHeight:"90%"}}><img src={exp.src} alt={exp.caption}
style={{maxWidth:"100%"
,maxHeight:"80vh"
,borderRadius:8,border:"1px solid
#333"}}/>{exp.caption&&<p style={{color:"#999"
,fontSize:12,fontFamily:"'Fira
Code'
,monospace"
,textAlign:"center"
,marginTop:8}}>{exp.caption}</p>}</div></div>}</div>);
}
function EntryForm({initial,onSave,onCancel,isEdit}){
const[form,setForm]=useState(()=>{var
b=initial||{...EMPTY};return{...b,screenshots:b.screenshots||[]};});
const upd=(k,v)=>setForm(p=>({...p,[k]:v}));
const tc=THEMES[form.theme]?THEMES[form.theme].color:"#00ff41";
const ok=form.title.trim()&&form.objective.trim();
return(<div style={{maxWidth:800,margin:"0 auto"
,padding:"20px 16px"}}>
<button onClick={onCancel} style={{background:"none"
,border:"1px solid
#333"
,color:"#888"
,padding:"6px 16px"
,borderRadius:6,cursor:"pointer"
,fontFamily:"'Fira
Code'
,monospace"
,fontSize:12,marginBottom:20}}>← BACK</button>
<h1 style={{fontSize:22,fontWeight:700,color:"#00ff41"
,fontFamily:"'Fira
Code'
,monospace"
,margin:"0 0 4px"
,textShadow:"0 0 20px rgba(0,255,65,0.3)"}}>&gt;_
{isEdit?"edit
_
entry":"new
_
entry"}</h1>
<p style={{color:"#555"
,fontSize:12,fontFamily:"'Fira Code'
,monospace"
,margin:"0 0
24px"}}>{isEdit?"update your journal entry":"fill in the details of what you worked on"}</p>
<div style={{display:"flex"
,gap:10,marginBottom:16,flexWrap:"wrap"}}><input value={form.title}
onChange={e=>upd("title"
,e.target.value)} placeholder="Entry title...
" style={{flex:"1 1
300px"
,background:"#1a1a1a"
,border:"1px solid #2a2a2a"
,borderRadius:6,padding:"10px
14px"
,color:"#e0e0e0"
,fontSize:15,fontFamily:"'Segoe
UI'
,sans-serif"
,outline:"none"
,boxSizing:"border-box"}}/><input type="date" value={form.date}
onChange={e=>upd("date"
,e.target.value)} style={{background:"#1a1a1a"
,border:"1px solid
#2a2a2a"
,borderRadius:6,padding:"10px 14px"
,color:"#e0e0e0"
,fontSize:13,fontFamily:"'Fira
Code'
,monospace"
,outline:"none"
,colorScheme:"dark"}}/></div>
<div
style={{display:"flex"
,gap:8,marginBottom:16,flexWrap:"wrap"}}>{Object.entries(THEMES).map((
[k,t])=><button key={k} onClick={()=>upd("theme"
,k)}
style={{background:form.theme===k?t.bg:"transparent"
,border:"1px solid
"+(form.theme===k?t.border:"#2a2a2a"),color:form.theme===k?t.color:"#555"
,padding:"7px
16px"
,borderRadius:6,cursor:"pointer"
,fontFamily:"'Fira
Code'
,monospace"
,fontSize:12,fontWeight:600}}>{t.icon} {t.label}</button>)}</div>
<div style={{display:"flex"
,gap:8,marginBottom:24}}>{["draft"
,
"complete"].map(s=><button
key={s} onClick={()=>upd("status"
,s)}
style={{background:form.status===s?(s==="complete"?"rgba(0,255,65,0.1)":"rgba(255,170,0,0.1
)"):"transparent"
,border:"1px solid
"+(form.status===s?(s==="complete"?"rgba(0,255,65,0.3)":"rgba(255,170,0,0.3)"):"#2a2a2a"),co
lor:form.status===s?(s==="complete"?"#00ff41":"#ffaa00"):"#555"
,padding:"6px
14px"
,borderRadius:6,cursor:"pointer"
,fontFamily:"'Fira
Code'
,monospace"
,fontSize:11,fontWeight:600,textTransform:"uppercase"}}>{s}</button>)}</div
>
{FIELDS.map(f=><div key={f.key} style={{marginBottom:20}}><label
style={{display:"block"
,fontSize:11,fontWeight:700,color:tc,fontFamily:"'Fira
Code'
,monospace"
,letterSpacing:1.5,marginBottom:6,paddingLeft:2}}><span
style={{display:"inline-block"
,width:12,height:1,background:tc,marginRight:8,verticalAlign:"middle
"}}/>{f.label}</label><textarea value={form[f.key]} onChange={e=>upd(f.key,e.target.value)}
placeholder={f.placeholder} rows={f.rows}
style={{width:"100%"
,background:f.isCode?"#0a0a0a":"#1a1a1a"
,border:"1px solid
#2a2a2a"
,borderRadius:6,padding:"10px
14px"
,color:f.isCode?"#00ff41":"#ccc"
,fontSize:13,fontFamily:f.isCode?"'Fira Code'
'Courier
,
New'
,monospace":"'Segoe
UI'
,sans-serif"
,lineHeight:1.7,resize:"vertical"
,outline:"none"
,boxSizing:"border-box"}}/></div>)}
<ScreenshotManager screenshots={form.screenshots} onChange={v=>{if(typeof
v==="function")setForm(p=>({...p,screenshots:v(p.screenshots)}));else upd("screenshots"
,v);}}
themeColor={tc}/>
<div
style={{display:"flex"
,gap:10,justifyContent:"flex-end"
,marginTop:8,paddingBottom:32}}><button
onClick={onCancel} style={{background:"transparent"
,border:"1px solid
#333"
,color:"#888"
,padding:"10px 24px"
,borderRadius:6,cursor:"pointer"
,fontFamily:"'Fira
Code'
,monospace"
,fontSize:13,fontWeight:600}}>CANCEL</button><button
onClick={()=>ok&&onSave(form)} disabled={!ok}
style={{background:ok?"rgba(0,255,65,0.12)":"rgba(255,255,255,0.03)"
,border:"1px solid
"+(ok?"#00ff41":"#2a2a2a"),color:ok?"#00ff41":"#444"
,padding:"10px
28px"
,borderRadius:6,cursor:ok?"pointer":"not-allowed"
,fontFamily:"'Fira
Code'
,monospace"
,fontSize:13,fontWeight:700,textShadow:ok?"0 0 10px
rgba(0,255,65,0.3)":"none"}}>{isEdit?"UPDATE ENTRY":"SAVE ENTRY"}</button></div>
</div>);
}
export default function TechJournal(){
const[entries,setEntries]=useState(loadEntries);
const[activeTheme,setActiveTheme]=useState("all");
const[view,setView]=useState("dashboard");
const[selected,setSelected]=useState(null);
const[search,setSearch]=useState("");
const[sortBy,setSortBy]=useState("newest");
const[formMode,setFormMode]=useState(null);
const[editTarget,setEditTarget]=useState(null);
const[delConfirm,setDelConfirm]=useState(null);
const[exportNotice,setExportNotice]=useState(false);
const[isAdmin,setIsAdmin]=useState(()=>{try{return
localStorage.getItem(ADMIN
_
KEY)==='true';}catch{return false;}});
const toggleAdmin=useCallback(()=>{setIsAdmin(prev=>{var
next=!prev;try{localStorage.setItem(ADMIN
_
KEY,next?'true':'false');}catch{}return next;});},[]);
const nextId=useMemo(()=>Math.max(0,...entries.map(e=>e.id))+1,[entries]);
const updateEntries=useCallback((fn)=>{setEntries(prev=>{var next=typeof
fn==='function'?fn(prev):fn;persistEntries(next);return next;});},[]);
const themeCounts=useMemo(()=>{var
c={all:entries.length};Object.keys(THEMES).forEach(t=>{c[t]=entries.filter(e=>e.theme===t).leng
th;});return c;},[entries]);
const filtered=useMemo(()=>{
var e=entries;
if(activeTheme!=="all")e=e.filter(x=>x.theme===activeTheme);
if(search.trim()){var
q=search.toLowerCase();e=e.filter(x=>x.title.toLowerCase().includes(q)||x.objective.toLowerCas
e().includes(q)||x.steps.toLowerCase().includes(q)||(x.codeBlocks&&x.codeBlocks.toLowerCase(
).includes(q)));}
var pinned=e.filter(x=>x.pinned);var unpinned=e.filter(x=>!x.pinned);
var sortFn=(a,b)=>{if(sortBy==="newest")return new Date(b.date)-new
Date(a.date);if(sortBy==="oldest")return new Date(a.date)-new
Date(b.date);if(sortBy==="az")return
a.title.localeCompare(b.title);if(sortBy==="drafts")return(a.status==="draft"?0:1)-(b.status==="dr
aft"?0:1)||new Date(b.date)-new Date(a.date);return 0;};
return[...pinned.sort(sortFn),...unpinned.sort(sortFn)];
},[entries,activeTheme,search,sortBy]);
const stats=useMemo(()=>{
var
total=entries.length,complete=entries.filter(e=>e.status==="complete").length,drafts=total-compl
ete,pins=entries.filter(e=>e.pinned).length;
var
perTheme={};Object.keys(THEMES).forEach(t=>{perTheme[t]=entries.filter(e=>e.theme===t).le
ngth;});
var dates=entries.map(e=>new Date(e.date+"T00:00:00")).sort((a,b)=>b-a);var streak=0;
if(dates.length){var today=new Date();today.setHours(0,0,0,0);var ch=new Date(today);var
ds=new
Set(dates.map(d=>d.toDateString()));while(ds.has(ch.toDateString())){streak++;ch.setDate(ch.g
etDate()-1);}if(streak===0){ch=new
Date(today);ch.setDate(ch.getDate()-1);while(ds.has(ch.toDateString())){streak++;ch.setDate(ch
.getDate()-1);}}}
return{total:total,complete:complete,drafts:drafts,pins:pins,perTheme:perTheme,streak:streak};
},[entries]);
const
togglePin=useCallback((id)=>{updateEntries(prev=>prev.map(e=>e.id===id?{...e,pinned:!e.pinn
ed}:e));setSelected(prev=>prev&&prev.id===id?{...prev,pinned:!prev.pinned}:prev);},[updateEntri
es]);
const
handleSave=useCallback(form=>{if(formMode==="edit"&&editTarget){updateEntries(prev=>prev
.map(e=>e.id===editTarget.id?{...form,id:editTarget.id}:e));setSelected({...form,id:editTarget.id});}
else{var
ne={...form,id:nextId};updateEntries(prev=>[...prev,ne]);setSelected(ne);}setFormMode(null);set
EditTarget(null);},[formMode,editTarget,nextId,updateEntries]);
const
handleDelete=useCallback(id=>{updateEntries(prev=>prev.filter(e=>e.id!==id));setSelected(null)
;setDelConfirm(null);},[updateEntries]);
const handleCancel=useCallback(()=>{setFormMode(null);setEditTarget(null);},[]);
const
handleExport=useCallback(e=>{exportMd(e);setExportNotice(true);setTimeout(()=>setExportNot
ice(false),2000);},[]);
if(formMode)return <div
style={{background:"#0d0d0d"
,minHeight:"100vh"
,color:"#e0e0e0"
,fontFamily:"'Segoe
UI'
,sans-serif"}}><EntryForm initial={formMode==="edit"?editTarget:null} onSave={handleSave}
onCancel={handleCancel} isEdit={formMode==="edit"}/></div>;
if(selected){
var e=selected,t=THEMES[e.theme];
return(<div
style={{background:"#0d0d0d"
,minHeight:"100vh"
,color:"#e0e0e0"
,fontFamily:"'Segoe
UI'
,sans-serif"}}><div style={{maxWidth:800,margin:"0 auto"
,padding:"20px 16px"}}>
<div
style={{display:"flex"
,justifyContent:"space-between"
,alignItems:"center"
,flexWrap:"wrap"
,gap:8,
marginBottom:20}}>
<button onClick={()=>{setSelected(null);setDelConfirm(null);}}
style={{background:"none"
,border:"1px solid #333"
,color:"#888"
,padding:"6px
16px"
,borderRadius:6,cursor:"pointer"
,fontFamily:"'Fira Code'
,monospace"
,fontSize:12}}>←
BACK</button>
{isAdmin&&<div style={{display:"flex"
,gap:6,flexWrap:"wrap"}}>
<button onClick={()=>togglePin(e.id)}
style={{background:e.pinned?"rgba(255,170,0,0.1)":"transparent"
,border:"1px solid
"+(e.pinned?"rgba(255,170,0,0.3)":"#333"),color:e.pinned?"#ffaa00":"#666"
,padding:"6px
14px"
,borderRadius:6,cursor:"pointer"
,fontFamily:"'Fira
Code'
,monospace"
,fontSize:12,fontWeight:600}}>{e.pinned?"★ PINNED":"☆ PIN"}</button>
<button onClick={()=>handleExport(e)}
style={{background:"rgba(0,255,65,0.08)"
,border:"1px solid
rgba(0,255,65,0.25)"
,color:"#00ff41"
,padding:"6px
14px"
,borderRadius:6,cursor:"pointer"
,fontFamily:"'Fira
Code'
,monospace"
,fontSize:12,fontWeight:600}}>EXPORT .MD</button>
<button onClick={()=>{setEditTarget(e);setFormMode("edit");}}
style={{background:"rgba(0,212,255,0.08)"
,border:"1px solid
rgba(0,212,255,0.25)"
,color:"#00d4ff"
,padding:"6px
14px"
,borderRadius:6,cursor:"pointer"
,fontFamily:"'Fira
Code'
,monospace"
,fontSize:12,fontWeight:600}}>EDIT</button>
{delConfirm===e.id?<div style={{display:"flex"
,gap:6,alignItems:"center"}}><span
style={{fontSize:11,color:"#ff3e6c"
,fontFamily:"'Fira
Code'
,monospace"}}>confirm?</span><button onClick={()=>handleDelete(e.id)}
style={{background:"rgba(255,62,108,0.15)"
,border:"1px solid
rgba(255,62,108,0.4)"
,color:"#ff3e6c"
,padding:"5px
12px"
,borderRadius:6,cursor:"pointer"
,fontFamily:"'Fira
Code'
,monospace"
,fontSize:11,fontWeight:700}}>YES</button><button
onClick={()=>setDelConfirm(null)} style={{background:"none"
,border:"1px solid
#333"
,color:"#888"
,padding:"5px 12px"
,borderRadius:6,cursor:"pointer"
,fontFamily:"'Fira
Code'
,monospace"
,fontSize:11}}>NO</button></div>:<button onClick={()=>setDelConfirm(e.id)}
style={{background:"rgba(255,62,108,0.08)"
,border:"1px solid
rgba(255,62,108,0.25)"
,color:"#ff3e6c"
,padding:"6px
14px"
,borderRadius:6,cursor:"pointer"
,fontFamily:"'Fira
Code'
,monospace"
,fontSize:12,fontWeight:600}}>DELETE</button>}
</div>}
</div>
{exportNotice&&<div style={{background:"rgba(0,255,65,0.08)"
,border:"1px solid
rgba(0,255,65,0.2)"
,borderRadius:6,padding:"8px
14px"
,marginBottom:16,fontSize:12,color:"#00ff41"
,fontFamily:"'Fira
Code'
,monospace"}}>Exported — check your downloads.
</div>}
<div
style={{display:"flex"
,flexWrap:"wrap"
,gap:10,alignItems:"center"
,marginBottom:8}}><Badge
theme={e.theme}/> <StatusDot status={e.status}/>{e.pinned&&<span
style={{fontSize:11,color:"#ffaa00"
,fontFamily:"'Fira Code'
,monospace"}}>★
PINNED</span>}</div>
<h1 style={{fontSize:26,fontWeight:700,color:"#fff"
,margin:"8px 0
4px"
,lineHeight:1.3}}>{e.title}</h1>
<div style={{fontSize:13,color:"#555"
,fontFamily:"'Fira
Code'
,monospace"
,marginBottom:24}}>{fmtDate(e.date)}</div>
{[{label:"OBJECTIVE"
,content:e.objective},{label:"ENVIRONMENT /
TOOLS"
,content:e.environment},{label:"STEP-BY-STEP"
,content:e.steps},{label:"COMMANDS
& CODE"
,content:e.codeBlocks,isCode:true},{label:"ERRORS &
TROUBLESHOOTING"
,content:e.errors},{label:"OUTCOME"
,content:e.outcome},{label:"KEY
TAKEAWAYS"
,content:e.takeaways},{label:"REFERENCES"
,content:e.references}].map((s,i)=>s
.content?<div key={i} style={{marginBottom:24}}><div
style={{fontSize:11,fontWeight:700,color:t.color,fontFamily:"'Fira
Code'
,monospace"
,letterSpacing:1.5,marginBottom:8,display:"flex"
,alignItems:"center"
,gap:8}}>
<span
style={{width:12,height:1,background:t.color,display:"inline-block"}}/>{s.label}</div>{s.isCode?<
CodeBlock>{s.content}</CodeBlock>:<div
style={{fontSize:14,lineHeight:1.8,color:"#ccc"
,whiteSpace:"pre-wrap"}}>{s.content}</div>}</div>
:null)}
{e.screenshots&&e.screenshots.length>0&&<div style={{marginBottom:24}}><div
style={{fontSize:11,fontWeight:700,color:t.color,fontFamily:"'Fira
Code'
,monospace"
,letterSpacing:1.5,marginBottom:8,display:"flex"
,alignItems:"center"
,gap:8}}>
<span
style={{width:12,height:1,background:t.color,display:"inline-block"}}/>SCREENSHOTS</div><Sc
reenshotGallery screenshots={e.screenshots}/></div>}
</div></div>);
}
return(<div
style={{background:"#0d0d0d"
,minHeight:"100vh"
,color:"#e0e0e0"
,fontFamily:"'Segoe
UI'
,sans-serif"}}><div style={{maxWidth:900,margin:"0 auto"
,padding:"20px 16px"}}>
<div
style={{marginBottom:24,display:"flex"
,justifyContent:"space-between"
,alignItems:"flex-start"
,flex
Wrap:"wrap"
,gap:12}}>
<div><h1 style={{fontSize:24,fontWeight:700,color:"#00ff41"
,fontFamily:"'Fira
Code'
,monospace"
,margin:0,textShadow:"0 0 20px rgba(0,255,65,0.3)"}}>&gt;_
tech
_journal</h1><p style={{color:"#555"
,fontSize:13,margin:"4px 0 0"
,fontFamily:"'Fira
Code'
,monospace"}}>sysadmin · devops · offensive security · hackerbox</p></div>
<div style={{display:"flex"
,gap:6,alignItems:"center"}}>
<button onClick={toggleAdmin}
style={{width:8,height:8,borderRadius:"50%"
,background:isAdmin?"#00ff41":"#1a1a1a"
,border:"
none"
,cursor:"pointer"
,padding:0,opacity:isAdmin?1:0.3}} title=""/>
{["dashboard"
,
"entries"].map(v=><button key={v} onClick={()=>setView(v)}
style={{background:view===v?"rgba(0,255,65,0.12)":"transparent"
,border:"1px solid
"+(view===v?"#00ff41":"#333"),color:view===v?"#00ff41":"#666"
,padding:"6px
14px"
,borderRadius:6,cursor:"pointer"
,fontFamily:"'Fira
Code'
,monospace"
,fontSize:12,fontWeight:600}}>{v.toUpperCase()}</button>)}
</div>
</div>
{isAdmin&&<div style={{background:"rgba(0,255,65,0.05)"
,border:"1px solid
rgba(0,255,65,0.15)"
,borderRadius:6,padding:"6px
12px"
,marginBottom:16,fontSize:11,color:"#00ff41"
,fontFamily:"'Fira
Code'
,monospace"
,display:"flex"
,justifyContent:"space-between"
,alignItems:"center"}}><span>A
DMIN MODE — editing enabled</span><button onClick={toggleAdmin}
style={{background:"none"
,border:"1px solid rgba(0,255,65,0.2)"
,color:"#00ff41"
,padding:"2px
8px"
,borderRadius:4,cursor:"pointer"
,fontFamily:"'Fira
Code'
,monospace"
,fontSize:10}}>LOCK</button></div>}
{view==="dashboard"&&<div style={{marginBottom:28}}><div
style={{display:"flex"
,flexWrap:"wrap"
,gap:12,marginBottom:20}}><StatCard label="Total Entries"
value={stats.total} color="#fff"/><StatCard label="Completed" value={stats.complete}
color="#00ff41" sub={stats.drafts+" drafts"}/><StatCard label="Day Streak" value={stats.streak}
color="#ffaa00" sub="consecutive days"/><StatCard label="Pinned" value={stats.pins}
color="#ffaa00" sub="★ favorites"/></div><div
style={{display:"flex"
,flexWrap:"wrap"
,gap:12}}>{Object.entries(THEMES).map(([k,t])=><StatCar
d key={k} label={t.label} value={stats.perTheme[k]||0} color={t.color} sub={t.icon+"
entries"}/>)}</div></div>}
<div
style={{display:"flex"
,flexWrap:"wrap"
,gap:8,marginBottom:10,alignItems:"center"}}>{[{key:"all"
,la
bel:"All"},...Object.entries(THEMES).map(([k,v])=>({key:k,label:v.icon+"
"+v.label}))].map(f=><button key={f.key} onClick={()=>setActiveTheme(f.key)}
style={{background:activeTheme===f.key?"rgba(255,255,255,0.08)":"transparent"
,border:"1px
solid
"+(activeTheme===f.key?"#555":"#2a2a2a"),color:activeTheme===f.key?"#fff":"#666"
,padding:"
5px 14px"
,borderRadius:6,cursor:"pointer"
,fontFamily:"'Fira
Code'
,monospace"
,fontSize:12}}>{f.label} <span
style={{marginLeft:4,fontSize:10,color:activeTheme===f.key?"#888":"#444"}}>({themeCounts[f.k
ey]||0})</span></button>)}</div>
<div style={{display:"flex"
,flexWrap:"wrap"
,gap:8,marginBottom:16,alignItems:"center"}}>
<div style={{flex:"1 1 160px"
,minWidth:140}}><input type="text" placeholder="Search
entries...
" value={search} onChange={e=>setSearch(e.target.value)}
style={{width:"100%"
,background:"rgba(255,255,255,0.03)"
,border:"1px solid
#2a2a2a"
,borderRadius:6,padding:"8px 12px"
,color:"#ccc"
,fontSize:13,fontFamily:"'Fira
Code'
,monospace"
,outline:"none"
,boxSizing:"border-box"}}/></div>
<div style={{display:"flex"
,gap:4,alignItems:"center"}}><span
style={{fontSize:11,color:"#444"
,fontFamily:"'Fira
Code'
,monospace"
,marginRight:2}}>Sort:</span>{SORT
_
OPTIONS.map(s=><button
key={s.key} onClick={()=>setSortBy(s.key)}
style={{background:sortBy===s.key?"rgba(0,255,65,0.1)":"transparent"
,border:"1px solid
"+(sortBy===s.key?"rgba(0,255,65,0.25)":"#2a2a2a"),color:sortBy===s.key?"#00ff41":"#555"
,pa
dding:"4px 10px"
,borderRadius:4,cursor:"pointer"
,fontFamily:"'Fira
Code'
,monospace"
,fontSize:10,fontWeight:600}}>{s.label}</button>)}</div>
{isAdmin&&<button onClick={()=>setFormMode("create")}
style={{background:"rgba(0,255,65,0.1)"
,border:"1px solid
rgba(0,255,65,0.3)"
,color:"#00ff41"
,padding:"8px
18px"
,borderRadius:6,cursor:"pointer"
,fontFamily:"'Fira
Code'
,monospace"
,fontSize:12,fontWeight:700,whiteSpace:"nowrap"
,textShadow:"0 0 10px
rgba(0,255,65,0.3)"}}>+ NEW ENTRY</button>}
</div>
<div style={{display:"flex"
,flexDirection:"column"
,gap:8}}>
{filtered.length===0&&<div
style={{textAlign:"center"
,padding:40,color:"#444"
,fontFamily:"'Fira
Code'
,monospace"
,fontSize:13}}>{search?"No entries match your search.
":"No entries
yet.
"}</div>}
{filtered.map((e,idx)=>{
var t=THEMES[e.theme],hasImgs=e.screenshots&&e.screenshots.length>0;
var showPinDivider=e.pinned&&(idx===0||!filtered[idx-1].pinned);
var showAllDivider=!e.pinned&&idx>0&&filtered[idx-1].pinned;
return(<div key={e.id}>
{showPinDivider&&<div style={{fontSize:10,color:"#ffaa00"
,fontFamily:"'Fira
Code'
,monospace"
,letterSpacing:1.5,marginBottom:6,paddingLeft:4}}>★ PINNED</div>}
{showAllDivider&&<div style={{fontSize:10,color:"#444"
,fontFamily:"'Fira
Code'
,monospace"
,letterSpacing:1.5,margin:"12px 0 6px"
,paddingLeft:4,borderTop:"1px solid
#1a1a1a"
,paddingTop:12}}>ALL ENTRIES</div>}
<div onClick={()=>setSelected(e)}
style={{background:e.pinned?"rgba(255,170,0,0.03)":"rgba(255,255,255,0.02)"
,border:"1px solid
"+(e.pinned?"rgba(255,170,0,0.12)":"#1e1e1e"),borderRadius:8,padding:"16px
20px"
,cursor:"pointer"
,borderLeft:"3px solid "+t.color}}
onMouseEnter={ev=>{ev.currentTarget.style.background=e.pinned?"rgba(255,170,0,0.06)":"rgb
a(255,255,255,0.05)";}}
onMouseLeave={ev=>{ev.currentTarget.style.background=e.pinned?"rgba(255,170,0,0.03)":"rgb
a(255,255,255,0.02)";}}>
<div
style={{display:"flex"
,justifyContent:"space-between"
,alignItems:"flex-start"
,flexWrap:"wrap"
,gap:
8}}>
<div style={{flex:1,minWidth:200}}>
<div
style={{display:"flex"
,gap:8,alignItems:"center"
,flexWrap:"wrap"
,marginBottom:6}}><Badge
theme={e.theme} small={true}/> <StatusDot status={e.status}/>{e.pinned&&<span
style={{fontSize:10,color:"#ffaa00"
,fontFamily:"'Fira
Code'
,monospace"}}>★</span>}{hasImgs&&<span
style={{fontSize:10,color:"#555"
,fontFamily:"'Fira Code'
,monospace"}}>{e.screenshots.length}
img{e.screenshots.length>1?"s":""}</span>}</div>
<div
style={{fontSize:16,fontWeight:600,color:"#e8e8e8"
,marginBottom:4}}>{e.title}</div>
<div
style={{fontSize:13,color:"#777"
,lineHeight:1.5,display:"
-webkit-box"
,WebkitLineClamp:2,Webkit
BoxOrient:"vertical"
,overflow:"hidden"}}>{e.objective}</div>
</div>
<div style={{fontSize:12,color:"#444"
,fontFamily:"'Fira
Code'
,monospace"
,whiteSpace:"nowrap"
,paddingTop:4}}>{fmtDate(e.date)}<div
style={{fontSize:11,color:"#333"
,marginTop:2}}>{daysAgo(e.date)}d ago</div></div>
</div>
</div>
</div>);
})}
</div>
<ContactBar/>
<div style={{textAlign:"center"
,padding:"12px 0
16px"
,color:"#2a2a2a"
,fontSize:11,fontFamily:"'Fira Code'
,monospace"}}>tech
_journal v3.3 ·
{entries.length} entries logged</div>
</div></div>);
}