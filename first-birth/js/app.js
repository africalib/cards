var app = new Vue({
    el: '#app',
    data: {
        pictures: [],
        icos: ['fa fa-user-circle', 'fa fa-envelope', 'fa fa-camera-retro', 'fa fa-map'],
        outerSwiper: {},
        innerSwiper: {},
        moved: false,
        calculated: false,
        heart: null,
        dday: {
            dd: 0,
            hh: 0,
            mm: 0,
            ss: 0
        },
        before: true
    },
    methods: {
        calculate: function () {
            var now = new Date();
            var dday = new Date(2019, 0, 19, 11, 30, 0);
            var gap = now < dday ? dday - now : now - dday;
            var msec = gap;

            this.dday.dd = Math.floor(msec / 1000 / 60 / 60 / 24);
            msec -= this.dday.dd * 1000 * 60 * 60 * 24;
            this.dday.hh = Math.floor(msec / 1000 / 60 / 60);
            msec -= this.dday.hh * 1000 * 60 * 60;
            this.dday.mm = Math.floor(msec / 1000 / 60);
            msec -= this.dday.mm * 1000 * 60;
            this.dday.ss = Math.floor(msec / 1000);
            msec -= this.dday.ss * 1000;
            this.calculated = true;
            this.before = now < dday;
        },
        setHeartAnimate: function (time) {
            var place = $(this.$el).find('.heart-place:eq(' + this.outerSwiper.activeIndex + ')');

            if (place.length) {
                var offset = place.offset();
                this.heart.stop().show().animate({ top: offset.top, left: offset.left }, time);
            }
            else {
                this.heart.stop().hide();
            }
        }
    },
    created: function () {
        var t = this;
        setInterval(function () {
            t.calculate();
        }, 1000);
        t.calculate();
    },
    mounted: function () {
        var t = this;

        for (var i = 1; i <= 50; i += 1) {
            var name = (i < 10 ? '0' : '') + i + '.jpg';
            t.pictures.push(name);
        }

        t.heart = $(t.$el).find('.heart-ico');

        setTimeout(function () {
            t.setHeartAnimate(0);
        }, 100);

        t.$nextTick(function () {
            t.outerSwiper = new Swiper('.outer-container', {
                direction: 'vertical',
                pagination: {
                    el: '.outer-pagination',
                    clickable: true,
                    renderBullet: function (index, className) {
                        return '<i class="' + t.icos[index] + ' ' + className + '"></i>';
                    }
                }
            });

            t.innerSwiper = new Swiper('.inner-container', {
                slidesPerView: 'auto',
                loop: true,
                pagination: {
                    el: '.inner-pagination',
                    clickable: true,
                },
                autoplay: {
                    delay: 2000
                }
            });

            t.innerSwiper.slideTo(7, 0);
            t.innerSwiper.autoplay.stop();

            t.outerSwiper.on('slideChangeTransitionEnd', function () {
                if (t.outerSwiper.activeIndex === 2) {
                    if (!t.moved) {
                        t.innerSwiper.slideTo(0, 1000);

                        setTimeout(function () {
                            t.innerSwiper.autoplay.start();
                        }, 1000);

                        t.moved = true;
                    }
                    else {
                        t.innerSwiper.autoplay.start();
                    }
                }
                else {
                    t.innerSwiper.autoplay.stop();
                }

                t.setHeartAnimate(1000);
            });
        });
    }
});