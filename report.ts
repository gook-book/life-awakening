import {base,followups,domains,type Answers,type Domain} from './questions';
export type Dimension={domain:Domain;name:string;level:string;phase:string;confidence:string;evidence:string[];strength:string;gap:string;index:number};
export type Report={id:string;createdAt:string;mode:'rule';metatype:string;summary:string;archetype:string;dimensions:Dimension[];primaryBlock:string;crossImpact:string;coreProblem:string;actions30:string[];actions90:string[];longTerm:string;limitations:string};
export function makeEvidence(a:Answers){return [...base,...followups].filter(q=>a[q.id]&&q.options.some(o=>o.id===a[q.id])).map(q=>({domain:q.domain,question:q.title,answer:q.options.find(o=>o.id===a[q.id])!.text,signal:q.options.find(o=>o.id===a[q.id])!.signal}));}
const guidance:Record<Domain,{strength:[string,string,string];gap:[string,string,string];step:string;weekly:string;measure:string;bridge:string}>={
 mind:{strength:['你能识别熟悉的信息来源，适合从比较两种解释开始练习','你愿意独立核查观点，已有主动探索的迹象','你倾向于比较反证与适用条件，并尝试将知识用于行动'],gap:['遇到冲突观点时，先暂停判断并查找原始证据','从“证明自己正确”转向主动寻找反例','检验这种审慎思考是否也能在压力或时间紧迫时保持'],step:'选择一个近期相信的观点，写下支持证据和最强反例',weekly:'把一个学到的概念应用于现实问题，记录结果',measure:'每周记录一次观点修订或实际应用',bridge:'用清晰的记录方法支持其他领域的决策'},
 body:{strength:['你已注意到作息与行动习惯的问题，适合从最小可执行习惯开始','你有尝试调整生活节律的意愿与经验','你倾向于为忙碌时期保留可持续的基本习惯'],gap:['先建立一个小到忙碌时也能完成的日常动作','降低计划强度，优先提高连续执行率','检查睡眠、活动和恢复是否真正长期稳定'],step:'连续七天记录睡眠时间和一次轻量活动',weekly:'设计一个忙碌日也能完成的10分钟替代方案',measure:'每周统计实际完成天数，而非计划天数',bridge:'利用稳定精力为学习与关系投入提供支持'},
 spirit:{strength:['你能辨认关系与归属的现状，已有自我观察的起点','你开始尝试表达个人立场与需求','你倾向于理解差异、沟通边界并维护双向关系'],gap:['从一段低压力的联系开始建立稳定支持','练习同时表达自己的需求与理解对方的观点','在真实冲突中检验沟通与修复是否有效'],step:'主动联系一位可信任的人，进行一次真实交流',weekly:'回顾一次分歧，写下双方需求与可协商之处',measure:'每周记录一次主动联系或建设性沟通',bridge:'通过支持关系减少独自承担困难的压力'},
 vocation:{strength:['你能意识到职业与技能发展的现状，适合开始小规模尝试','你愿意探索方向，并尝试将想法变成行动','你倾向于用实际交付、外部反馈和迭代判断成长'],gap:['减少纯信息收集，先完成一个可展示的小成果','让每次尝试都获得可观察的外部反馈','检验现有能力能否脱离教程在新情境复用'],step:'选一个可在一周内交付的小任务，明确验收标准',weekly:'把成果交给一位真实使用者并询问具体问题',measure:'每周记录交付次数和外部反馈，而非学习时长',bridge:'用实际反馈帮助筛选更值得投入的学习方向'}
};
const stages=['偏向依赖既有路径','偏向自主探索','偏向整合与实践'];
function stage(s:number){return s<1.7?0:s<2.45?1:2}
function escapeEvidence(text:string){return text.length>90?text.slice(0,90)+'…':text}
export function makeReport(a:Answers):Report{
 const evidence=makeEvidence(a);
 const dimensions=(Object.keys(domains) as Domain[]).map(domain=>{
  const rows=evidence.filter(e=>e.domain===domain),baseRows=rows.filter(e=>base.some(q=>q.title===e.question)),followRows=rows.filter(e=>followups.some(q=>q.title===e.question));
  const mean=(arr:typeof rows)=>arr.reduce((s,x)=>s+x.signal,0)/Math.max(1,arr.length);
  const baseAvg=mean(baseRows), followAvg=followRows.length?mean(followRows):baseAvg;
  // 基础题权重较高，追问用于校核，避免因为触发追问而系统性压低得分。
  const avg=baseAvg*.75+followAvg*.25,spread=Math.max(...rows.map(r=>r.signal))-Math.min(...rows.map(r=>r.signal));
  const idx=stage(avg),g=guidance[domain];
  const phase=spread>=2?'表现不一致，建议进一步核实':followRows.length&&followAvg<baseAvg-.6?'自述与追问存在落差':'当前回答相对一致';
  return {domain,name:domains[domain].name,level:stages[idx],phase,confidence:'有限：仅来自本次自述',evidence:rows.slice(0,4).map(x=>`「${escapeEvidence(x.question)}」：${escapeEvidence(x.answer)}`),strength:g.strength[idx],gap:g.gap[idx],index:Math.round((avg-1)/2*100)};
 });
 const ordered=[...dimensions].sort((x,y)=>x.index-y.index||(['mind','body','spirit','vocation'].indexOf(x.domain)-['mind','body','spirit','vocation'].indexOf(y.domain)));
 const weak=ordered[0],strong=ordered[3],wg=guidance[weak.domain],sg=guidance[strong.domain];
 const gap=strong.index-weak.index;
 const archetype=gap<15?'多维同步探索型':strong.domain==='mind'?'思考探索型':strong.domain==='body'?'习惯实践型':strong.domain==='spirit'?'关系意义型':'事业行动型';
 const metatype=gap<15?'四维同步探索者':`${strong.name}优势 · ${weak.name}成长型`;
 const summary=gap<15?`本次回答在四个维度上较为接近，没有明显单一优势维度。建议选择最迫切的现实问题开始实践，而不是同时改变全部领域。`:`本次回答中，你在「${strong.name}」方面表现出较多主动实践或整合的选择；「${weak.name}」的回答则显示出更多可以进一步验证的空间。这是自述选择模式，并非固定人格或真实能力排名。`;
 return {id:crypto.randomUUID(),createdAt:new Date().toISOString(),mode:'rule',metatype,summary,archetype,dimensions,primaryBlock:`建议优先关注${weak.name}：${weak.gap}`,crossImpact:`可尝试把${strong.name}中的有用做法迁移到${weak.name}。例如：${sg.bridge}；同时，${wg.bridge}。这只是可实践的方向，不代表问卷证明了因果关系。`,coreProblem:`如何把「${weak.name}」中的想法变成可重复、可观察的行动？`,actions30:[`第1周：${wg.step}。`,`第2周：${wg.weekly}。`,`第3周：${wg.measure}；记录困难发生的具体情境。`,`第4周：检查过去三周的记录，只保留有效且负担合理的做法。`],actions90:[`第1个月：优先建立${weak.name}的最低可执行行动，不追求一次改变全部习惯。`,`第2个月：尝试将${strong.name}的优势迁移到${weak.name}，记录是否确实有帮助。`,`第3个月：用实际完成记录和他人反馈检验进展，决定继续、调整或停止。`],longTerm:`未来6—12个月，持续观察${weak.name}与${strong.name}之间是否出现积极联动。以真实行为、作品和关系质量作为判断依据，不把任何发展类型当成终身标签。`,limitations:'这是基于简短自述问卷的规则匹配与成长建议，未经心理测量学信效度验证。图表仅代表本次选项编码的相对倾向，不代表智力、心理健康、人格优劣或客观能力等级。'};
}
