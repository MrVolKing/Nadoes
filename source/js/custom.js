// bueger

$('.burger').click(function() {
    $('.adaptmenu').addClass('adaptmenu_active');
    $('body').css('overflow', 'hidden');
});

$('.close').click(function() {
    $('.adaptmenu').removeClass('adaptmenu_active');
    $('body').css('overflow', 'visible');
});

$('.adaptmenu nav').click(function() {
    $('.adaptmenu').removeClass('adaptmenu_active');
    $('body').css('overflow', 'visible');
});