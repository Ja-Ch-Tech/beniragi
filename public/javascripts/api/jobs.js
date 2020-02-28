const getJobs = (limit) => {
    $.ajax({
        type: 'GET',
        url: `api/jobs/gets/${limit}`,
        dataType: "json",
        success: function (data) {
            if (data.getEtat) {
                var sortieElement = 0;
                if (data.getObjet.length > 0) {
                    var contentHead = `<div class="col-xl-12">
                                            <div class="section-headline margin-bottom-15">
                                                <h3 class="poppins-font-uppercase">Metiers populaires</h3>
                                            </div>
                                            <div class="categories-container" id="allJobs">
                                            </div>
                                        </div>
                                        `;

                    $("#listJobs").html(contentHead);

                    data.getObjet.map(job => {
                        sortieElement++;
                        if (job.name != "") {
                            var content = `<a data-name="${job.name}" href="/candidats/liste" class="category-box liste_category">
                                                <div class="category-box-icon">
                                                    <i class="${job.icon}"></i>
                                                </div>
                                                ${job.nbre > 0 ? `<div class="category-box-counter">${job.nbre}</div>` : ""}
                                                <div class="category-box-content">
                                                    <h3>${job.name}</h3>
                                                    <p>${job.describe}</p>
                                                </div>
                                            </a>`;

                            $("#allJobs").append(content);

                            if (sortieElement == data.getObjet.length) {
                                $(".liste_category").on('click', function (e) {
                                    var value = e.currentTarget.getAttribute("data-name");
                                    sessionStorage.setItem("metier__search_item", value);
                                    sessionStorage.setItem("location__search_item", '');
                                });
                            }
                        }
                    })
                }
            } else {

                var content = `<div class="col-xl-12">
                                    <div class="section-headline centered margin-bottom-15">
                                        <h3 class="poppins-font-uppercase">Aucun métier n'est disponible</h3>
                                    </div>
                                </div>`;

                $("#listJobs").html(content);
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
}

export { getJobs }