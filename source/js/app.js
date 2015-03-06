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

    skrollr.init();
});

ymaps.ready(function () {


    var myMap = new ymaps.Map('map', {
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


    var geolocation = ymaps.geolocation
    myMap.behaviors.disable('scrollZoom');
    myMap.controls.add('zoomControl')
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
    });

    var myPlacemark = new ymaps.Placemark([55.76, 37.56], {}, {
        iconLayout: 'default#image',
        iconImageHref: '/maps/doc/jsapi/2.1/examples/images/myIcon.gif',//собственная иконка
        iconImageSize: [30, 42],
        iconImageOffset: [-3, -42]
    });
    myPlacemark.events.add('click', function () {
        alert('О, событие!');
    });*/
});

function getGeolacation(){

}


function geolocationFailure(positionError) {

}
