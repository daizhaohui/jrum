$(function(){

    var  sidebar_icon               = $('#sidebar-icon'),
        currentSelectedMenuItem    = null,
        sidem                      = $("#sidebar-middle"),mainFrame = $("#mainFrame"),
        sidebar                    = $('#sidebar-left'),
        subMenuTitle               = $('#subMenuTitle'),
        tabs                       = $(".nav-tabs li"),
        subSubMenuTitle            = $('#subSubMenuTitle');

    setInterval(function() {
        var dt = new Date(Date.now()),
            dtString = dt.getFullYear() + "-" + getDateString((dt.getMonth()+1))+"-" + getDateString(dt.getDate()) + " " + getDateString(dt.getHours()) + ":" + getDateString(dt.getMinutes()) + ":" + getDateString(dt.getSeconds());

        $("#vf-time").html(dtString);
    }, 1000);


    function getDateString(value) {
        if (value<10) {
            return '0' + value;
        }
        return '' + value;
    }

    function showToolTip(isShow) {
        if(isShow) {
            $('.data-tipso').tipso({
                position: 'right',
                background: 'rgba(0,0,0,0.8)',
                useTitle: false
            });
        } else {
            $('.data-tipso').tipso('destroy');
        }
    }

    $(window).resize(function(){
        var w = $(window).width();
        if (w < 1600) {
            sidebar.removeClass('viewFramework-sidebar-full');
            sidebar.addClass('viewFramework-sidebar-mini');
            showTimeBar(false);
            showToolTip(true);
        }else{
            sidebar.addClass('viewFramework-sidebar-full');
            sidebar.removeClass('viewFramework-sidebar-mini');
            showTimeBar(true);
            showToolTip(false);
        }
    }).trigger('resize');

    $('#sidebar-icon').on('click', function(event) {
        if (sidebar.hasClass('viewFramework-sidebar-full')) {
            sidebar.removeClass('viewFramework-sidebar-full');
            showTimeBar(false);
            showToolTip(true);
        }else{
            sidebar.addClass('viewFramework-sidebar-full');
            showTimeBar(true);
            showToolTip(false);
        }
        sidebar.toggleClass('viewFramework-sidebar-mini');

        if(sidebar_icon.hasClass('icon-unfold')) {
            sidebar_icon.removeClass('icon-unfold')
            sidebar_icon.addClass('icon-fold')
        } else {
            sidebar_icon.removeClass('icon-fold')
            sidebar_icon.addClass('icon-unfold')
        }
    });

    $('#icon-left').on('click', function(event) {
        $('#sidebar-middle').toggleClass("viewFramework-product-col-1");
    });

    function showTimeBar(isShow) {
        if(isShow) {
            $('#vf-time').removeClass('hidden').addClass('vf-time');
        } else {
            $('#vf-time').removeClass('vf-time').addClass('hidden');
        }
    }

    function showSubMenuTitle(menu,url) {
        var title = menu.find('.nav-title').text();
        subSubMenuTitle.text(title);
    }

    function hiddenNavbar (src) {
        sidem.children('.menu-scope').addClass('hidden');
        sidem.removeClass('viewFramework-product-col-1');
    }

    function showNavbar (src) {
        sidem.children('.menu-scope').removeClass('hidden');
        sidem.addClass('viewFramework-product-col-1');
    }

    $('.checkChild').on('click', function(event) {
        var $this   = $(this),
            icon    = $this.find('.nav-icon span');

        if(icon.hasClass('icon-arrow-right')) {
            icon.removeClass('icon-arrow-right')
            icon.addClass('icon-arrow-down')
        } else {
            icon.removeClass('icon-arrow-down')
            icon.addClass('icon-arrow-right')
        }
        $('.ishidden').toggleClass('hidden');
    });

    //一级菜单点击
    $('.sidebar-title').on('click', function(event) {
        var $this   = $(this),
            $parent = $($this.parent()),
            icon    =  $($this.find('.sidebar-title-icon')[0]),
            menuInfo;

        if(icon.hasClass('icon-arrow-down')) {
            icon.removeClass('icon-arrow-down');
            icon.addClass('icon-arrow-right')
            $parent.find('ul').hide();
        } else {
            icon.removeClass('icon-arrow-right');
            icon.addClass('icon-arrow-down')
            $parent.find('ul').show();
        }
        menuInfo = {
            id:$this.attr('data-id'),
            url:"",
            level:1
        };
        _el.trigger("leftMenuClicked",this,menuInfo);
    });


    //二级菜单点击
    $("#sidebar").on('click', 'li.nav-item', function(event) {
        var $this       = $(this),
            $thisa      = $this.children('a'),
            submenu     = $thisa.attr("data-submenu"),
            menuInfo;

        event.preventDefault();
        $("#sidebar").find('li.nav-item').removeClass('active');
        $this.find('.menu-isolate-scope').addClass('active');
        $thisa.addClass('menuItemClicked');
        if(currentSelectedMenuItem!==null) {
            currentSelectedMenuItem.removeClass('menuItemClicked');
        }
        currentSelectedMenuItem = $thisa;

        if(submenu){

            var subm    = $("#product-nav-list .submenu-"+submenu),
                submLi  = subm.children('li'),
                menu,
                url,
                $parentParent,
                title;


            $('#icon-left').removeClass('hidden');
            $('#sidebar-middle').addClass("viewFramework-product-col-1");

            if(submLi.length > 0){
                submLi.find('.menu-isolate-scope').removeClass('active')
                menu = submLi.eq(0).find('.menu-isolate-scope').addClass('active').find('a'),
                    url = menu.attr("data-url");
                subm.removeClass('hidden').siblings('ul').addClass('hidden');
                showNavbar(url);
                //显示title
                $parentParent = $this.parent().parent();
                title = $parentParent.find('.sidebar-title-text').html();
                title = title + ":&nbsp;" + $this.find('.nav-title').html();
                $(subMenuTitle).html(title);
                showSubMenuTitle(menu,url);
            }else{
                hiddenNavbar($thisa.attr("href"));
            }
        }else{
            hiddenNavbar($thisa.attr("href"));
        }

        menuInfo = {
            id:$this.attr('data-id'),
            url:$this.attr('data-url'),
            level:2
        };
        _el.trigger("leftMenuClicked",this,menuInfo);
    });


    //三四级菜单点击
    $("#product-nav-list").on('click', 'a', function(event) {
        var $this   = $(this),
            url     = $this.attr("data-url"),
            menuInfo = {
                id:$this.attr('data-id'),
                url:url,
                level:3
            };

        if ($this.hasClass('nav-showchild')===false){
            $("#product-nav-list .menu-isolate-scope").removeClass('active');
            $this.parents(".menu-isolate-scope").addClass('active');
            menuInfo.level = 4;
        }
        showSubMenuTitle($this,url);
        _el.trigger("leftMenuClicked",this,menuInfo);
    });


    $('.topbar-item .dropdown').on('click', function(event) {
        var $this = $(this),
            $parent = $this.parent(),
            menuClass = $parent.parent().hasClass("topbar-right") ? ".dropdown-menu-right" : ".dropdown-menu",
            $itemBtn = $this.find('.topbar-item-btn'),
            $menuPannel = $this.parent().find(menuClass);

        if($parent.width()>$menuPannel.width()) {
            $menuPannel.css("width",$parent.width()+"px");
        }

        $this.toggleClass('open');
        if ($this.hasClass('open')) {
            $menuPannel.show();
        } else {
            $menuPannel.hide();
        }

    });

    $('.topbar-item').on('click',function(event) {
        var $this = $(this);
        event.stopPropagation();
        _el.trigger("topMenuClicked",this,$this.attr('data-id'));

    });

    $('.topbar-item .topbar-info-btn').on('click',function(event) {
        var $this = $(this);
        event.stopPropagation();
        _el.trigger("topMenuClicked",this,$this.attr('data-id'));

    });

    $('.topbar-item .topbar-menuItem').on('click',function(event) {
        var $this = $(this);
        event.stopPropagation();
        _el.trigger("topMenuClicked",this,$this.attr('data-id'));

    });




    $('.topbar-item').on('mouseover',function(event) {
        var $this = $(this),
            $parent = $this.parent(),
            pannelClass = $parent.hasClass('topbar-right') ? '.topbar-item-panel-right' : '.topbar-item-panel',
            $itemPanel = $this.find(pannelClass);

        if($this.width()>$itemPanel.width()) {
            $itemPanel.css("width",$this.width()+"px");
        }

        $itemPanel.show();
    });

    $('.topbar-item').on('mouseout',function(event) {
        var $this = $(this),
            $parent = $this.parent(),
            pannelClass = $parent.hasClass('topbar-right') ? '.topbar-item-panel-right' : '.topbar-item-panel',
            $itemPanel = $this.find(pannelClass);

        $itemPanel.hide();
    });

    document.oncontextmenu=function(){ return false };

});

