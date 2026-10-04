import type {Package} from "@/hooks/usePackage";
export interface ServiceGroup {baseTitle:string;description:string;type:"service"|"promotion";pictureUrl:string;variants:{id:string;duration:number;price:number;rawTitle:string}[];}
export function buildBookingGroups(packages:Package[],templates:ServiceGroup[]=[]):ServiceGroup[]{
 const groups=new Map<string,ServiceGroup>();
 for(const item of packages){
  if(!item.isActive || !Number.isFinite(Number(item.price)) || Number(item.price)<0)continue;
  const baseTitle=item.title.replace(/\s*\(\d+\s*mins?\)\s*$/i,"").trim();
  const type=item.type === "promotion" ? "promotion" : "service";
  const key=type+":"+baseTitle;
  if(!groups.has(key)){
   const template=templates.find(group=>group.baseTitle.replace(/^\d+\.\d+\s*/,"").trim().toLowerCase()===baseTitle.toLowerCase());
   groups.set(key,{baseTitle,description:item.description || "",type,pictureUrl:item.pictureUrl || template?.pictureUrl || "/aromapics.png",variants:[]});
  }
  groups.get(key)!.variants.push({id:item.id,duration:Number(item.duration),price:Number(item.price),rawTitle:item.title});
 }
 return [...groups.values()].map(group=>({...group,variants:group.variants.sort((a,b)=>a.duration-b.duration)}));
}
export function bangkokBookingDate(date:string,time:string):string {
 const value=new Date(date+"T"+time+":00+07:00");
 if(!Number.isFinite(value.getTime()) || value.getTime()<=Date.now())throw new Error("Please select a future appointment time (Thailand time).");
 return value.toISOString();
}
