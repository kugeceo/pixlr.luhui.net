var apiCategories = '/api/pro/template_category',
    apiTemplates = '/api/pro/template',
    editorURL = '/pro/editor/',
    currURL = '',
    global_category_id,
    global_keyword,
    global_page;
var loadFirstTime = true;

function loadTemplate(idCategory, keyword, page ) {
    $(window).scrollTop(0);
    if (idCategory == undefined) {idCategory = (global_category_id?global_category_id:'');}
    if (keyword == undefined) {keyword = (global_keyword?global_keyword:'');}
    if (page == undefined) {page ='';}
    $('#list-templates').text('');
    $('#pagination-template').hide();
    var numberPage = 0;
    $.ajax({
        url: apiTemplates+'/'+idCategory+'?keyword='+keyword+'&page='+page,
        method: 'GET',
        success: function(response){
            global_category_id = idCategory;
            global_keyword = keyword;
            global_page = global_page;
            numberPage = response.total_pages;

            var newURL = '/pro/template/';
            newURL = '/pro/template/'+idCategory;

            if(keyword){
                newURL = newURL+'?keyword='+keyword
            }

            if (page=='') {page=1;}
            newURL = newURL+'?page='+page;

            if (loadFirstTime == false) {
                if(newURL != currURL){
                    currURL = newURL;
                    window.history.pushState({'idCategory':idCategory,'keyword':keyword,'page':page}, "", newURL);
                }
            }

            if (response.data.length > 0) {
                $('#pagination-template').show();
            } else {
                $('#list-templates').text('No template found.');
                return;
            }

            $('#list-templates').html("");
            for (var i = 0; i < response.data.length; i++) {
                $('#list-templates').
                append('<div class="item-category">'
                            +'<a href="#" class="wrap-img-item" id= "'+response.data[i].id+'" data-asset_key="'+response.data[i].asset_key+'" data-name="'+response.data[i].name+'" data-description="'+response.data[i].description+'" data-dimension_text="'+response.data[i].dimension_text+'" data-total_filesize="'+response.data[i].total_filesize+'" data-category_name="'+response.data[i].category_name+'" data-keywords="'+response.data[i].keywords+'" data-images="'+response.data[i].images+'">'
                                +'<img class="lazy" src="../../images/bg-480x318.jpg" data-original="'+response.data[i].thumbs[0]+'">'
                            +'</a>'
                            // +'<div class="title-item">'+response.data[i].name+'</div>'
                        +'</div>');
            }

            $("img.lazy").lazyload({
                threshold : 200
            });

            if (loadFirstTime) {
                var value_hash = location.hash.split('#')[1];
                if (value_hash != undefined) {
                    $('#'+value_hash).trigger('click');
                }
            }
            var setFirstPage = parseInt(page);

            $('#pagination-template').twbsPagination({
                totalPages: response.total_pages,
                visiblePages: 4,
                prev:'<i class="fa fa-angle-left"></i>',
                next:'<i class="fa fa-angle-right"></i>',
                first:false,
                last:false,
                startPage:setFirstPage,
                onPageClick: function (event, pageCurrent) {
                    if(loadFirstTime == true){
                        loadFirstTime = false;
                    }else{
                        loadTemplate(idCategory,keyword, pageCurrent);
                    }
                }
            });
        },
        error: function(jqXHR, textStatus, errorThrown) {
        },
        complete: function(e) {
        }
    });
}

$(document).on('click','#list-categories li a',function(e){
    e.preventDefault();
    $('#list-categories').find('.active').removeClass('active');
    $(this).parent().addClass('active');
    global_keyword = "";
    loadTemplate($(this).attr('idcategory'));
    window.location = "/pro/template/"+$(this).attr('idcategory');
    
    if($('#pagination-template').data("twbs-pagination")){
        $('#pagination-template').twbsPagination('destroy');
    }
});

