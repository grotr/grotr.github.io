$().ready( function() {

    $('.who-am-i, .contacting-me').addClass('js');

    $(function() {
        var BV = new $.BigVideo({useFlashForFirefox:false});
        BV.init();
        if (Modernizr.touch) {
            BV.show('assets/img/rena.png');
        } else if (navigator.userAgent.indexOf("OPR")>0){
            BV.show('assets/img/rena.png'); // OPERA :(
        } else {
            BV.show('assets/img/rena.mp4', { altSource: 'http://grotr.github.io/assets/img/rena.webmhd.webm', ambient: true });
        }
    });
});

