//                                                   ANGULAR JS

let lpApp = angular.module('lpApp', [])

lpApp.controller('lpPriceCtrl', function ($scope, $http) {




    //    подгружаем данные в контроллер (с пом. http мы можем отправлять запросы к разным файлам и аджакс запросы, get - способ передачи данных из подключенного документа) then помогает отследить тот момент, когда файл подгрузился т.к. js не останавливается пока грузится джсон файл, а читает строки дальше
    $http.get('price.json').then(function (res) {
        //        console.log(res.data);
        //        создаем св-во, которое будет хранить массив с данными
        $scope.prices = res.data;
        //        СЮДА ПЕРЕНЕСЛИ МЕТОД КАЛЬК
        $scope.calc();
    }).catch(function (err) {

        //         просмотреть массив, найти статус ошибки и вывести его на экран (404)
        //        console.log(err);

        $scope.reqStatus = err.status;
        $scope.reqStatusText = err.statusText;
    });


    //    занесли в переменные (св-ва) параметры сортировки, 1 сортировка по наименованию, 2.в алф.порядке
    $scope.sortBy = 'name';
    $scope.sortRev = false;

    //    создаем метод контроллера, механизм который будет менять сортирвоку, при клике будет вызываться, перезаписываем переменные сортбай
    $scope.sortSet = function (propertyName) {
        //        если сорт бай равно, значит кликнули второй раз
        if ($scope.sortBy == propertyName) {
            //            если тру, то записывается обратное значение через !=
            $scope.sortRev = !$scope.sortRev;
        }

        $scope.sortBy = propertyName;
    }

    //   Создаем метод calc, с пом.которого перебираем все элементы массива, текущий массив будет доступен в переменной function(price), создаем доп.элемент в массиве price2, который равен цене со скидкой

    //   
    $scope.calc = function () {
        $scope.prices.forEach(function (price) {
            price.price2 = price.price * (1 - price.discount);
        });
    }
    //    вызываем метод один раз.  forEach выдаст ошибку, т.к. аджакс запрос еще не выполнен, метод then еще не запустился
    //$scope.calc().

});







