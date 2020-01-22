const getVIPFreelancers = (limit) => {
    $.ajax({
        type: 'GET',
        url: `/api/vip/${limit}`,
        dataType: "json",
        success: function (data) {
            if (data.getEtat) {
                var contentHead = `<div class="container">
                                    <div class="row">

                                        <div class="col-xl-12">
                                            <!-- Section Headline -->
                                            <div class="section-headline margin-top-0 margin-bottom-25">
                                                <h3>Comptes sponsorisé</h3>
                                                <a href="/candidats/liste" class="headline-link">Voir tous les profiles</a>
                                            </div>
                                        </div>

                                        <div class="col-xl-12">
                                            <div class="vip-slick-carousel freelancers-container freelancers-grid-layout" id="vipFreelancers">
                                            </div>
                                        </div>
                                    </div>
                                   </div>`;
                $("#sectionVIP").html(contentHead);

                if (data.getObjet.length > 0) {
                    var outFreelancer = 0;

                    data.getObjet.map((freelancer, item, tab) => {
                        var name = () => {
                            if (freelancer.identity) {
                                return `${freelancer.identity.lastName} ${freelancer.identity.name.toUpperCase()}`
                            } else {
                                return freelancer.email;
                            }
                        },
                        job = () => {
                            if (freelancer.job && freelancer.job.name) {
                                return `<span><i class="${freelancer.job.icon}" style="font-size: 1.2em"></i>&nbsp;${freelancer.job.name}</span>`;
                            } else {
                                return `<br/>`;
                            }
                        },
                        content = `<div style="background-color: transparent;" class="freelancer">
                                        <a href="jobs-list-layout-1.html" class="photo-box" data-background-image="/images/avatar/35.jpg">
                                            <div class="photo-box-content">
                                                <h3>${name()}</h3>
                                                ${job()}<br>
                                                <span>${freelancer.town ? `<i class="icon-material-outline-location-on"></i> ${freelancer.town}` : `---`}</span>
                                            </div>
                                        </a>
                                    </div>`;

                        outFreelancer++;

                        $("#vipFreelancers").append(content);

                        if (outFreelancer == tab.length) {

                            //Photo box
                            $(".photo-box, .photo-section, .video-container").each(function () {
                                var photoBox = $(this);
                                var photoBoxBG = $(this).attr('data-background-image');

                                if (photoBox !== undefined) {
                                    $(this).css('background-image', 'url(' + photoBoxBG + ')');
                                }
                            });

                            //Carrousel
                            $('.vip-slick-carousel').slick({
                                infinite: false,
                                slidesToShow: 4,
                                slidesToScroll: 1,
                                dots: true,
                                arrows: true,
                                adaptiveHeight: true,
                                responsive: [
                                    {
                                        breakpoint: 1292,
                                        settings: {
                                            dots: true,
                                            arrows: false
                                        }
                                    },
                                    {
                                        breakpoint: 993,
                                        settings: {
                                            slidesToShow: 2,
                                            slidesToScroll: 2,
                                            dots: true,
                                            arrows: false
                                        }
                                    },
                                    {
                                        breakpoint: 769,
                                        settings: {
                                            slidesToShow: 1,
                                            slidesToScroll: 1,
                                            dots: true,
                                            arrows: false
                                        }
                                    }
                                ]
                            });

                        }

                    })
                }
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
}

const boost = () => {
    $("#boostAccount").on("click", (e) => {
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: `/api/vip/become`,
            dataType: "json",
            success: function (data) {
                if (data.getEtat) {
                    window.location.href = '/profile/dashboard';                    
                }
            },
            error: function (err) {
                console.log(err);
            }
        });
    })
}

export { getVIPFreelancers, boost }