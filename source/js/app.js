$(function () {
    $('#menu').slicknav({
        label: '',
        prependTo: '.page-wrapper',
        closeOnClick: true
    });
    $('.slicknav_menu').prepend('<div class="logo"><a href="#main"><img src="img/logo.png"/></a></div>');



    $('ul#menu a, .logo a, .slicknav_nav a').click(function(){
        $('html, body').animate({
            scrollTop: $( $.attr(this, 'href') ).offset().top
        }, 500);
        return false;
    });

    skrollr.init({
        smoothScrolling:false,
        forceHeight: false
    });
});

ymaps.ready(function () {

    var myMap = new ymaps.Map('ymap', {
        center: [55.74, 37.58],
        zoom: 15,
        controls: []
    });

    if (navigator.geolocation)
        navigator.geolocation.getCurrentPosition(
            function geolocationSuccess(position) {
                var cords = position.coords;
                myMap.setCenter([cords.latitude, cords.longitude]);
            },
            geolocationFailure
        );


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
            /**
             * Строит экземпляр макета на основе шаблона и добавляет его в родительский HTML-элемент.
             * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/layout.templateBased.Base.xml#build
             * @function
             * @name build
             */
            build: function () {
                this.constructor.superclass.build.call(this);

                this._$element = $('.balloon', this.getParentElement());

                this.applyElementOffset();

                this._$element.find('.balloon-close')
                    .on('click', $.proxy(this.onCloseClick, this));
            },

            /**
             * Удаляет содержимое макета из DOM.
             * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/layout.templateBased.Base.xml#clear
             * @function
             * @name clear
             */
            clear: function () {
                this._$element.find('.close')
                    .off('click');

                this.constructor.superclass.clear.call(this);
            },

            /**
             * Метод будет вызван системой шаблонов АПИ при изменении размеров вложенного макета.
             * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/IBalloonLayout.xml#event-userclose
             * @function
             * @name onSublayoutSizeChange
             */
            onSublayoutSizeChange: function () {
                MyBalloonLayout.superclass.onSublayoutSizeChange.apply(this, arguments);

                if(!this._isElement(this._$element)) {
                    return;
                }

                this.applyElementOffset();

                this.events.fire('shapechange');
            },

            /**
             * Сдвигаем балун, чтобы "хвостик" указывал на точку привязки.
             * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/IBalloonLayout.xml#event-userclose
             * @function
             * @name applyElementOffset
             */
            applyElementOffset: function () {
                this._$element.css({
                    left: -(this._$element[0].offsetWidth / 2),
                    top: -(this._$element[0].offsetHeight + this._$element.find('.arrow')[0].offsetHeight)
                });
            },

            /**
             * Закрывает балун при клике на крестик, кидая событие "userclose" на макете.
             * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/IBalloonLayout.xml#event-userclose
             * @function
             * @name onCloseClick
             */
            onCloseClick: function (e) {
                e.preventDefault();

                this.events.fire('userclose');
            },

            /**
             * Используется для автопозиционирования (balloonAutoPan).
             * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/ILayout.xml#getClientBounds
             * @function
             * @name getClientBounds
             * @returns {Number[][]} Координаты левого верхнего и правого нижнего углов шаблона относительно точки привязки.
             */
            getShape: function () {
                if(!this._isElement(this._$element)) {
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

    var myPlacemark = new ymaps.Placemark([55.74, 37.58], {
        balloonContent:'<h1>Автоэксперт</h1>' +
        '<p>ljvf dssdsdf</br>tel 36484</br>' +
        '<a class="orange" target="_blank" href="http://www.autoexpert.ru">www.autoexpert.ru</a></br>'+
        '<a class="orange" target="_blank" href="http://www.shino.ru">www.shino.ru</a>'

    }, {
        iconLayout: 'islands#circleIcon',
        balloonShadow: false,
        balloonLayout: MyBalloonLayout,
        balloonContentLayout: MyBalloonContentLayout,
        balloonPanelMaxMapArea: 0,
        balloonOffset: [-300, -178],
        hideIconOnBalloonOpen: false
        /*iconLayout: 'default#image',
        iconImageHref: '/maps/doc/jsapi/2.1/examples/images/myIcon.gif',//собственная иконка
        iconImageSize: [30, 42],
        iconImageOffset: [-3, -42]*/
    });


    myMap.geoObjects.add(myPlacemark);
});

function getGeolacation(){

}


function geolocationFailure(positionError) {

}
