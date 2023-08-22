import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { generateReactHelpers } from "@uploadthing/react/hooks";
import type { OurFileRouter } from "@/lib/utils/uploadthing";
import {differenceInSeconds, differenceInMinutes,differenceInHours, differenceInDays, differenceInYears} from 'date-fns'
 
export const { useUploadThing, uploadFiles } =
  generateReactHelpers<OurFileRouter>();

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function formatFromNow (date: Date | string) {
  const now  = new Date();
  const from = typeof date === 'string' ?  new Date(date) : date;
  let diff = differenceInSeconds(now,from);
  if(diff === 0){
    return 'now'
  }
  if(diff >= 1 && diff <= 59){
      return `${diff}s`
  }
  diff = differenceInMinutes(now,from);
  if(diff >= 1 && diff <= 59){
    return `${diff}m`
}
diff = differenceInHours(now,from)
if(diff >= 1 && diff <= 23){
  return `${diff}h`
}
diff = differenceInDays(now, from);
if(diff >= 1 && diff <= 364){
  return `${diff}d`
}
return `${differenceInYears(now,from)}y`
}
function _suffixAdd (number:number,suffix:string){
  let strNum = number.toFixed(1).split('.');
  return `${strNum[1].startsWith('0') ? strNum[0] : strNum.join('')}${suffix}`
}
export function formatNumber  (number:number){
  // i don't expect to have a billion user's i am not twitter bro.
  if(typeof number !== 'number') return '';
  if (number >= 1000000){
      let newNumber = number / 1000000;
      return _suffixAdd(newNumber, 'M')
  }
  if(number >= 1000){
      let newNumber = number / 1000;
      return _suffixAdd(newNumber,'K')
  }
  return `${number}`;
}