(function ($) {
    $(document).ready(function () {

        //        ДОПИСЫВАЕМ СТАРТОВЫЙ ЭКРАН
        let lpReady = false;
        //        ЗАПУСТИМ ФУНКЦИЮ, КОТОРАЯ БУДЕТ ПОЛУЧАТЬ СОДЕРЖИМОЕ АДР. СТРОКИ
        function lpGoToActive() {
            let lpPath = window.location.pathname.replace('/', ''),
                lpTrgt;

            //            проверяме, чтоб айди не был пустым
            if (lpPath != '') {
                lpTrgt = $('#' + lpPath);
                if (lpTrgt.length > 0) {
                    $('body, html').scrollTop(lpTrgt.offset().top - 44);
                }
            }

            setTimeout(function () {
                lpReady = true;
            }, 500)
//            console.log(lpPath);
        }
        lpGoToActive();
        $(window).on('load', lpGoToActive);
        //        *ПАНЕЛЬ НАВИГАЦИИ*
        //        функция будет проверять, где находится пользователь на странице и назначать класс соответствующему элменту навигации
        function lpHeader() {
            if ($(window).scrollTop() == 0) {
                $('header').addClass('top');
            } else {
                $('header.top').removeClass('top');
            }
        }

        lpHeader();
        $(window).on('load scroll', lpHeader);


        //ПЛАВНЫЙ СКРОЛЛ
        let lpNav = $('header ul')
        lpNav.find('li a').on('click', function (e) {
            let trgtSelector = $(this).attr('href'),
                linkTrgt = $(trgtSelector);
            if (linkTrgt.length > 0) {
                e.preventDefault();
                let offset = linkTrgt.offset().top - 44;
                $('body, html').animate({
                    scrollTop: offset
                }, 750);
            }
        });

        //         (АКТИВНЫЙ ПУНКТ МЕНЮ)  ПОДСВЕЧИВАНИЕ СООТВЕТСТВУЮЩЕГО ПУНКТА НАВИГАЦИИ ПРИ СКРОЛЛЕ ПОЛЬЗОВАТЕЛЕМ СТРАНИЦЫ, В ЗАВИСИМОСТИ ОТ ТОГО, ГДЕ ОН СЕЙЧАС НАХОДИТСЯ

        function lpSetNavActive() {
            let curItem = '';
            $('section').each(function () {
                if ($(window).scrollTop() > $(this).offset().top - 200) {
                    curItem = $(this).attr('id');
                }
            });
            let noActiveItem = lpNav.find('li.active').length == 0,
                newActiveRequired = lpNav.find('li.active a').attr('href') != '#' + curItem;

            if (noActiveItem || newActiveRequired) {

                lpNav.find('li.active').removeClass('active');
                lpNav.find('li a[href="#' + curItem + '"]').parent().addClass('active');

                //             ДОПИСЫВАЕМ (lpready блокирует создание новых состояний при загрузке страницы, она изначально будет false, после загрузки начнет создавать состояния)
                if (lpReady) {
                    //                    рвый аргумент - те данные, которые хотим созранить, второй игнорируется браузерами , юрл для адресной строки
                    window.history.pushState({
                        curItemName: curItem
                    }, curItem, '/' + curItem);
                }
            }

        }
        //        ЗАПУСК ФУНКЦИИ СРАЗУ ПОСЛЕ РЭДИ, А ЗАТЕМ ПОСЛЕ ЛОАД И СКРОЛЛ!
        lpSetNavActive()
        $(window).on('load scroll', lpSetNavActive);



        //                                                                                               СЛАЙДШОУ    
//        $('.lp-slider1').on('changed.owl.carousel initialized.owl.carousel', function (e) {
//            $('.sl-nav li').removeClass('active');
//            $('.sl-nav li').eq(e.item.index).addClass('active');
//
//
//        });

        $('.lp-slider1').owlCarousel({
            items: 1,
            nav: true,
            navText: ['<i class="fas fa-arrow-left"></i>', '<i class="fas fa-arrow-right"></i>']
        });

//        $('#sl-prev').click(function () {
//            $('.lp-slider1').trigger('prev.owl.carousel');
//        });
//
//        $('#sl-next').click(function () {
//            $('.lp-slider1').trigger('next.owl.carousel');
//        });

//        $('.sl-nav li').click(function () {
//            let slideNum = $(this).index();
//            $('.lp-slider1').trigger('to.owl.carousel', slideNum);
//        });
//        //        прослушиваем событие changed в слайдере




        //        САМОСТОЯТЕЛЬНО
        $('.lp-slider2').owlCarousel({
            items: 3,
            nav: true,
            navText: ['<i class="fas fa-arrow-left"></i>', '<i class="fas fa-arrow-right"></i>'],
            responsive: {
                0: {
                    items: 1
                },
                480: {
                    items: 2
                },
                768: {
                    items: 3
                }
            }
        })

        //                                                                                                      ТАБУЛЯТОР

        $('.lp-services').lpTabs({
            duration: 500

        });
        //
        //        //            ВСПЛЫВАЮЩИЕ ОКНА
        $('.lp-mfp-inline').magnificPopup({
            type: 'inline',
            //            callbacks:{
            //                beforeClose:function(){
            //                    alert('Can I close?')
            //                }
            //            }
        });
        //                            ДЛЯ ПОРТФОЛИО
        //        для нескольких галерей на сайте, нужно зайти в документации магнифик в галери малтипл и корректировать код, итог показан ниже!
        //        $('.lp-gallery').magnificPopup({                 
        //            type: 'image',
        //            delegate: 'a',
        //            gallery: {
        //                enabled: true
        //            }
        //        });

        $('.lp-gallery').each(function () {
            $(this).magnificPopup({
                type: 'image',
                delegate: 'a',
                gallery: {
                    enabled: true
                }
            });
        });
        //                                                 API   Public methods
        //        $.magnificPopup.open({
        //            items: {
        //                src: '#lp-srv1'
        //            },
        //            type: 'inline'
        //
        ////0 - номер слайда в галерее, который отобразится первым
        //        }, 0);

        //        окно закрывается при первом движении мышью (все это из документации)
        //        $(window).mousemove(function(){
        //            $.magnificPopup.close();
        //        })

        //        setTimeout(function () {
        //            $.magnificPopup.open({
        //                items: {
        //                    src: '#lp-srv1'
        //                },
        //                type: 'inline'
        //
        //            }, 0);
        //
        //        }, 2000);
        //        setTimeOut -станд.функция JS, таймер
        //
        //        $('.link-img').magnificPopup({
        //            type: 'image'
        //        });
        //
        //        $('.link_ajax').magnificPopup({
        //            type: 'ajax'
        //        });
        //
        //        $('.link_iframe').magnificPopup({
        //            type: 'iframe'
        //        });

        //        $('h2').magnificPopup({
        //            items:{
        //                type:'iframe',
        //                src:'https://www.youtube.com/watch?v=hMPMUDydTtQ'
        //            }
        //        });





        //        $('h2').magnificPopup({
        //            items: [
        //                {
        //                    type: 'iframe',
        //                    src: 'https://www.youtube.com/watch?v=hMPMUDydTtQ'
        //            },
        //                {
        //                    type: 'iframe',
        //                    src: '/img/slideshow/slide1.jpg'
        //                }
        //                            ],
        //            gallery: {
        //                enabled: true
        //            }
        //        });


//        $('.linkvideo').magnificPopup({
//            type: 'iframe'
//        });

//        $('.linkajax').magnificPopup({
//            type: 'ajax'
//        });
//
//        $('button.home_task_button').magnificPopup({
//            items: [
//                {
//                    type: 'ajax',
//                    src: 'page1.html'
//        },
//                {
//                    type: 'iframe',
//                    src: 'https://www.youtube.com/watch?v=Gb0TQ7VeApY'
//        },
//                {
//                    type: 'image',
//                    src: '/img/slideshow/slide1.jpg'
//        }
//    ],
//            gallery: {
//                enabled: true
//            }
//        });

        //                             ФОРМА ОБРАТНОЙ СВЯЗИ

        $('#lp-fb1').wiFeedBack({
            fbScript: 'blocks/wi-feedback.php',
            fbLink: '.lp-fb1-link',
            fbColor: '#7952b3'

        });

        $('#lp-fb2').wiFeedBack({
            fbScript: 'blocks/wi-feedback.php',
            fbLink: false,
            fbColor: '#7952b3'
        });
        //        ДОМАШНЕЕ ЗАДАНИЕ
        $('#lp-fb3').wiFeedBack({
            fbScript: 'blocks/wi-feedback.php',
            fbLink: '.lp-fb3-link',
            fbColor: '#7952b3'
        });

        $('#lp-fb4').wiFeedBack({
            fbScript: 'blocks/wi-feedback.php',
            fbLink: '.lp-fb4-link',
            fbColor: '#7952b3'
        });


        //    Карта (в функции джкуэри заменяем на доллар, ф-я сама будет вызыватсья, здесь создаем карту)

        $.fn.lpMapInit = function () {
            let lpMapOptions = {
                center: [53.905924, 27.510501],
                zoom: 16,
                //                отключаем параметры карты (указываем те строки, которые нам нужны)
                controls: ['fullscreenControl', 'zoomControl'],

            }
            if (window.innerWidth < 768) {
                lpMapOptions.behaviors = ['multiTouch'];
            } else {
                lpMapOptions.behaviors = ['drag'];
            }

            //            чтобы взаимод-ть с картйо, помещаем ее в переменную (ооп - создаем новый экземпляр этого класса) (айди лп мэп, объекта с настрйоками, обхект с доп.настройками) ЭТО  ВСЕ С ПРАВОЧНИКЕ js API класс МЭП, читать документацию
            let lpMap = new ymaps.Map('lp-map', lpMapOptions);

            let lpPlacemark = new ymaps.Placemark(lpMapOptions.center, {
                hintContent: 'ИТ Академия',
                balloonContentHeader: 'ИТ Академия',
                balloonContentBody: 'Учебные курсы',
                balloonContentFooter: 'пер. 4-й Загородный, 56А',

            });

            lpMap.geoObjects.add(lpPlacemark);
        }



    });
})(jQuery);
