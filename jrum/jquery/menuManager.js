class TopLeftMenu{
    constructor(menuItems){
        this.menuItems = menuItems;
    }

    createMenu() {
        $.controlBoard().createLeftMenu(this.menuItems);
    }
}

class LeftMenu{

    constructor(menuItems){
        this.menuItems = menuItems;
    }

    createMenu() {
        $.controlBoard().createLeftMenu(this.menuItems);
    }
}


export default  class  MenuManager{

    static  createMenu(appConfig,menuItems) {
        var instance;
        if(appConfig.AppInfo.menuLayout && appConfig.AppInfo.menuLayout==='left') {
            instance = new LeftMenu(menuItems);
        } else {
            instance = new TopLeftMenu(menuItems);
        }
        instance.createMenu();
    }
}