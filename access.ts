import {createHmac,randomBytes,createHash,timingSafeEqual} from 'node:crypto';
import {cookies} from 'next/headers';
const cookieName='awakening_access';
function env(name:string){const v=process.env[name];if(!v)throw new Error(`缺少环境变量 ${name}`);return v;}
function sign(v:string){return createHmac('sha256',env('SESSION_SECRET')).update(v).digest('hex');}
export function makeToken(id:string){const payload=Buffer.from(JSON.stringify({id,exp:Date.now()+1000*60*60*24*30})).toString('base64url');return payload+'.'+sign(payload);}
export async function sessionId(){const token=(await cookies()).get(cookieName)?.value;if(!token)return null;const [p,s]=token.split('.');if(!p||!s)return null;const expected=sign(p);if(s.length!==expected.length||!timingSafeEqual(Buffer.from(s),Buffer.from(expected)))return null;try{const v=JSON.parse(Buffer.from(p,'base64url').toString());return typeof v.id==='string'&&v.exp>Date.now()?v.id:null}catch{return null}}
export function cookieOptions(){return {httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax' as const,path:'/',maxAge:60*60*24*30};}
export function generateCode(){const alphabet='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';return Array.from(randomBytes(8),x=>alphabet[x%alphabet.length]).join('');}
export function hashCode(code:string){return createHash('sha256').update(env('CODE_PEPPER')+':'+code).digest('hex');}
export function adminOK(request:Request){const h=request.headers.get('authorization')||'';const token=h.startsWith('Bearer ')?h.slice(7):'';const actual=process.env.ADMIN_TOKEN||'';return actual.length>=32&&token.length===actual.length&&timingSafeEqual(Buffer.from(token),Buffer.from(actual));}
export async function db(path:string,init:RequestInit={}){const base=env('SUPABASE_URL').replace(/\/$/,'');const key=env('SUPABASE_SERVICE_ROLE_KEY');return fetch(base+'/rest/v1/'+path,{...init,headers:{apikey:key,Authorization:'Bearer '+key,'Content-Type':'application/json',...init.headers},cache:'no-store'});}
export function noStore(data:unknown,status=200){return Response.json(data,{status,headers:{'Cache-Control':'no-store'}})}