$(document).on('click','.item-category .wrap-img-item',function(e){
    e.preventDefault();
    var imgload = $(this).find('img').attr('src');
    $('.wrap-popup-template-detail .title-popup').html($(this).data("category_name"));
    $('.wrap-popup-template-detail .description').html($(this).data("description"));
    $('.wrap-popup-template-detail .btn-choose-target').attr("href", editorURL+$(this).data("asset_key"));

    $('.wrap-popup-template-detail #file-dimension').html($(this).data("dimension_text"));
    $('.wrap-popup-template-detail #file-total_filesize').html(($(this).data("total_filesize") / 1048576).toFixed(2) + " MB");

    var images = $(this).data("images"),
        active = " active",
        count = 0;
    images = images.split(",");
    $('.wrap-popup-template-detail .carousel-inner').html("");
    $('.wrap-popup-template-detail .carousel-indicators').html("");

    var id_image = $(this).attr('id');
    window.location.hash = ''+id_image;

    images.forEach(function(image){
        if (count == 0) {
            $('.wrap-popup-template-detail .carousel-inner').append('<div class="item'+active+'"><img class="lazy-popup" src="'+imgload+'" data-original="'+image+'"></div>');
        }else{
            $('.wrap-popup-template-detail .carousel-inner').append('<div class="item'+active+'"><img class="lazy-popup" src="'+image+'" data-original="'+image+'"></div>');
        }
        $('.wrap-popup-template-detail .carousel-indicators').append('<li data-target="#carousel-template" data-slide-to="'+count+'" class="'+active+'"></li>');
        count++;
        active = "";
    });

    $("img.lazy-popup").lazyload({
        threshold : 200
    });

    $('.popup-template-detail').show();
    $("#carousel-template").carousel("pause").removeData();
    $('body.categories').addClass('showpopup');
    
});

$( ".wrap-popup-template-detail" )
  .on( "mouseenter", function() {
    $(this).addClass('active');
  })
  .on( "mouseleave", function() {
    $(this).removeClass('active');
  });

$(document).on('click','.popup-template-detail', function(e){
    if(!$('.wrap-popup-template-detail').hasClass('active')){
        $('.popup-template-detail').hide();
        $('body.categories').removeClass('showpopup');
    }
});

$(".btn-search").on('click',function(e){
    var keyword = $('#input-search').val().trim();
    loadTemplate(null,keyword);    
    if($('#pagination-template').data("twbs-pagination")){
        $('#pagination-template').twbsPagination('destroy');
    }
});

$("#input-search").keypress(function(e) {
    if(e.which == 13) {
        var keyword = $('#input-search').val().trim();
        loadTemplate(null,keyword);    
        if($('#pagination-template').data("twbs-pagination")){
            $('#pagination-template').twbsPagination('destroy');
        }
    }
});

$(".mainnav-mobile").on('click',function(e){
    if($(this).hasClass('active')){
        $(this).removeClass('active');
        $('body').removeClass('overflow-hiden');
    } else{
        $(this).addClass('active');
        $('body').addClass('overflow-hiden');
    }
});


$(".btn-click-down").on('click',function(e){
    $('html,body').animate({
        scrollTop: $(".section-web-app").offset().top},
        'slow');
});


var logged_in_menu = 0;
$(".logged-in").on('click', function(e) {
    e.stopPropagation();
    if(logged_in_menu){
        $(".logged-in-menu").hide();
        $(".wrap-user-name .user-name").removeClass('for-logged-in-menu-open');
        logged_in_menu = 0;
    }else{
        $(".logged-in-menu").show();
        $(".wrap-user-name .user-name").addClass('for-logged-in-menu-open');
        logged_in_menu = 1;
    }
});
$(window).on('click', function(e) {
    if(logged_in_menu){
        $(".logged-in-menu").hide();
        $(".wrap-user-name .user-name").removeClass('for-logged-in-menu-open');
        logged_in_menu = 0;
    }
});

$(".verify-resend").on('click', function(e) {
    e.preventDefault();

    $.ajax({
        url: "https://api.pixlr.com/resend",
        method: 'POST',
        data: {
            "email": $(this).data('user_email')
        },
        // headers: {},
        success: function(response){
            $(".verify-action-msg").html("A verification link has been sent to your inbox.");
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert("Verification link request failed, please try again or contact info@pixlr.com for support.");
        },
        complete: function() {
        }
    });
});


var rollSlider = function() {
    if ( $().flexslider ) {
        $('.slider-infor-user').each(function() {
            var $this = $(this);
            $this.find('.flexslider').flexslider({
               animation      :  $this.data('effect'),
               direction      :  $this.data('direction'), // vertical
               pauseOnHover   :  true,
               useCSS         :  false,
               animationSpeed :  500,
               slideshowSpeed :  5000,
               controlNav     :  true,
               directionNav   :  false
            });
        });
    }
};

$(document).ready(function(){
    rollSlider();
});