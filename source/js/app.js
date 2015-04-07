var cityMap;
jQuery(function() {
    jQuery.scrollDepth();
});
$(function () {

    $('#menu').slicknav({
        label: '',
        prependTo: '.page-wrapper',
        closeOnClick: true
    });
    $('.slicknav_menu').prepend('<div class="logo"><a href="#main"><img src="img/logo.png"/></a></div>');

    $('.buy_button').click(
        function(){
            cityNum=-1;
            for(var i=0;i<3;i++){
                if($('ul.city:visible').children()[i].className==='selected') cityNum=i;
            }
            switch(cityNum){
                case 0:
                    window.open('http://www.autoexpert.ru', '_blank');
                    break;
                case 1:
                    window.open('http://www.tyres.spb.ru', '_blank');
                    break;
                case 2:
                    window.open('http://www.vershina-kazan.ru', '_blank');
                    break;
                case -1:
                    window.open('http://www.autoexpert.ru', '_blank');
                    break;
                default:

                    break;
            }


        }
    );

    $('ul#menu a, .logo a, .slicknav_nav a, .buy_button, .scrollTo').click(function(){
        var id = $.attr(this, 'href');
        var header = 0;
        if(id == '#slogan' || id == '#service_centers')
            if($(window).width()<875)
                header = 44;
            else
                header = 88;
        $('html, body').animate({
            scrollTop: $(id).offset().top - header
        }, 500);
        return false;
    });

    /*var skrl_opt = {
        smoothScrolling:false,
        forceHeight: false
    };

    var srkrl = skrollr.init(skrl_opt);

    $(window).resize(function(){
        if(isMobile()){
            if(srkrl != null){
                srkrl.destroy();
                srkrl = null;
            }
        } else if(srkrl == null) {
            srkrl = skrollr.init(skrl_opt);
        }
    }).resize();*/

    if(isMobile())
        $("body").addClass("mobile");

    $('.city li').click(function(){
        setSelectionVoid();
        $(this)[0].className='selected';
        var cityNum=getCityNumber();
        setSelectionVoid();
        setCityContent(cityNum);


    });

    $('.arrow.to_map').click(function(){
        $('html, body').animate({
            scrollTop: $("#map").offset().top
        }, 500);
    });
    $('.arrow.to_next').click(function(){
        var id = '#service_centers', header = 0;
        if($(window).width()<875)
            header = 44;
        else
            header = 88;
        if($('#slogan').is(':visible'))
            id = '#slogan';
        $('html, body').animate({
            scrollTop: $(id).offset().top - header
        }, 500);
    });
});

function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || $(window).width()<875
}


function setSelectionVoid(){
    for(var i=0; i<$('ul.city:visible').children().length; i++) {
        $('ul.city:visible').children()[i].className = '';
    }
}

