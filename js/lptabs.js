(function () {
    //Здесь дописываем код, чтобы можно было корректировать параметры, как в owl.carousel, перед return это указываем! defaultParams - это параметры по умолчанию, в переменной функции lpTabs указываем те переменные, которые задает пользователь, надо перезаписать те параметры, которые указал пользователь, остальные должны забираться из объекта, extend перезаписывает значения 1 параметра на аналогичные из второго)

    //    $.fn.lpTabs - позволяет расширить бибилиотеку jQuery, добавив в нее новые методы, в нашем случае это lpTabs, далее мы можем использовать его в проекте, например, $(tabs).lpTabs
    $.fn.lpTabs = function (userParams) {

        let defaultParams = {
            duration: 1000,
            triggerEvent:'click',
            startIndex:0,         
//            эти 2 параметра нужно реализовать в ДЗ самостоятельно
        

        }
        let params = $.extend(defaultParams, userParams);
        //        console.log(params.duration); Дальше нужно, чтобы эти значения попали в код! (Заменяем все числа где было 500 на params.duration/2)
      

        return $(this).each(function () {
            let tabs = $(this);
            tabsTitlesNames = [];

            tabs.addClass('lp-tabs');
            //                                                         Достает всех div-детей и перебирает их с помощью each
            tabs.children().each(function () {
                tabsTitlesNames.push($(this).attr('title'));
            }).addClass('lp-tab');
            //                                            Это вернет из атрибута названия для закладки, они будут в форме                                           массива, можно для примера вывести в консоль  console.log(tabsTitlesNames); 
            //            В табуляторе создается промежуточный код
            tabs.wrapInner('<div class="lp-tabs-content"></div>');
            tabs.prepend('<div class="lp-tabs-titles"><ul></ul></div>')

            //                                                           Это как ссылки на данные о названиях и контенте
            let tabsTitles = tabs.find('.lp-tabs-titles'),
                tabsContent = tabs.find('.lp-tabs-content'),


                tabsContentTabs = tabsContent.find('.lp-tab');
            //                                                                                     Используется нативный метод forEach, потому что методы jQuery не сработают для массива (массив, который выводили в консоль). Метод JS forEach позволяет перебрать все элементы внутри массива!
            tabsTitlesNames.forEach(function (value) {
                tabsTitles.find('ul').append('<li>' + value + '</li>');
            });

            let tabsTitlesItems = tabsTitles.find('ul li');

            //            Отображаем первый таб с помощью шоу
            tabsTitlesItems.eq(params.startIndex).addClass('active');
            tabsContentTabs.eq(params.startIndex).addClass('active').show();

            //            Достаем значение высоты активного таба из атрибута, чтобы не было наложения (tabsContent содержит все табы) OuterHeight позволяет измерить всю высоту с отсутпами и т.д. (Внешняя высота)
            let h = tabsContent.find('.active').outerHeight();
//            tabs.append('<div class="lp-tabs-footer">Активная вкладка: '+tabsTitlesNames[params.startIndex]+'(params.startIndex/'+tabsTitlesNames.length+')</div>');
//                                                                   ДОРАБОТКА!

            //            задаем всему табулятору высоту активного таба со всеми отступами
            tabsContent.height(h);



            //Нужно настроить изменение размеров таба при переключении по ссылкам разных размеров
            //            1. Проверяем, не находится ли табулятор в процессе переключения(отключается воз - ть нажатия на вкладку пок а не переключится на другую закладку) changing - класс, блокирующий табулятор, !значит "если таб не имеет класса changing", через this у нас доступ к той закладке, на которую кликнули

            tabsTitlesItems.on(params.triggerEvent, function () {
//                                                                         ДОРАБОТКА!
//                let i=$(this).index();
                
                if (!tabs.hasClass('changing')) {
                    tabs.addClass('changing');

                    tabsTitlesItems.removeClass('active');
                    $(this).addClass('active');

                    let curTab = tabsContent.find('.active'),
                        nextTab = tabsContentTabs.eq($(this).index());

                    let curHeight = curTab.outerHeight();

                    //                   2. Из - за того, что след.таб скрыт(none), тяжело измерить его высоту, его нет на странице, поэтому: так как страница обновляется медленнее чем компьютер это делает, можно измерить и спрятать обратно(наше действие быстрее, чем обновление страницы)

                    nextTab.show();
                    let nextHeight = nextTab.outerHeight();
                    nextTab.hide();

                    //                    3.Соотносим высоты

                    if (curHeight < nextHeight) {
                        tabsContent.animate({
                            height: nextHeight
                        }, params.duration / 2);
                    }
                    curTab.fadeOut(params.duration / 2, function () {

                        if (curHeight > nextHeight) {
                            tabsContent.animate({
                                height: nextHeight
                            }, params.duration / 2);
                        }
                        nextTab.fadeIn(params.duration / 2, function () {
                            curTab.removeClass('active');
                            nextTab.addClass('active');
                            tabs.removeClass('changing');
//                                                                          ДОРАБОТКА!!
//                            let text='Активная вкладка:'+tabsTitlesNames[i]+'('+(i+1)+'/'+tabsTitlesNames.length+')';
//                            tabs.find('.lp-tabs-footer').text('Активная вкладка:'+tabsTitlesNames[i]+'('+(i))');
                        });

                    });

                }
            });

            //Корректируем изменения размера окна, чтобы не выходило за рамки блоков, копируем функцию, которая была выше
            $(window).on('load resize', function () {
                let h = tabsContent.find('.active').outerHeight();
                tabsContent.height(h);
            })

        });
    }
})(jQuery);
