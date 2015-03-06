$(function () {
    $('#menu').slicknav({
        label: '',
        prependTo: '.page-wrapper',
        closeOnClick: true
    });
    $('.slicknav_menu').prepend('<div class="logo"><a href="#"><img src="img/logo.png"/></a></div>');
});

navigator.geolocation.getCurrentPosition(
    function(position) {
        console.log(position);
    }
);

ymaps.ready(function () {

    var myMap = new ymaps.Map('map', {
        center: [55.74, 37.58],
        zoom: 13,
        controls: []
    });


    var geolocation = ymaps.geolocation
    myMap.behaviors.disable('scrollZoom');
    myMap.controls.add('zoomControl')
    geolocation.get({
        provider: 'yandex',
        mapStateAutoApply: true
    }).then(function (result) {
// Красным цветом пометим положение, вычисленное через ip.
        result.geoObjects.options.set('preset', 'islands#redCircleIcon');
        result.geoObjects.get(0).properties.set({
            balloonContentBody: 'Мое местоположение'
        });
//myMap.geoObjects.add(result.geoObjects);
    });
    myMap.controls.add(searchControl);
});