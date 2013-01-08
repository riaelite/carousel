/**
 * @description 基于 jQuery 的按需加载轮播图插件
 * @param data {Array} 轮播图的数据 [{url: '', img: '', text: ''}]
          auto {boolean} 是否自动轮播
          interval {number} 轮播间隔时间（毫秒）
          speed {number} 轮播切换速度（毫秒）
          width: {number} 轮播图宽度
          height: {number} 轮播图高度
          loadingImg: {String} 加载中图片地址
          showType: {String} 显示轮播图方式 fade / horizontal / vertical
          triggerType: {String} 触发轮播方式 click / mouseover
 * @author i@wange.im
 * @url http://wange.im/
 * @version 0.1.2
**/

;(function ($) {
    // MVC - Model
    function CarouselModel(options) {
        var _this = this,
            defOpts = $.fn.carousel.defaults,
            allowSwitch = true,    // 允许切换
            curIndex = 0;           // 当前索引值
            
        // 继承参数
        _this.settings = $.extend({}, defOpts, options);
        
        _this.getCurIndex = function() {
            return curIndex;
        };
        _this.setCurIndex = function(index) {
            curIndex = index;
        };
        _this.getAllowSwitch = function() {
            return allowSwitch;
        };
        _this.setAllowSwitch = function(val) {
            allowSwitch = val;
        };
    }
    
    CarouselModel.prototype = {
        getHasItem: function(liDom) {
            return liDom.data('has_item');
        },
        setHasItem: function(liDom) {
            liDom.data('has_item', true);
        }
    };
    
    // MVC - View
    function CarouselView(model, element) {
        var _this = this,
            target = $(element);
        
        _this._model = model;
        _this._element = element;
        
        _this.domHandle = new Event(_this);
        _this.domBuilt = new Event(_this);
        _this.itemBuilt = new Event(_this);
        _this.triClicked = new Event(_this);
        _this.targetOver = new Event(_this);
        _this.targetLeave = new Event(_this);
        
        target.delegate('.carousel_tri li', model.settings.triggerType, function() {
            var index = $(this).index();
            _this.triClicked.notify({index: index});
        });
        target.hover(
            function() {
                _this.targetOver.notify();
            },
            function() {
                _this.targetLeave.notify();
            }
        );
    }
    
    CarouselView.prototype = {
        // 初始化
        init: function() {
            this.initCss().domHandle.notify();
            
            // this.buildDom(this._model.settings.data);
        },
        // 初始化样式
        initCss: function() {
            // 所有实例共用一个样式，如果已加载过，则返回
            if (!!$('head').data('css_loaded')) return this;
            
            var _this = this,
                settings = _this._model.settings,
                width = parseInt(settings.width, 10),
                height = parseInt(settings.height, 10),
                target = $(_this._element),
                publicStyle = '.carousel{position:relative;overflow:hidden;border-radius:5px;}' +
                              '.carousel_panel{position:absolute;z-index:1;width:100%;height:100%;}' +
                              '.carousel_panel ul{width:100%;height:100%;padding:0;margin:0;list-style:none;}' +
                              '.carousel_panel li{width:100%;height:100%;overflow:hidden;vertical-align:bottom;}' +
                              '.carousel_panel a{display:block;width:100%;height:100%;}' +
                              '.carousel_panel img{width:100%;height:100%;display:block;border:0 none;border-radius:5px;}' +
                              '.carousel_tri{position:absolute;height:46px;bottom:0;left:0;background:#000;opacity:0.8;filter:alpha(opacity=80);width:100%;border-radius:0 0 5px 5px;z-index:2;}' +
                              '.carousel_tri ul{height:22px;position:absolute;right:8px;top:12px;padding:0;margin:0;list-style:none;}' +
                              '.carousel_tri li{width:22px;height:22px;float:left;margin-right:7px;display:inline;}' +
                              '.carousel_tri li a{width:100%;height:100%;display:block;border-radius:2px;font:12px/22px Tahoma,Arial;color:#fff;text-align:center;text-decoration:none;background:#2D2D2D;}' +
                              '.carousel_tri li a:hover,.carousel_tri .carousel_cur a{background:#FF9202;text-decoration:none;}' +
                              '.carousel_txt{height:46px;font:18px/46px "Microsoft YaHei";color:#fff;position:absolute;bottom:0;left:15px;overflow:hidden;z-index:3;}' +
                              '.carousel_txt ul{padding:0;margin:0;list-style:none;}',
                fadeStyle = '.carousel_fade .carousel_panel li{position:absolute;background:#fff;}',
                horizontalStyle = '.carousel_horizontal .carousel_panel ul{width:9999px;}' +
                                  '.carousel_horizontal .carousel_panel li{float:left;display:block;}';
                verticalStyle = '.carousel_vertical .carousel_panel ul{height:9999px;}' +
                                '.carousel_vertical .carousel_panel li{display:block;}';
                                
            var showStyle = publicStyle + fadeStyle + horizontalStyle + verticalStyle;
            $('head').append('<style type="text/css">' + showStyle + '</style>').data('css_loaded', true);
            
            return this;
        },
        // 给每个实例单独设置样式
        setStyle: function(target, settings) {
            var width = parseInt(settings.width, 10),
                height = parseInt(settings.height, 10);
                
            target.addClass('carousel').css({
                width: width,
                height: height
            });
            $('.carousel_panel li', target).css({
                width: width,
                height: height
            });
            $('.carousel_txt', target).css({
                width: width - $('.carousel_tri ul', target).width() - 23
            });
            
            switch(settings.showType) {
                case 'fade':
                    target.addClass('carousel_fade');
                break;
                
                case 'horizontal':
                    target.addClass('carousel_horizontal');
                break;
                
                case 'vertical':
                    target.addClass('carousel_vertical');
                break;
            }
            
            return this;
        },
        // 建立节点
        buildDom: function(data) {
            var carouselPanel = '',
                carouselTri = '',
                carouselDesc = '',
                carouseHtml = '',
                i = 0,
                l = data ? data.length : 0,
                loadingSrc = this._model.settings.loadingImg,
                img = loadingSrc ? '<img src="' + loadingSrc +'" alt="Loading" />' : '';
            
            for (i; i<l; i++) {
                carouselPanel += '<li>' + img + '</li>';
                carouselTri += '<li><a href="javascript:;">' + (i+1) + '</a></li>';
                carouselDesc += '<li style="display:none;"></li>';
            }
            carouseHtml = '<!-- S Carousel -->' +
                          '<div class="carousel_panel">' +
                          '    <ul>' + 
                                    carouselPanel + 
                          '    </ul>' +
                          '</div>' +
                          '<div class="carousel_tri">' +
                          '    <ul>' +
                                    carouselTri +
                          '    </ul>' +
                          '</div>' +
                          '<div class="carousel_txt">' +
                          '    <ul>' +
                                    carouselDesc +
                          '    </ul>' +
                          '</div>' +
                          '<!-- E Carousel -->';
            this._element.innerHTML = carouseHtml;
            this.domBuilt.notify();
            
            return this;
        },
        showItemCb: function(index) {
            var _this = this,
                target = $(_this._element),
                speed = _this._model.settings.speed,
                curCls = 'carousel_cur';
            $('.carousel_txt li', target).eq(index).fadeIn(speed).siblings().fadeOut(speed);
            $('.carousel_tri li', target).eq(index).addClass(curCls).siblings().removeClass(curCls);
            
            return this;
        },
        fadeItem: function(index) {
            var _this = this,
                target = $(_this._element),
                speed = _this._model.settings.speed;
            $('.carousel_panel li', target).eq(index).fadeIn(speed).siblings().fadeOut(speed);
            _this.showItemCb(index);
            return this;
        },
        horizontalItem: function(index) {
            var _this = this,
                target = $(_this._element),
                width = _this._model.settings.width,
                speed = _this._model.settings.speed;
            
            $('.carousel_panel ul', target).animate({
                marginLeft: - index * width
            }, speed);
            _this.showItemCb(index);
            return this;
        },
        verticalItem: function(index) {
            var _this = this,
                target = $(_this._element),
                height = _this._model.settings.height,
                speed = _this._model.settings.speed;
            
            $('.carousel_panel ul', target).animate({
                marginTop: - index * height
            }, speed);
            _this.showItemCb(index);
            return this;
        },
        buildItem: function(data, index) {
            var _this = this,
                target = $(_this._element),
                url = data.url,
                img = data.img,
                text = data.text,
                liInnerHtml = '<a target="_blank" title="' + text + '" href="' + url + '">' +
                              '    <img src="' + img + '" alt="' + text + '" />' +
                              '</a>';
            $('.carousel_panel li', target).eq(index).html(liInnerHtml);
            $('.carousel_txt li', target).eq(index).html(text);
            
            _this.itemBuilt.notify({index: index});
            return this;
        }
    };
    
    // MVC - Controller
    function CarouselController(model, view) {
        var _this = this,
            settings = model.settings;

        _this._model = model;
        _this._view = view;
        
        view.domHandle.attach(function() {
            // 如果没有 data 参数
            if (!settings.data.length) {
                var li = $('li', view._element);
                
                li.each(function() {
                    var _this = $(this),
                        url = $('a', _this).attr('href'),
                        img = $('img', _this).attr('src'),
                        text = $('img', _this).attr('alt');
                    settings.data.push({url: url, img: img, text: text});
                });
            }
            view.buildDom(settings.data);
        });
        
        view.domBuilt.attach(function(sender) {
            var index = model.getCurIndex(),
                target = $(sender._element);
            
            _this.setStyle(target, settings).buildItem(settings.data[index], index);
            
            if (!!settings.auto) {
                setInterval(function() {
                    var allowSwitch = model.getAllowSwitch();
                    index = model.getCurIndex();
                    if (allowSwitch) {
                        index = index++ === model.settings.data.length - 1 ? 0 : index;
                        _this.handleItem(index);
                    }
                }, settings.interval);
            }
        });
        view.itemBuilt.attach(function(sender, args) {
            _this.setHasItem(sender, args.index).showItem(args.index);
        });
        view.triClicked.attach(function (sender, args) {
            _this.handleItem(args.index);
        });
        view.targetOver.attach(function () {
            _this.setAllowSwitch(false);
        });
        view.targetLeave.attach(function () {
            _this.setAllowSwitch(true);
        });
    }
    
    CarouselController.prototype = {
        setStyle: function(target, settings) {
            this._view.setStyle(target, settings);
            return this;
        },
        handleItem: function(index) {
            var _this = this,
                target = $(_this._view._element),
                liDom = $('.carousel_panel li', target).eq(index),
                hasItem = _this._model.getHasItem(liDom),
                datas = _this._model.settings.data,
                data = datas[index];
            if (!!hasItem) {
                _this.showItem(index);
            } else {
                _this.buildItem(data, index);
            }
            return this;
        },
        showItem: function(index) {
            var _this = this,
                target = $(_this._view._element),
                settings = _this._model.settings,
                showType = settings.showType;
            _this._view[showType + 'Item'](index);

            _this.setCurIndex(index);
            return this;
        },
        buildItem: function(data, index) {
            this._view.buildItem(data, index);
            return this;
        },
        setCurIndex: function(index) {
            this._model.setCurIndex(index);
            return this;
        },
        setAllowSwitch: function(val) {
            this._model.setAllowSwitch(val);
            return this;
        },
        setHasItem: function(sender, index) {
            var target = $(sender._element),
                liDom = $('.carousel_panel li', target).eq(index);
            this._model.setHasItem(liDom);
            return this;
        }
    };
    
    // 观察者模式
    function Event(sender) {
        this._sender = sender;
        this._listeners = [];
    }

    Event.prototype = {
        attach: function(listener) {
            this._listeners.push(listener);
        },
        notify: function(args) {
            var index;
            for (index = 0; index < this._listeners.length; index += 1) {
                this._listeners[index](this._sender, args);
            }
        }
    };
    
    $.fn.carousel = function(options) {
        return this.each(function(key, value) {
            var model = new CarouselModel(options),
                view = new CarouselView(model, value),
                controller = new CarouselController(model, view);
                
            // 保证每个实例互不影响
            try {
                view.init();
            } catch(e) {
                window.console && console.log(e);
            }
        });
    };

    // 默认设置
    $.fn.carousel.defaults = {
        data: [],
        auto: true,
        interval: 3000,
        speed: 500,
        width: 600,
        height: 330,
        loadingImg: '',
        showType: 'fade',
        triggerType: 'click'
    };
})(jQuery);