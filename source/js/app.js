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
                if(55.5254<cords.latitude&&cords.latitude<55.9253&&37.2939<cords.longitude&&cords.longitude<37.8707)setCity(0);
                if(59.6023<cords.latitude&&cords.latitude<60.2025&&29.6239<cords.longitude&&cords.longitude<30.6841)setCity(1);
                if(55.6336<cords.latitude&&cords.latitude<55.9462&&48.7812<cords.longitude&&cords.longitude<49.3566)setCity(2);

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

                if(!this._isElement(this._$element)) {
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

    var arr=[
        ['Автоэксперт','Название','Телефон','autoexpert.ru','shino.ru',[55.7499,37.6214]]
    ];

    var myPlacemark = new ymaps.Placemark(arr[0][5], {
        balloonContent:'<h1>' +
        arr[0][0] +
        '</h1>' +
        '<p>' +
        arr[0][1] +
        '</br>' +
        arr[0][2] +
        '</br>' +
        '<a class="orange" href="http://www.' +
        arr[0][3] +
        '">www.' +
        arr[0][3] +
        '</a></br>'+
        '<a class="orange"  href="http://www.' +
        arr[0][4] +
        '">www.' +
        arr[0][4] +
        '</a>'

    }, {

        balloonShadow: false,
        balloonLayout: MyBalloonLayout,
        balloonContentLayout: MyBalloonContentLayout,
        balloonPanelMaxMapArea: 0,
        balloonOffset: [-300, -178],
        hideIconOnBalloonOpen: false,
        iconLayout: 'default#image',
        iconImageHref: 'img/pin.png',//собственная иконка
        iconImageSize: [128, 128],
        iconImageOffset: [-30, -110]
    });


    myMap.geoObjects.add(myPlacemark);
});

function getGeolacation(){

}


function geolocationFailure(positionError) {

}
function setCity(cityNum){
    //Москва 0 Питер 1 Казань 2
}
