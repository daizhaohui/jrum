
export default class AppSerivce{
    constructor(on){
        this.on = on;
    }

    showLoading(){
        this.on("loading",1);
    }
    
    hideLoading(){
        this.on("loading",0);
    }

    notification = {
        success:(args)=>{

        },
        info:(args)=>{

        },
        error:(args)=>{

        },
        warning:(args)=>{

        }
    }



}