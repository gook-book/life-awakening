export type Domain='mind'|'body'|'spirit'|'vocation';
export type Option={id:string;text:string;signal:1|2|3};
export type Question={id:string;domain:Domain;title:string;options:Option[];followup?:boolean;trigger?:string};
const opts=(a:string,b:string,c:string):Option[]=>[{id:'a',text:a,signal:1},{id:'b',text:b,signal:2},{id:'c',text:c,signal:3}];
export const domains:Record<Domain,{name:string;en:string;intro:string}>={mind:{name:'思维认知',en:'MIND',intro:'看待世界与更新观念的方式'},body:{name:'身体状态',en:'BODY',intro:'精力、健康习惯与可持续行动'},spirit:{name:'精神关系',en:'SPIRIT',intro:'关系、归属与意义来源'},vocation:{name:'事业发展',en:'VOCATION',intro:'能力、价值创造与职业选择'}};
export const base:Question[]=[
{id:'m1',domain:'mind',title:'当一个观点与你原本的看法冲突时，你通常会？',options:opts('优先相信熟悉或权威的解释','主动寻找证据证明自己的判断','比较不同证据，必要时修改自己的看法')},
{id:'m2',domain:'mind',title:'你判断一个信息是否可靠，最常依据什么？',options:opts('发布者的身份或多数人的认同','自己查到的资料与逻辑','来源、反例、适用条件和可重复验证')},
{id:'m3',domain:'mind',title:'回想最近一次重要观念改变，更接近哪种情况？',options:opts('很少改变既有观念','经历争论或挫折后改变','主动检验并整合新旧观点')},
{id:'m4',domain:'mind',title:'你学会一个新概念后，通常会？',options:opts('记住解释，暂时没有应用','找机会试一试','持续实践、记录反馈并改进方法')},
{id:'b1',domain:'body',title:'当学习或工作突然变忙，你的作息通常怎样？',options:opts('明显失控，很难恢复','会被打乱，之后努力补回来','有简化版习惯，仍能维持基本节律')},
{id:'b2',domain:'body',title:'你做健康决定最常依据什么？',options:opts('别人推荐什么就跟着做','追求某个指标或短期成果','结合自身感受、证据与长期可持续性')},
{id:'b3',domain:'body',title:'过去一个月，你的运动或日常活动情况更接近？',options:opts('基本没有规律','有计划，但执行时断时续','有适合自己的稳定活动安排')},
{id:'b4',domain:'body',title:'疲惫或压力增大时，你通常如何处理？',options:opts('硬撑或放任状态恶化','临时用技巧调整','识别原因并调整休息、负荷和支持')},
{id:'s1',domain:'spirit',title:'面对与你价值观不同的人，你更常？',options:opts('希望对方接受正确的观点','坚持自己的边界，尽量减少接触','能理解差异并在边界内寻找共同点')},
{id:'s2',domain:'spirit',title:'当你感到迷茫时，意义感主要来自？',options:opts('外部期待或既定角色','寻找个人目标与独立选择','兼顾个人价值、关系和现实贡献')},
{id:'s3',domain:'spirit',title:'与重要的人发生冲突后，你通常会？',options:opts('回避或等待对方让步','表达立场，争取被理解','同时表达需求、倾听并协商修复')},
{id:'s4',domain:'spirit',title:'你现在的社会支持与归属感更接近？',options:opts('很少主动经营关系','有少数联系，但投入不稳定','有持续维护、可相互支持的关系')},
{id:'v1',domain:'vocation',title:'面对职业方向选择，你最常依据什么？',options:opts('家人、学校或环境给出的路径','收入、兴趣和个人成就','自身能力、市场需求、长期价值与约束')},
{id:'v2',domain:'vocation',title:'你最近一次尝试提升收入或能力时，主要做了什么？',options:opts('收集信息，尚未实际尝试','开始尝试，但缺少持续复盘','交付成果，获得反馈并迭代')},
{id:'v3',domain:'vocation',title:'如何判断自己真正掌握了一项技能？',options:opts('看过课程或理解理论','能在熟悉任务中完成','能在新情境独立交付并验证结果')},
{id:'v4',domain:'vocation',title:'如果某个努力方向迟迟没有结果，你通常会？',options:opts('继续按原方法或直接放弃','换一个新方向试试','检查假设、获取反馈，再决定迭代或退出')}
];
export const followups:Question[]=[
{id:'fm1',domain:'mind',followup:true,trigger:'m4',title:'你是否能举出最近30天把一个新知识用于真实问题的例子？',options:opts('想不到具体例子','有尝试，但没有观察结果','有明确行动和可描述的反馈')},
{id:'fm2',domain:'mind',followup:true,trigger:'m1',title:'有人指出你的判断错误时，你更可能？',options:opts('本能防御或忽略','会思考，但倾向坚持','主动核查反证并调整判断')},
{id:'fb1',domain:'body',followup:true,trigger:'b1',title:'连续忙碌两周后，你的身体习惯通常？',options:opts('完全中断','只保留部分习惯','会主动降级但不完全中断')},
{id:'fb2',domain:'body',followup:true,trigger:'b3',title:'过去四周，健康行动有多少来自实际执行？',options:opts('主要在计划或搜集信息','执行了一部分','执行稳定且做过调整')},
{id:'fs1',domain:'spirit',followup:true,trigger:'s3',title:'最近一次关系分歧，你采取了什么方式？',options:opts('回避或争执，没有修复','表达了想法，但结果一般','有具体沟通与后续修复')},
{id:'fs2',domain:'spirit',followup:true,trigger:'s4',title:'遇到困难时，你是否有可以主动求助的人？',options:opts('几乎没有','有，但很少主动联系','有并且保持双向支持')},
{id:'fv1',domain:'vocation',followup:true,trigger:'v2',title:'最近一次实际产出，你得到过什么外部反馈？',options:opts('没有具体产出','有产出，尚未获得反馈','有用户、客户或真实使用反馈')},
{id:'fv2',domain:'vocation',followup:true,trigger:'v3',title:'脱离教程和AI，你能独立完成类似任务吗？',options:opts('暂时不能','能完成部分','能独立完成并检查质量')}
];
export type Answers=Record<string,string>;
export function selectedFollowups(a:Answers){return followups.filter(q=>{const parent=base.find(x=>x.id===q.trigger)!;const chosen=parent.options.find(o=>o.id===a[parent.id]);return chosen?.signal!==3;}).slice(0,8)}
export function validate(a:Answers){return base.every(q=>q.options.some(o=>o.id===a[q.id]))&&selectedFollowups(a).every(q=>q.options.some(o=>o.id===a[q.id]))&&Object.entries(a).every(([id,value])=>{const q=[...base,...followups].find(x=>x.id===id);return !!q&&q.options.some(o=>o.id===value)})}
