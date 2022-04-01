import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
// import { Plugins } from '@capacitor/core';
// const { Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class StorageService {  



  constructor() { }
  
    storeEncrData(storageKey: string, value: any){
      var x:string;
      const y = btoa(escape(JSON.stringify(value)));
      if(storageKey == 'refreshToken'){x='gfA5tka_r'; this.forStoring(x,y)}
      else if(storageKey == 'selectedsite'){x='Xb9^gsY2f'; this.forStoring(x,y)}
      else if(storageKey == 'savedcams'){x='hh#dkbO9'; this.forStoring(x,y)}
      else if(storageKey == 'siteidfromgaurdpage'){x='=Dah4&g*g'; this.forStoring(x,y)}
      else if(storageKey == 'user' && !value.Failed){x='NdxI0F1J'; this.forStoring(x,y);}
      else{x=storageKey; ; this.forStoring(x,y)};
    }
    forStoring(x:string, encryptedValue:string){
      var a =({
        key: x,
        value: encryptedValue
      }); 
      localStorage.setItem(`${x}`, JSON.stringify(a));
    }


    getEncrData(key:string){
      var x:string;
      if(key == 'refreshToken'){x='gfA5tka_r'; return this.forGetting(x)}
      else if(key == 'selectedsite'){x='Xb9^gsY2f'; return this.forGetting(x)}
      else if(key == 'savedcams'){x='hh#dkbO9'; return this.forGetting(x)}
      else if(key == 'siteidfromgaurdpage'){x='=Dah4&g*g'; return this.forGetting(x)}
      else if(key == 'user'){x='NdxI0F1J'; return this.forGetting(x)}
      else{x=key; ; return this.forGetting(x)}
    }
    forGetting(key: any){
      const res = JSON.parse(localStorage.getItem(key)!);
     if(res){
      if(res.value){
        (JSON.parse(unescape(atob(res.value))))
         return JSON.parse(unescape(atob(res.value)));
       }else{
         return false;
       }
     }else{
       return null;
     }
    }



    async deleteStoredEncrData(storageKey: string){
      var x;
      if(storageKey == 'refreshToken'){x='gfA5tka_r'; localStorage.removeItem(x)}
      else if(storageKey == 'selectedsite'){x='Xb9^gsY2f'; localStorage.removeItem(x)}
      else if(storageKey == 'savedcams'){x='hh#dkbO9'; localStorage.removeItem(x)}
      else if(storageKey == 'siteidfromgaurdpage'){x='=Dah4&g*g'; localStorage.removeItem(x)}
      else if(storageKey == 'user'){x='NdxI0F1J'; localStorage.removeItem(x)}
    }

    // ss$ = new BehaviorSubject<any>('');
    // rt$ = new BehaviorSubject<any>('');
    // sc$ = new BehaviorSubject<any>('');
    // sgp$ = new BehaviorSubject<any>('');

    // getdata(key:any){
    //   if(key == 'savedcams'){this.getEncrData(key).then((res:any) =>{this.sc$.next(res);})}
    //   if(key == 'refreshToken'){this.getEncrData(key).then((res:any) =>{this.rt$.next(res);})}
    //   if(key == 'selectedsite'){this.getEncrData(key).then((res:any) =>{this.ss$.next(res);})}
    //   if(key == 'siteidfromgaurdpage'){this.getEncrData(key).then((res:any) =>{this.sgp$.next(res);})}
    //   if(key == 'user'){this.getEncrData(key).then((res:any) =>{this.sgp$.next(res);})}
    // }
 
}

/*
this.storageService.storeEncrData('key', res); // save response data

var data = this.storageService.getEncrData('storageKey') //get from storagesevice
*/



