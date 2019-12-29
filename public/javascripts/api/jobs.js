const getJobs = (limit) => {
    $.ajax({
        type: 'GET',
        url: `api/jobs/gets/${limit}`,
        dataType: "json",
        success: function (data) {
            if (data.getEtat) {
                if (data.getObjet.length > 0) {
                    var contentHead = `<div class="col-xl-12">
                                            <div class="section-headline centered margin-bottom-15">
                                                <h3>Metiers populaires</h3>
                                            </div>
                                            <div class="categories-container" id="allJobs">
                                            </div>
                                        </div>
                                        `;
                    
                    $("#listJobs").html(contentHead);
                    
                    data.getObjet.map(job => {
                        if (job.name != "") {
                            var content = `<a href="/candidats/liste" class="category-box">
                                                <div class="category-box-icon">
                                                    <i class="${job.icon}"></i>
                                                </div>
                                                <div class="category-box-counter">${job.nbre}</div>
                                                <div class="category-box-content">
                                                    <h3>${job.name}</h3>
                                                    <p>${job.describe}</p>
                                                </div>
                                            </a>`;

                            $("#allJobs").append(content);
                        }
                    })
                }
            } else {

                var content = `<div class="col-xl-12">
                                    <div class="section-headline centered margin-bottom-15">
                                        <h3>Aucun métier n'est disponible</h3>
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