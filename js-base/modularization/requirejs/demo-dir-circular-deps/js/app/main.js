define(['app/message', 'app/print', 'jquery'], function (message, print, $) {
    print(message.getHello());

    $('#root').on('click', function (e) {
        console.log(e);

        $(this).append('<div onclick="console.log(123)">555555555</div>');
    });
});