/*--pubsub---*/

var _el = (function($) {

    var eventList       = {},
        eventListener   = {
            addListener:function(eventName,fn) {
                if(arguments && arguments.length>=2 && typeof fn ==='function') {
                    if(!eventList[eventName]) {
                        eventList[eventName] = [];
                    }
                    eventList[eventName].push(fn);
                }
            },
            removeListener:function(eventName,fn) {
                var i,
                    len,
                    list  = eventList[eventName];

                if(eventName && fn) {
                    len = list.length;
                    for(i=0;i<len;i++) {
                        if( list[i] === fn ) {
                            list.splice(i,1);
                            break;
                        }
                    }
                } else if(eventName) {
                    eventList[eventName] = [];
                }
            },
            trigger:function() {
                var i,
                    len,
                    eventName = arguments[0],
                    list = eventList[eventName];
                if(eventName && list) {
                    len = list.length;
                    for(i=0;i<len;i++) {
                        list[i].apply($(document),Array.prototype.slice.call(arguments,1));
                    }
                }
            }
        };
    return eventListener;
})(jQuery);

/*--pubsub---*/
/*--- 控制台插件 ---*/
(function($, window, document, undefined){
    var   pluginName      = "controlBoard",
        defaults        = {},
        controlBoard    = null,
        MenuType        = {
            normal      : 'normal',
            info        : 'info',
            dropdown    : 'dropdown',
            none        : 'none'
        },
        $topMenuRight = $('#topMenu-right'),
        $topMenuLeft = $('#topMenu-left');

    function _replaceHtml(html,data) {
        var name,
            replacedHtml = html;

        for(name in data) {
            replacedHtml = replacedHtml.replace(new RegExp("\{" + name + "\}", 'g'), data[name]);
        }
        return replacedHtml;
    }

    function _insertOneLevelMenu(menuItem) {
        var i,
            len,
            menuDom,
            insertAfterDom,
            containerDom = $('<div class="sidebar-nav"></div>'),
            template = '<div class="sidebar-title data-tipso" data-tipso="{name}" data-id="{id}">' +
                '<div class="sidebar-title-inner menu-scope">' +
                '<span class="sidebar-title-icon icon-arrow-down"></span>' +
                '<span class="sidebar-title-text">{name}</span>' +
                '<span class="sidebar-manage menu-scope">' +
                '<a class="icon-setup menu-isolate-scope"></a>' +
                '</span>' +
                '</div>' +
                '</div>';

        menuDom = $(_replaceHtml(template,{
            name:menuItem.name,
            id: menuItem.id
        }));
        containerDom.append(menuDom);
        len = menuItem.children ? menuItem.children.length : 0;
        insertAfterDom = menuDom;
        for( i=0;i<len;i++ ) {
            insertAfterDom = _insertTwoLevelMenu(insertAfterDom,menuItem.children[i],i+1);
        }
        return containerDom;
    }

    function _insertTwoLevelMenu(dom,menuItem,index) {
        var i,
            len,
            replacedData,
            menuDom,
            insertAfterDom = dom,
            containerDom,
            defaultIconClass = 'icon-wo-sitebuild',
            template = '<ul class="sidebar-trans" style="height:auto;">' +
                '<li class="nav-item menu-scope data-tipso" data-tipso="{name}" data-id="{id}" data-url="{url}">' +
                '<a href="" class="sidebar-trans menu-scope" data-submenu="{index}">' +
                '<div class="nav-icon sidebar-trans"><span class="{iconClass}"></span></div>' +
                '<span class="nav-title">{name}</span>' +
                '</a>' +
                '</li>' +
                '</ul>';

        len = menuItem.children ? menuItem.children.length : 0;
        replacedData = {
            name        : menuItem.name,
            id          : menuItem.id,
            iconClass   : menuItem.iconClass || defaultIconClass,
            index       : len>0 ? index:"",
            url         : len>0 ? "" : menuItem.url
        }
        menuDom = $(_replaceHtml(template,replacedData));
        menuDom.insertAfter(insertAfterDom);
        containerDom = $(_replaceHtml('<ul class="submenu-{index} hidden" data-submenu="{index}"></div>',{
            index:index
        }));
        $('#product-nav-list').append(containerDom);
        for(i=0;i<len;i++) {
            _insertThreeLevelMenu(containerDom,menuItem.children[i],index);
        }

        return menuDom;
    }

    function _insertThreeLevelMenu(dom,menuItem,index) {
        var i,
            len,
            menuDom,
            replacedData,
            levelFourContainerDom,
            template = '<li>' +
                '<div class="menu-isolate-scope{checkChild}">' +
                '<a href="javascript:;" data-id="{id}" data-url="{url}" class="menu-scope{navShowchild}">' +
                '<div class="nav-icon">{hasChildrenHtml}</div>' +
                '<div class="nav-title">{name}</div>' +
                '</a>' +
                '</div>' +
                '</li>',

            len = menuItem.children ? menuItem.children.length : 0;
        replacedData = {
            checkChild      : len>0 ? " checkChild" : "",
            id              : menuItem.id,
            url             : len>0 ? "":menuItem.url,
            name            : menuItem.name,
            navShowchild    : len>0 ? " nav-Showchild" : "",
            hasChildrenHtml : len>0 ? '<span class="icon-arrow-right"></span>' : ""
        }
        menuDom =$(_replaceHtml(template,replacedData));
        if( len > 0 ) {
            levelFourContainerDom = $('<ul class="menu-scope ishidden hidden"></ul>');
            for(i=0;i<len;i++) {
                _insertFourLevelMenu(levelFourContainerDom,menuItem.children[i]);
            }
            menuDom.append(levelFourContainerDom);
        }
        dom.append(menuDom);

    }

    function _insertFourLevelMenu(dom,menuItem) {
        var menuDom,
            replacedData,
            template = '<li>' +
                '<div class="menu-isolate-scope">' +
                '<a href="javascript:;" data-url="{url}" class="menu-scope" data-id="{id}">' +
                '<div class="nav-icon"></div>' +
                '<div class="nav-title">{name}</div>' +
                '</a>' +
                '</div>' +
                '</li>';

        replacedData = {
            id              : menuItem.id,
            url             : menuItem.url,
            name            : menuItem.name
        };
        menuDom =$(_replaceHtml(template,replacedData));
        dom.append(menuDom);
    }

    function _createLeftMenu(menuItems) {
        var insertAfterDom  = $('#sidebar-icon'),
            menuItem,
            i,
            len = menuItems.length,
            dom;

        for( i=0; i<len; i++ ) {
            menuItem = menuItems[i];
            dom = _insertOneLevelMenu(menuItem);
            dom.insertAfter(insertAfterDom)
            insertAfterDom = dom;
        }
    }

    function _createTopMenu(menuItems) {
        var i,
            menuItem,
            len = menuItems.length;

        for( i=0; i<len; i++) {
            menuItem = menuItems[i];
            _createTopMenuItem(menuItem);
        }
    }

    function _createTopMenuItem(options) {
        var defaults = {
                type          : options.type ? options.type:'normal',
                position      : options.position ? options.position:'right',
                id            : options.id ? options.id:'',
                name          : options.name,
                tag           : options.tag ? options.tag:'',
                url           : options.url ? options.url: '',
                icon          : options.icon ? options.icon: '',
                cols          : options.cols ? options.cols:'1',
                badge         : options.badge ? options.badge:'',
                items         : options.children ? options.children:[],
                contentHTML   : options.contentHTML ? options.contentHTML:'',
            },
            normalTemplate = '<div class="topbar-item topbar-left" data-id="{id}">' +
                '<a class="topbar-item-btn" href="javascript:;" target="_blank">' +
                '<span class="icon-image{iconClass}">{iconUrl}</span>' +
                '<span>{name}</span>' +
                '</a>' +
                '</div>',
            noneTemplate   = '<div class="topbar-item topbar-left" data-id="{id}">' +
                '<a class="topbar-item-btn" href="javascript:;" target="_blank">' +
                '<span class="icon-image{iconClass}">{iconUrl}</span>' +
                '<span>{name}</span>' +
                '</a>' +
                '</div>',
            dropDownTemplate = '<div class="topbar-left topbar-item topbar-info-item" data-id="{id}">' +
                '<div class="dropdown">' +
                '<a href="javascript:;" class="topbar-item-btn">' +
                '<span>{name}</span>' +
                '<span class="icon-arrow-down"></span>' +
                '</a>' +
                '</div>' +
                '</div>',
            infoTemplate  = '<div class="topbar-item topbar-left" data-id="{id}">' +
                '<a class="topbar-item-btn" href="javascript:;" target="_blank">' +
                '<span class="icon-image{iconClass}">{iconUrl}</span>' +
                '<span>{name}</span>' +
                '</a>' +
                '<div class="{contentClass}">{contentHTML}' +
                '</div>' +
                '</div>';

        if (defaults.type === MenuType.dropdown) {
            createDropdownMenu(defaults,dropDownTemplate);
        }
        else if(defaults.type === MenuType.none) {
            createNoneMenu(defaults,noneTemplate);
        }
        else if(defaults.type === MenuType.info) {
            createInfoMenu(defaults,infoTemplate);
        }
        else {
            createNormalMenu(defaults,normalTemplate);
        }

        function createMultiColMenu(items,cols,containerDom) {
            //计算整个高度
            var width = cols * 60 + 20,
                itemHeight = 60,
                itemWidth  = 100.0 / cols,
                i,
                item,
                replacedData,
                menuDom,
                len = items.length,
                itemTemplate = '<div class="topbar-menuItem" style="width:{itemWidth}%;height:{itemHeight}px;" data-id="{id}">' +
                    '<img src="{icon}">' +
                    '<p>{name}</p>'+
                    '</div>',
                felxDom = $('<div class="topbar-multiColsMenu"></div>');

            felxDom.css("width",width+"px");
            for(i=0;i<len;i++) {
                item = items[i];
                replacedData = {
                    icon        : item.icon,
                    name        : item.name,
                    itemWidth   : itemWidth,
                    itemHeight  : itemHeight,
                    id          : item.id
                };
                menuDom =$(_replaceHtml(itemTemplate,replacedData));
                felxDom.append(menuDom);
            }
            containerDom.append(felxDom);
        }

        function createOneColMenu(items,containerDom) {
            var i,
                len = items.length,
                replacedData,
                item,
                menuDom,
                template =  '<li  class="topbar-info-btn" data-id="{id}">' +
                    '<span class="icon-image{iconClass}">{iconUrl}</span>' +
                    '<span class="info-btn-title">{name}</span>' +
                    '</li>',
                iconRule;

            for(i=0;i<len;i++) {
                item = items[i];
                iconRule = parseIconRule(item.icon);
                replacedData = {
                    iconClass        : iconRule.class,
                    iconUrl          : iconRule.url,
                    name             : item.name,
                    id               : item.id,
                    url              : item.url,
                    tag              : item.tag
                };
                menuDom =$(_replaceHtml(template,replacedData));
                containerDom.append(menuDom);
            }
        }

        function getContainerDom(options) {
            if(options.position) {
                return options.position == "left" ? $topMenuLeft : $topMenuRight;
            } else {
                return $topMenuRight;
            }
        }


        function parseIconRule(icon) {
            var iClass,
                iUrl;

            if(icon) {
                if(icon.indexOf('/')>-1) {
                    iClass = '';
                    iUrl = '<img src="'+ icon + '">'
                } else {
                    iClass = ' ' + icon;
                    iUrl = '';
                }
            } else {
                iClass = ' ';
                iUrl = '';
            }
            return {
                class: iClass,
                url:    iUrl
            }
        }

        function createNormalMenu(options,template) {
            var containerDom = getContainerDom(options),
                replacedData,
                menuDom,
                childMenuContainerDom,
                iconRule = parseIconRule(options.icon),
                itemPanelClass;

            replacedData = {
                iconClass        : iconRule.class,
                iconUrl          : iconRule.url,
                name             : options.name,
                id               : options.id
            };
            menuDom =$(_replaceHtml(template,replacedData));

            itemPanelClass = options.position == "left" ? "topbar-item-panel" : "topbar-item-panel-right";
            //自定义
            if(options.contentHTML) {
                childMenuContainerDom = $('<div class="'+itemPanelClass+'">'+options.contentHTML+'</div>');
            } else {
                if(options.cols == 1) {
                    childMenuContainerDom = $('<ul class="'+itemPanelClass+'"></ul>');
                    createOneColMenu(options.items,childMenuContainerDom);
                } else {
                    childMenuContainerDom = $('<div class="'+itemPanelClass+'"></div>');
                    createMultiColMenu(options.items,options.cols,childMenuContainerDom)
                }
            }
            menuDom.append(childMenuContainerDom);
            containerDom.append(menuDom);

        }

        function createNoneMenu(options,template) {
            var containerDom = getContainerDom(options),
                replacedData,
                menuDom,
                iconRule = parseIconRule(options.icon);

            replacedData = {
                iconClass        : iconRule.class,
                iconUrl          : iconRule.url,
                name             : options.name,
                id               : options.id
            };
            menuDom =$(_replaceHtml(template,replacedData));
            containerDom.append(menuDom);
        }

        function createDropdownMenu(options,template) {
            var containerDom = getContainerDom(options),
                replacedData,
                menuDom,
                childMenuContainerDom,
                menuClass;

            replacedData = {
                name             : options.name,
                id               : options.id
            };
            menuDom =$(_replaceHtml(template,replacedData));

            menuClass = options.position == "left" ? "dropdown-menu" : "dropdown-menu-right";
            //自定义
            if(options.contentHTML) {
                childMenuContainerDom = $('<div class="'+menuClass+'">'+options.contentHTML+'</div>');
            } else {
                if(options.cols == 1) {
                    childMenuContainerDom = $('<ul class="'+menuClass+'"></ul>');
                    createOneColMenu(options.items,childMenuContainerDom);
                } else {
                    childMenuContainerDom = $('<div class="'+menuClass+'"></div>');
                    createMultiColMenu(options.items,options.cols,childMenuContainerDom)
                }
            }
            menuDom.find('.dropdown').append(childMenuContainerDom);
            containerDom.append(menuDom);
        }

        function createInfoMenu(options,template) {
            var containerDom = getContainerDom(options),
                replacedData,
                menuDom,
                iconRule = parseIconRule(options.icon);

            replacedData = {
                iconClass        : iconRule.class,
                iconUrl          : iconRule.url,
                name             : options.name,
                contentHTML      : options.contentHTML,
                id               : options.id,
                contentClass     : options.position == "left" ? "topbar-item-panel" : "topbar-item-panel-right"
            };
            menuDom =$(_replaceHtml(template,replacedData));
            containerDom.append(menuDom);
        }
    }

    function _leftMenuClicked(callback) {
        _el.addListener("leftMenuClicked",callback);
    }

    function _topMenuClicked(callback) {
        _el.addListener("topMenuClicked",callback);
    }

    $.extend(Plugin.prototype,{
        createLeftMenu:function(menuItems) {
            _createLeftMenu(menuItems);
            return this;
        },
        createTopMenu:function(menuItems) {
            _createTopMenu(menuItems);
            return this;
        },
        leftMenuClicked:function(callback) {
            _leftMenuClicked(callback);
            return this;
        },
        topMenuClicked:function(callback) {
            _topMenuClicked(callback);
            return this;
        },
        findTopMenuDom:function(id) {
            var dom = null,
                selector;
            if(id) {
                selector = ".topbar-item[data-id='"+id+"'],.topbar-item [data-id='"+id+"']";
                dom = $(selector);
                dom = dom.length ? dom[0] : dom;
            }
            return dom;
        }
    });

    function Plugin() {

    }

    $[pluginName] = $.fn[pluginName] = function(options) {
        if(controlBoard===null) {
            controlBoard = new Plugin();
        }
        if(options){
            $.extend(defaults,options);
        }
        return controlBoard;
    };

    $[pluginName].listen = $.fn[pluginName].listen = function(eventName,fn) {
        _el.addListener(eventName,fn);
    };

    $[pluginName].trigger = $.fn[pluginName].trigger = function() {
        _el.trigger.apply(_el,arguments);
    };

    $[pluginName].off = $.fn[pluginName].off = function(eventName,fn) {
        _el.removeListener(eventName,fn);
    };

})(jQuery, window, document);
/*---  控制台插件  ---*/