ymaps.ready(function () {

    var myMap = new ymaps.Map('ymap', {
        center: [55.74, 37.58],
        zoom: 11,
        controls: []
    });
    cityMap=myMap;
    if (navigator.geolocation)
        navigator.geolocation.getCurrentPosition(
            function geolocationSuccess(position) {
                var cords = position.coords;
                if (55.5254 < cords.latitude && cords.latitude < 55.9253 && 37.2939 < cords.longitude && cords.longitude < 37.8707)setCity(0);
                if (59.6023 < cords.latitude && cords.latitude < 60.2025 && 29.6239 < cords.longitude && cords.longitude < 30.6841)setCity(1);
                if (55.6336 < cords.latitude && cords.latitude < 55.9462 && 48.7812 < cords.longitude && cords.longitude < 49.3566)setCity(2);

                myMap.setCenter([cords.latitude, cords.longitude],11);
            },
            geolocationFailure
        );
    else setCity(0);


    var geolocation = ymaps.geolocation;
    myMap.behaviors.disable('scrollZoom');
    myMap.controls.add('zoomControl');
    /* geolocation.get({
     provider: 'yandex',
     mapStateAutoApply: true
     }).then(function (result) {
     // Красным цветом пометим положение, вычисленное через ip.
     result.geoObjects.options.set('preset', 'islands#redCircleIcon');
     result.geoObjects.get(0).properties.set({
     balloonContentBody: 'Мое местоположение'
     });
     // myMap.geoObjects.add(result.geoObjects);
     });*/


    MyBalloonLayout = ymaps.templateLayoutFactory.createClass(
        '<div class="balloon">' +
        '<a class="balloon-close" href="#"><img src="img/close.png"></a>' +
        '<div class="arrow"></div>' +
        '<div class="popover-inner">' +
        '$[[options.contentLayout observeSize minWidth=235 maxWidth=235 maxHeight=350]]' +
        '</div>' +
        '</div>', {
            build: function () {
                this.constructor.superclass.build.call(this);

                this._$element = $('.balloon', this.getParentElement());

                this.applyElementOffset();

                this._$element.find('.balloon-close')
                    .on('click', $.proxy(this.onCloseClick, this));
            },
            clear: function () {
                this._$element.find('.close')
                    .off('click');

                this.constructor.superclass.clear.call(this);
            },
            onSublayoutSizeChange: function () {
                MyBalloonLayout.superclass.onSublayoutSizeChange.apply(this, arguments);

                if (!this._isElement(this._$element)) {
                    return;
                }

                this.applyElementOffset();

                this.events.fire('shapechange');
            },
            applyElementOffset: function () {
                this._$element.css({
                    left: -(this._$element[0].offsetWidth / 2),
                    top: -(this._$element[0].offsetHeight + this._$element.find('.arrow')[0].offsetHeight)
                });
            },
            onCloseClick: function (e) {
                e.preventDefault();

                this.events.fire('userclose');
            },
            getShape: function () {
                if (!this._isElement(this._$element)) {
                    return MyBalloonLayout.superclass.getShape.call(this);
                }

                var position = this._$element.position();

                return new ymaps.shape.Rectangle(new ymaps.geometry.pixel.Rectangle([
                    [position.left, position.top], [
                        position.left + this._$element[0].offsetWidth,
                        position.top + this._$element[0].offsetHeight + this._$element.find('.arrow')[0].offsetHeight
                    ]
                ]));
            },

            /**
             * Проверяем наличие элемента (в ИЕ и Опере его еще может не быть).
             * @function
             * @private
             * @name _isElement
             * @param {jQuery} [element] Элемент.
             * @returns {Boolean} Флаг наличия.
             */
            _isElement: function (element) {
                return element && element[0] && element.find('.arrow')[0];
            }
        });

    MyBalloonContentLayout = ymaps.templateLayoutFactory.createClass(
        '<div class="popover-content">$[properties.balloonContent]</div>'
    );

    var arr = [
        ['Автоэксперт', 'Дорожный пр-д, д.1, к.2  ', '+7 (495) 648-60-28', 'autoexpert.ru', 'shinaexpert.ru', [55.6160, 37.6138]],
        ['Автоэксперт', 'Олсуфьевский пер., д.7, с.2  ', '+7 (495) 648-60-28', 'autoexpert.ru', 'shinaexpert.ru', [55.7326,37.5795]],
        ['Автоэксперт', 'ул. Краснодарская, д.72, к.1  ', '+7 (495) 648-60-28', 'autoexpert.ru', 'shinaexpert.ru', [55.6695,37.7798]],
        ['Автоэксперт', 'ул. Куликовская, вл.10, стр.1  ', '+7 (495) 648-60-28', 'autoexpert.ru', 'shinaexpert.ru', [55.5729,37.5642]],
        ['Автоэксперт', 'ул. Березовая алеея, 2а ', '+7 (495) 648-60-28', 'autoexpert.ru', 'shinaexpert.ru', [55.8520,37.6094]],
        ['Эксклюзив', 'пр-т Большевиков, д. 42  ', '+7 (812) 441 21 28', 'tyres.spb.ru', '', [59.8891,30.4913]],
        ['Эксклюзив', 'Сердобольская ул., д. 3  ', '+7 (812) 492 02 13', 'tyres.spb.ru', '', [59.9945,30.3273]],
        ['Эксклюзив', 'ул. Оптиков, д. 15  ', '+7 (812) 320 18 85', 'tyres.spb.ru', '', [59.9982,30.2351]],
        ['Вершина', 'Горьковское ш., 47/1  ', '+7 (843) 290 10 40', 'vershina-kazan.ru', '', [55.8264,49.0253]],
        ['Вершина', 'пр-т Ямашева, д.61  ', '+7 (843) 517 53 75', 'vershina-kazan.ru', '', [55.8255,49.1280]],
        ['Вершина', 'пр-т Ямашева, д.92 Б  ', '+7 (843) 521-77-33', 'vershina-kazan.ru', '', [55.8276,49.1502]]

    ];
    for(var i=0;i<arr.length;i++){
        var balCont='<h1>' + arr[i][0] + '</h1>' + '<p>' + arr[i][1]   + '</br>' + arr[i][2] + '</br>' + '<a class="orange" href="http://www.' + arr[i][3] + '">www.' + arr[i][3] + '</a>';
        if(i<5) balCont+='</br>' + '<a class="orange"  href="http://www.' + arr[i][4] + '">www.' + arr[i][4] + '</a>';
    var myPlacemark = new ymaps.Placemark(arr[i][5], {
        balloonContent: balCont// + (i<4)?:''

    }, {

        balloonShadow: false,
        balloonLayout: MyBalloonLayout,
        balloonContentLayout: MyBalloonContentLayout,
        balloonPanelMaxMapArea: 0,
        balloonOffset: [-320, -178],
        hideIconOnBalloonOpen: false,
        iconLayout: 'default#image',
        iconImageHref: 'img/pin.png',//собственная иконка
        iconImageSize: [128, 128],
        iconImageOffset: [-60, -110]
    });
        myMap.geoObjects.add(myPlacemark);
}



});

function getGeolacation(){

}


function geolocationFailure(positionError) {
    setCity(0);
}
function setCity(cityNum){
    $('ul.city:visible').children()[cityNum].click();
    //Москва 0 Питер 1 Казань 2
}

function setCityContent(cityNum){

    $('div#piter').hide();
    $('div#kazan').hide();
    $('div#moscow').hide();
    switch(cityNum){
        case 0:
            $('div#moscow').show();
            break;
        case 1:
            $('div#piter').show();
            break;
        case 2:
            $('div#kazan').show();
            break;
        default:
            $('div#moscow').show();
            break;
    }
    $('ul.city:visible').children()[cityNum].className='selected';

    var cords=[[55.7538,37.6201],[59.9391,30.3159],[55.7958,49.1066]];
    cityMap.setCenter(cords[cityNum],11);


}
function getCityNumber(){

    for(var i=0; i<$('ul.city:visible').children().length; i++)
        if ($('ul.city:visible').children()[i].className == 'selected')
            return i;

}
