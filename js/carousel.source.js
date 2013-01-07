/**
 * @description 基于 jQuery 的按需加载轮播图插件
 * @param data {Array} #必填# 轮播图的数据 [{url: '', img: '', text: ''}]
          auto {boolean} #选填# 是否自动轮播
          interval {number} #选填# 轮播间隔时间（毫秒）
          speed {number} #选填# 轮播切换速度（毫秒）
          width: {number} #选填# 轮播图宽度
          height: {number} #选填# 轮播图高度
          loadingImg: {String} #选填# 加载中图片地址
          showType: {String} #选填# 显示轮播图方式 fade / horizontal / vertical
          triggerType: {String} #选填# 触发轮播方式 click / mouseover
 * @author i@wange.im
 * @url http://wange.im/
 * @version beta 0
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
        },
        checkParams: function() {
            var options = $.fn.carousel.defaults,
                st = this.settings,
                triggerTypeArr = ['click', 'mouseover'],
                showTypeArr = ['fade', 'horizontal', 'vertical'];
                
            for (var i in options) {
                if (typeof options[i] !== typeof st[i]) {
                    window.console && console.log(i + ': ' + st[i] + ' is invalid.');
                }
            }
            if ($.inArray(st.triggerType, triggerTypeArr) === -1) {
                window.console && console.log('triggerType: ' + st.triggerType + ' is invalid.');
            }
            if ($.inArray(st.showType, showTypeArr) === -1) {
                window.console && console.log('showType: ' + st.showType + ' is invalid.');
            }
            this.settings.interval = this.settings.interval < this.settings.speed ? this.settings.speed : this.settings.interval;
        }
    };
    
    // MVC - View
    function CarouselView(model, element) {
        var _this = this,
            target = $(element);
        
        _this._model = model;
        _this._element = element;
        
        _this.checkParams = new Event(_this);
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
        init: function() {
            this.checkParams.notify();
            this.initCss();
            this.buildDom(this._model.settings.data);
            this.domBuilt.notify();
        },
        initCss: function() {
            var _this = this,
                type = _this._model.settings.showType,
                width = _this._model.settings.width,
                height = _this._model.settings.height,
                target = $(_this._element),
                showStyle,
                publicStyle = '.carousel{position:relative;overflow:hidden;border-radius:5px;}' +
                        '.carousel img{border-radius:5px;}' +
                        '.carousel_panel{position:absolute;z-index:1;width:100%;height:100%;}' +
                        '.carousel_panel ul{width:100%;height:100%;padding:0;margin:0;list-style:none;}' +
                        '.carousel_panel li{width:100%;height:100%;overflow:hidden;vertical-align:bottom;}' +
                        '.carousel_panel a{display:block;width:100%;height:100%;}' +
                        '.carousel_panel img{width:100%;height:100%;display:block;border:0 none;}' +
                        '.carousel_tri{position:absolute;height:46px;bottom:0;left:0;background:#000;opacity:0.8;filter:alpha(opacity=80);width:100%;border-radius:0 0 5px 5px;z-index:2;}' +
                        '.carousel_tri ul{height:22px;position:absolute;right:8px;top:12px;padding:0;margin:0;list-style:none;}' +
                        '.carousel_tri li{width:22px;height:22px;float:left;margin-right:7px;display:inline;}' +
                        '.carousel_tri li a{width:100%;height:100%;display:block;border-radius:2px;font:12px/22px Tahoma,Arial;color:#fff;text-align:center;text-decoration:none;background:#2D2D2D;}' +
                        '.carousel_tri li a:hover,.carousel_tri .carousel_cur a{background:#FF9202;text-decoration:none;}' +
                        '.carousel_txt{height:46px;font:18px/46px "Microsoft YaHei";color:#fff;position:absolute;bottom:0;left:15px;overflow:hidden;z-index:3;}' +
                        '.carousel_txt ul{padding:0;margin:0;list-style:none;}',
                        
                fadeStyle = '.carousel_fade .carousel_panel li{position:absolute;display:none;}',
                horizontalStyle = '.carousel_horizontal .carousel_panel ul{width:9999px;}' +
                                  '.carousel_horizontal .carousel_panel li{float:left;display:block;width:' + width + 'px;}';
                verticalStyle = '.carousel_vertical .carousel_panel ul{height:9999px;}' +
                                '.carousel_vertical .carousel_panel li{display:block;height:' + height + 'px;}';
            target.addClass('carousel').css({
                width: _this._model.settings.width,
                height: _this._model.settings.height
            });
            
            switch(type) {
                case 'fade':
                    target.addClass('carousel_fade');
                    showStyle = fadeStyle;
                break;
                
                case 'horizontal':
                    target.addClass('carousel_horizontal');
                    showStyle = horizontalStyle;
                break;
                
                case 'vertical':
                    target.addClass('carousel_vertical');
                    showStyle = verticalStyle;
                break;
            }
            
            $('head').append('<style type="text/css">' + publicStyle + showStyle + '</style>');
        },
        buildDom: function(data) {
            var carouselPanel = '',
                carouselTri = '',
                carouseHtml = '',
                carouselDesc = '',
                i = 0,
                l = data.length,
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
                          
            $(this._element).html(carouseHtml);
        },
        fadeItem: function(index) {
            var _this = this,
                target = $(_this._element),
                speed = _this._model.settings.speed;
            $('.carousel_panel li', target).eq(index).fadeIn(speed).siblings().fadeOut(speed);
        },
        horizontalItem: function(index) {
            var _this = this,
                target = $(_this._element),
                width = _this._model.settings.width,
                speed = _this._model.settings.speed;
            
            $('.carousel_panel ul', target).animate({
                marginLeft: - index * width
            }, speed);
        },
        verticalItem: function(index) {
            var _this = this,
                target = $(_this._element),
                height = _this._model.settings.height,
                speed = _this._model.settings.speed;
            
            $('.carousel_panel ul', target).animate({
                marginTop: - index * height
            }, speed);
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
        }
    };
    
    // MVC - Controller
    function CarouselController(model, view) {
        var _this = this,
            settings = model.settings;

        _this._model = model;
        _this._view = view;
        
        view.domBuilt.attach(function() {
            var index = model.getCurIndex();
            
            _this.buildItem(settings.data[index], index);
            
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
            _this.setHasItem(sender, args.index);
            _this.showItem(args.index);
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
        view.checkParams.attach(function() {
            _this.checkParams();
        });
    }
    
    CarouselController.prototype = {
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
        },
        showItem: function(index) {
            var _this = this,
                target = $(_this._view._element),
                settings = _this._model.settings,
                showType = settings.showType,
                speed = settings.speed,
                curCls = 'carousel_cur';
            this._view[showType + 'Item'](index);
            $('.carousel_txt li', target).eq(index).fadeIn(speed).siblings().fadeOut(speed);
            $('.carousel_tri li', target).eq(index).addClass(curCls).siblings().removeClass(curCls);
            
            _this.setCurIndex(index);
        },
        buildItem: function(data, index) {
            this._view.buildItem(data, index);
        },
        setCurIndex: function(index) {
            this._model.setCurIndex(index);
        },
        setAllowSwitch: function(val) {
            this._model.setAllowSwitch(val);
        },
        setHasItem: function(sender, index) {
            var target = $(sender._element),
                liDom = $('.carousel_panel li', target).eq(index);
            this._model.setHasItem(liDom);
        },
        checkParams: function() {
            this._model.checkParams();
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
                view = new CarouselView(model, this),   
                controller = new CarouselController(model, view);
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