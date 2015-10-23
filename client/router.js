if (Meteor.isClient) {


    function getUa() {

        var ua = navigator.userAgent;

        if (!ua || ua === '') {
            return 'desktop';
        }

        if (ua.match(/GoogleTV|SmartTV|Internet TV|NetCast|NETTV|AppleTV|boxee|Kylo|Roku|DLNADOC|CE\-HTML/i)) {
            return 'tv'; // if user agent is a smart TV - http://goo.gl/FocDk
        } else if (ua.match(/Xbox|PLAYSTATION 3|Wii/i)) {
            return 'tv'; // if user agent is a TV Based Gaming Console
        } else if (ua.match(/iP(a|ro)d/i) || (ua.match(/tablet/i) && !ua.match(/RX-34/i)) || ua.match(/FOLIO/i)) {
            return 'tablet'; // if user agent is a Tablet
        } else if (ua.match(/Linux/i) && ua.match(/Android/i) && !ua.match(/Fennec|mobi|HTC Magic|HTCX06HT|Nexus One|SC-02B|fone 945/i)) {
            return 'tablet'; // if user agent is an Android Tablet
        } else if (ua.match(/Kindle/i) || (ua.match(/Mac OS/i) && ua.match(/Silk/i))) {
            return 'tablet'; // if user agent is a Kindle or Kindle Fire
        } else if (ua.match(/GT-P10|SC-01C|SHW-M180S|SGH-T849|SCH-I800|SHW-M180L|SPH-P100|SGH-I987|zt180|HTC( Flyer|_Flyer)|Sprint ATP51|ViewPad7|pandigital(sprnova|nova)|Ideos S7|Dell Streak 7|Advent Vega|A101IT|A70BHT|MID7015|Next2|nook/i) || (ua.match(/MB511/i) && ua.match(/RUTEM/i))) {
            return 'tablet'; // if user agent is a pre Android 3.0 Tablet
        } else if (ua.match(/BOLT|Fennec|Iris|Maemo|Minimo|Mobi|mowser|NetFront|Novarra|Prism|RX-34|Skyfire|Tear|XV6875|XV6975|Google Wireless Transcoder/i)) {
            return 'phone'; // if user agent is unique mobile User Agent
        } else if (ua.match(/Opera/i) && ua.match(/Windows NT 5/i) && ua.match(/HTC|Xda|Mini|Vario|SAMSUNG\-GT\-i8000|SAMSUNG\-SGH\-i9/i)) {
            return 'phone'; // if user agent is an odd Opera User Agent - http://goo.gl/nK90K
        } else if ((ua.match(/Windows (NT|XP|ME|9)/) && !ua.match(/Phone/i)) && !ua.match(/Bot|Spider|ia_archiver|NewsGator/i) || ua.match(/Win( ?9|NT)/i)) {
            return 'desktop'; // if user agent is Windows Desktop
        } else if (ua.match(/Macintosh|PowerPC/i) && !ua.match(/Silk/i)) {
            return 'desktop'; // if agent is Mac Desktop
        } else if (ua.match(/Linux/i) && ua.match(/X11/i) && !ua.match(/Charlotte/i)) {
            return 'desktop'; // if user agent is a Linux Desktop
        } else if (ua.match(/CrOS/)) {
            return 'desktop'; // if user agent is a Chrome Book
        } else if (ua.match(/Solaris|SunOS|BSD/i)) {
            return 'desktop'; // if user agent is a Solaris, SunOS, BSD Desktop
        } else if (ua.match(/curl|Bot|B-O-T|Crawler|Spider|Spyder|Yahoo|ia_archiver|Covario-IDS|findlinks|DataparkSearch|larbin|Mediapartners-Google|NG-Search|Snappy|Teoma|Jeeves|Charlotte|NewsGator|TinEye|Cerberian|SearchSight|Zao|Scrubby|Qseero|PycURL|Pompos|oegp|SBIder|yoogliFetchAgent|yacy|webcollage|VYU2|voyager|updated|truwoGPS|StackRambler|Sqworm|silk|semanticdiscovery|ScoutJet|Nymesis|NetResearchServer|MVAClient|mogimogi|Mnogosearch|Arachmo|Accoona|holmes|htdig|ichiro|webis|LinkWalker|lwp-trivial/i) && !ua.match(/mobile|Playstation/i)) {
            return 'bot'; // if user agent is a BOT/Crawler/Spider
        } else {
            return 'phone'; // Otherwise assume it is a mobile Device
        }
    }



    var prefix = 'desktop.';
    var ua = getUa();

    if(ua == 'phone') {
        prefix = ua + '.';
    }

    Router.route('/', {
        name: prefix + 'index'
    });

    Router.configure({
        //notFoundTemplate: '404',
        layoutTemplate: 'AppLayout',
        //loadingTemplate: 'loading',
        controller: 'ApplicationController'
    });

    ApplicationController = RouteController.extend({
        action: function () {
            this.render();
        }
    });

}