/*--tooltip js --*/
(function($, window, document, undefined) {
    var pluginName = "tipso",
        defaults = {
            speed           : 400,
            background      : '#55b555',
            color           : '#ffffff',
            position        : 'top',
            width           : 100,
            delay           : 200,
            animationIn     : '',
            animationOut    : '',
            offsetX         : 0,
            offsetY         : 0,
            content         : null,
            ajaxContentUrl  : null,
            useTitle        : true,
            onBeforeShow    : null,
            onShow          : null,
            onHide          : null
        };

    function Plugin(element, options) {
        this.element = $(element);
        this.settings = $.extend({}, defaults, options);
        this._title = this.element.attr('title');
        this.mode = 'hide';
        this.ieFade = false;
        if ( !supportsTransitions ) {
            this.ieFade = true;
        }
        this.init();
    }
    $.extend(Plugin.prototype, {
        init: function() {
            var obj = this,
                $e = this.element;
            $e.addClass('tipso_style').removeAttr('title');
            if (isTouchSupported()) {
                $e.on('click' + '.' + pluginName, function(e) {
                    obj.mode == 'hide' ? obj.show() : obj.hide();
                    e.stopPropagation();
                });
                $(document).on('click', function() {
                    if (obj.mode == 'show') {
                        obj.hide();
                    }
                });
            } else {
                $e.on('mouseover' + '.' + pluginName, function() {
                    obj.show();
                });
                $e.on('mouseout' + '.' + pluginName, function() {
                    obj.hide();
                });
            }
        },
        tooltip: function() {
            if (!this.tipso_bubble) {
                this.tipso_bubble = $(
                    '<div class="tipso_bubble"><div class="tipso_content"></div><div class="tipso_arrow"></div></div>'
                );
            }
            return this.tipso_bubble;
        },
        show: function() {
            var tipso_bubble = this.tooltip(),
                obj = this,
                $win = $(window);
            if ($.isFunction(obj.settings.onBeforeShow)) {
                obj.settings.onBeforeShow($(this));
            }
            tipso_bubble.css({
                background: obj.settings.background,
                color: obj.settings.color,
                width: obj.settings.width
            }).hide();
            tipso_bubble.find('.tipso_content').html(obj.content());
            reposition(obj);
            $win.resize(function() {
                reposition(obj);
            });
            obj.timeout = window.setTimeout(function() {
                if (obj.ieFade || obj.settings.animationIn === '' || obj.settings.animationOut === ''){
                    tipso_bubble.appendTo('body').stop(true, true).fadeIn(obj.settings
                        .speed, function() {
                        obj.mode = 'show';
                        if ($.isFunction(obj.settings.onShow)) {
                            obj.settings.onShow($(this));
                        }
                    });
                } else {
                    tipso_bubble.remove().appendTo('body')
                        .stop(true, true)
                        .removeClass('animated ' + obj.settings.animationOut)
                        .addClass('noAnimation')
                        .removeClass('noAnimation')
                        .addClass('animated ' + obj.settings.animationIn).fadeIn(obj.settings.speed, function() {
                        $(this).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
                            $(this).removeClass('animated ' + obj.settings.animationIn);
                        });
                        obj.mode = 'show';
                        if ($.isFunction(obj.settings.onShow)) {
                            obj.settings.onShow($(this));
                        }
                    });
                }
            }, obj.settings.delay);
        },
        hide: function() {
            var obj = this,
                tipso_bubble = this.tooltip();
            window.clearTimeout(obj.timeout);
            obj.timeout = null;
            if (obj.ieFade || obj.settings.animationIn === '' || obj.settings.animationOut === ''){
                tipso_bubble.stop(true, true).fadeOut(obj.settings.speed,
                    function() {
                        $(this).remove();
                        if ($.isFunction(obj.settings.onHide) && obj.mode == 'show') {
                            obj.settings.onHide($(this));
                        }
                        obj.mode = 'hide';
                    });
            } else {
                tipso_bubble.stop(true, true)
                    .removeClass('animated ' + obj.settings.animationIn)
                    .addClass('noAnimation').removeClass('noAnimation')
                    .addClass('animated ' + obj.settings.animationOut)
                    .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
                        $(this).removeClass('animated ' + obj.settings.animationOut).remove();
                        if ($.isFunction(obj.settings.onHide) && obj.mode == 'show') {
                            obj.settings.onHide($(this));
                        }
                        obj.mode = 'hide';
                    });
            }
        },
        destroy: function() {
            var $e = this.element;
            $e.off('.' + pluginName);
            $e.removeData(pluginName);
            $e.removeClass('tipso_style').attr('title', this._title);
        },
        content: function() {
            var content,
                $e = this.element,
                obj = this,
                title = this._title;
            if (obj.settings.ajaxContentUrl) {
                content = $.ajax({
                    type: "GET",
                    url: obj.settings.ajaxContentUrl,
                    async: false
                }).responseText;
            } else if (obj.settings.content) {
                content = obj.settings.content;
            } else {
                if (obj.settings.useTitle === true) {
                    content = title;
                } else {
                    content = $e.data('tipso');
                }
            }
            return content;
        },
        update: function(key, value) {
            var obj = this;
            if (value) {
                obj.settings[key] = value;
            } else {
                return obj.settings[key];
            }
        }
    });

    function isTouchSupported() {
        var msTouchEnabled = window.navigator.msMaxTouchPoints;
        var generalTouchEnabled = "ontouchstart" in document.createElement(
            "div");
        if (msTouchEnabled || generalTouchEnabled) {
            return true;
        }
        return false;
    }

    function realHeight(obj) {
        var clone = obj.clone();
        clone.css("visibility", "hidden");
        $('body').append(clone);
        var height = clone.outerHeight();
        clone.remove();
        return height;
    }

    var supportsTransitions = (function() {
        var s = document.createElement('p').style,
            v = ['ms','O','Moz','Webkit'];
        if( s['transition'] == '' ) return true;
        while( v.length )
            if( v.pop() + 'Transition' in s )
                return true;
        return false;
    })();

    function reposition(thisthat) {
        var tipso_bubble = thisthat.tooltip(),
            $e = thisthat.element,
            obj = thisthat,
            $win = $(window),
            arrow = 10,
            pos_top, pos_left, diff;

        if ( $e.parent().outerWidth() > $win.outerWidth() ){
            $win = $e.parent();
        }
        switch (obj.settings.position) {
            case 'top':
                pos_left = $e.offset().left + ($e.outerWidth() / 2) - (tipso_bubble
                    .outerWidth() / 2);
                pos_top = $e.offset().top - realHeight(tipso_bubble) - arrow;
                tipso_bubble.find('.tipso_arrow').css({
                    marginLeft: -8
                });
                if (pos_top < $win.scrollTop()) {
                    pos_top = $e.offset().top + $e.outerHeight() + arrow;
                    tipso_bubble.find('.tipso_arrow').css({
                        'border-bottom-color': obj.settings.background,
                        'border-top-color': 'transparent'
                    });
                    tipso_bubble.removeClass('top bottom left right');
                    tipso_bubble.addClass('bottom');
                } else {
                    tipso_bubble.find('.tipso_arrow').css({
                        'border-top-color': obj.settings.background,
                        'border-bottom-color': 'transparent'
                    });
                    tipso_bubble.removeClass('top bottom left right');
                    tipso_bubble.addClass('top');
                }
                break;
            case 'bottom':
                pos_left = $e.offset().left + ($e.outerWidth() / 2) - (tipso_bubble
                    .outerWidth() / 2);
                pos_top = $e.offset().top + $e.outerHeight() + arrow;
                tipso_bubble.find('.tipso_arrow').css({
                    marginLeft: -8
                });
                if (pos_top + realHeight(tipso_bubble) > $win.scrollTop() + $win.outerHeight()) {
                    pos_top = $e.offset().top - realHeight(tipso_bubble) - arrow;
                    tipso_bubble.find('.tipso_arrow').css({
                        'border-top-color': obj.settings.background,
                        'border-bottom-color': 'transparent'
                    });
                    tipso_bubble.removeClass('top bottom left right');
                    tipso_bubble.addClass('top');
                } else {
                    tipso_bubble.find('.tipso_arrow').css({
                        'border-bottom-color': obj.settings.background,
                        'border-top-color': 'transparent'
                    });
                    tipso_bubble.removeClass('top bottom left right');
                    tipso_bubble.addClass(obj.settings.position);
                }
                break;
            case 'left':
                pos_left = $e.offset().left - tipso_bubble.outerWidth() - arrow;
                pos_top = $e.offset().top + ($e.outerHeight() / 2) - (realHeight(
                    tipso_bubble) / 2);
                tipso_bubble.find('.tipso_arrow').css({
                    marginTop: -8,
                    marginLeft: ''
                });
                if (pos_left < $win.scrollLeft()) {
                    pos_left = $e.offset().left + $e.outerWidth() + arrow;
                    tipso_bubble.find('.tipso_arrow').css({
                        'border-right-color': obj.settings.background,
                        'border-left-color': 'transparent',
                        'border-top-color': 'transparent',
                        'border-bottom-color': 'transparent'
                    });
                    tipso_bubble.removeClass('top bottom left right');
                    tipso_bubble.addClass('right');
                } else {
                    tipso_bubble.find('.tipso_arrow').css({
                        'border-left-color': obj.settings.background,
                        'border-right-color': 'transparent',
                        'border-top-color': 'transparent',
                        'border-bottom-color': 'transparent'
                    });
                    tipso_bubble.removeClass('top bottom left right');
                    tipso_bubble.addClass(obj.settings.position);
                }
                break;
            case 'right':
                pos_left = $e.offset().left + $e.outerWidth() + arrow;
                pos_top = $e.offset().top + ($e.outerHeight() / 2) - (realHeight(
                    tipso_bubble) / 2);
                tipso_bubble.find('.tipso_arrow').css({
                    marginTop: -8,
                    marginLeft: ''
                });
                if (pos_left + arrow + obj.settings.width > $win.scrollLeft() +
                    $win.outerWidth()) {
                    pos_left = $e.offset().left - tipso_bubble.outerWidth() - arrow;
                    tipso_bubble.find('.tipso_arrow').css({
                        'border-left-color': obj.settings.background,
                        'border-right-color': 'transparent',
                        'border-top-color': 'transparent',
                        'border-bottom-color': 'transparent'
                    });
                    tipso_bubble.removeClass('top bottom left right');
                    tipso_bubble.addClass('left');
                } else {
                    tipso_bubble.find('.tipso_arrow').css({
                        'border-right-color': obj.settings.background,
                        'border-left-color': 'transparent',
                        'border-top-color': 'transparent',
                        'border-bottom-color': 'transparent'
                    });
                    tipso_bubble.removeClass('top bottom left right');
                    tipso_bubble.addClass(obj.settings.position);
                }
                break;
        }
        if (pos_left < $win.scrollLeft() && (obj.settings.position == 'bottom' ||
                obj.settings.position == 'top')) {
            tipso_bubble.find('.tipso_arrow').css({
                marginLeft: pos_left - 8
            });
            pos_left = 0;
        }
        if (pos_left + obj.settings.width > $win.outerWidth() && (obj.settings.position ==
                'bottom' || obj.settings.position == 'top')) {
            diff = $win.outerWidth() - (pos_left + obj.settings.width);
            tipso_bubble.find('.tipso_arrow').css({
                marginLeft: -diff - 8,
                marginTop: ''
            });
            pos_left = pos_left + diff;
        }
        if (pos_left < $win.scrollLeft() && (obj.settings.position == 'left' ||
                obj.settings.position == 'right')) {
            pos_left = $e.offset().left + ($e.outerWidth() / 2) - (tipso_bubble.outerWidth() /
                2);
            tipso_bubble.find('.tipso_arrow').css({
                marginLeft: -8,
                marginTop: ''
            });
            pos_top = $e.offset().top - realHeight(tipso_bubble) - arrow;
            if (pos_top < $win.scrollTop()) {
                pos_top = $e.offset().top + $e.outerHeight() + arrow;
                tipso_bubble.find('.tipso_arrow').css({
                    'border-bottom-color': obj.settings.background,
                    'border-top-color': 'transparent',
                    'border-left-color': 'transparent',
                    'border-right-color': 'transparent'
                });
                tipso_bubble.removeClass('top bottom left right');
                tipso_bubble.addClass('bottom');
            } else {
                tipso_bubble.find('.tipso_arrow').css({
                    'border-top-color': obj.settings.background,
                    'border-bottom-color': 'transparent',
                    'border-left-color': 'transparent',
                    'border-right-color': 'transparent'
                });
                tipso_bubble.removeClass('top bottom left right');
                tipso_bubble.addClass('top');
            }
            if (pos_left + obj.settings.width > $win.outerWidth()) {
                diff = $win.outerWidth() - (pos_left + obj.settings.width);
                tipso_bubble.find('.tipso_arrow').css({
                    marginLeft: -diff - 8,
                    marginTop: ''
                });
                pos_left = pos_left + diff;
            }
            if (pos_left < $win.scrollLeft()) {
                tipso_bubble.find('.tipso_arrow').css({
                    marginLeft: pos_left - 8
                });
                pos_left = 0;
            }
        }
        if (pos_left + obj.settings.width > $win.outerWidth() && (obj.settings.position ==
                'left' || obj.settings.position == 'right')) {
            pos_left = $e.offset().left + ($e.outerWidth() / 2) - (tipso_bubble.outerWidth() /
                2);
            tipso_bubble.find('.tipso_arrow').css({
                marginLeft: -8,
                marginTop: ''
            });
            pos_top = $e.offset().top - realHeight(tipso_bubble) - arrow;
            if (pos_top < $win.scrollTop()) {
                pos_top = $e.offset().top + $e.outerHeight() + arrow;
                tipso_bubble.find('.tipso_arrow').css({
                    'border-bottom-color': obj.settings.background,
                    'border-top-color': 'transparent',
                    'border-left-color': 'transparent',
                    'border-right-color': 'transparent'
                });
                tipso_bubble.removeClass('top bottom left right');
                tipso_bubble.addClass('bottom');
            } else {
                tipso_bubble.find('.tipso_arrow').css({
                    'border-top-color': obj.settings.background,
                    'border-bottom-color': 'transparent',
                    'border-left-color': 'transparent',
                    'border-right-color': 'transparent'
                });
                tipso_bubble.removeClass('top bottom left right');
                tipso_bubble.addClass('top');
            }
            if (pos_left + obj.settings.width > $win.outerWidth()) {
                diff = $win.outerWidth() - (pos_left + obj.settings.width);
                tipso_bubble.find('.tipso_arrow').css({
                    marginLeft: -diff - 8,
                    marginTop: ''
                });
                pos_left = pos_left + diff;
            }
            if (pos_left < $win.scrollLeft()) {
                tipso_bubble.find('.tipso_arrow').css({
                    marginLeft: pos_left - 8
                });
                pos_left = 0;
            }
        }
        tipso_bubble.css({
            left: pos_left + obj.settings.offsetX,
            top: pos_top + obj.settings.offsetY
        });
    }
    $[pluginName] = $.fn[pluginName] = function(options) {
        var args = arguments;
        if (options === undefined || typeof options === 'object') {
            if (!(this instanceof $)) {
                $.extend(defaults, options);
            }
            return this.each(function() {
                if (!$.data(this, 'plugin_' + pluginName)) {
                    $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
                }
            });
        } else if (typeof options === 'string' && options[0] !== '_' && options !==
            'init') {
            var returns;
            this.each(function() {
                var instance = $.data(this, 'plugin_' + pluginName);
                if (!instance) {
                    instance = $.data(this, 'plugin_' + pluginName, new Plugin(
                        this, options));
                }
                if (instance instanceof Plugin && typeof instance[options] ===
                    'function') {
                    returns = instance[options].apply(instance, Array.prototype.slice
                        .call(args, 1));
                }
                if (options === 'destroy') {
                    $.data(this, 'plugin_' + pluginName, null);
                }
            });
            return returns !== undefined ? returns : this;
        }
    };
})(jQuery, window, document);

/*--tooltip js --*/