var authorToolControllers = angular.module('authorToolControllers', ['ngRoute', 'ngSanitize'])
    .directive('contenteditable', function(){
        return{
            restrict: 'A', //element attribute
            require: '?ngModel',
            link: function(scope, element, attrs, ngModel){
                if(!ngModel) return;
                ngModel.$render = function(){
                    element.html(ngModel.$viewValue || '');
                };

                // Bind to change events
                element.on('blur keyup change click', function(){
                    scope.$apply(read);
                });
                read(); //init

                function isEmpty(el){
                    var emptyParent = !$.trim(el.html()),
                    emptyChild = el.children(':first').html() == '<br>',
                    oneOrLess = el.children().length <= 1,
                    test = emptyParent || emptyChild && oneOrLess;
                    return test
                }

                function read(){
                    var html = element.html();
                    var childhtml = element.children(":first").html();
                    var value = element.attr('data-default-value');
//                    console.log(element.children().length <= 1);
//                    console.log(element.children().html());
                    if (value && isEmpty(element)){
                        ngModel.$setPristine();
                        html = "<p><em>"+value+"</em></p>";
                    }
                    else if (attrs.stripBr && html == '<br>'){
                        html = ""
                    }
                    ngModel.$setViewValue(html);
                }
            }
        }
    })
    .directive('evalRepeat', function(){
        return
    });

authorToolControllers.controller();

authorToolControllers.controller('navCtrl', ['$scope', '$route', '$routeParams', function ($scope, $route, $routeParams){
    $scope.template = [{name: 'PrimaryNav', url: 'includes/primaryNav.html'},
        {name: 'editNav', url: 'includes/nav.html'}];
    if ($route.current.$$route.originalPath == "/article"){
        $scope.template = $scope.template[1];
    }
    else{
        $scope.template = $scope.template[0];
    }
}]);

authorToolControllers.controller('articleCtrl', function($scope){
    $scope.article = [];
    $scope.article.headline = [
        { id:'short', content:'Article Title', label:'Short Headline', placeholder:'Short Headline', required: true },
        { id:'long', content:'', label:'Long Headline', placeholder: 'Long Headline', required: false },
        { id:'social', content:'', label: 'Social Headline', placeholder:'Headline displayed when shared on social networks', required: false},
        { id:'seo', content:'', label:'SEO Headline', placeholder:'Headline displayed on search results',required: false}
    ];
    $scope.article.description = [
        {id:"excerpt", label:"Excerpt", placeholder: "20 words or less"},
        {id:"dek", label:"Subtitle", placeholder:"Dek"},
        {id:"seoSummary", label:"Seo Summary", placeholder:"Shown in Google search results."}
    ];
    $scope.article.url = [{id:"url", label:"Article Slug", slug:"", placeholder: "Required for publish"}];
    $scope.article.authors = [{author: 'Kevin Roose'}, {author: 'Kelly Rolland'}];
    $scope.article.rubric = 'Add a feature rubric'
    $scope.article.body = 'Enter Article Here';
    $scope.article.date = 'January 22, 2014';
    $scope.article.time = '3:45 pm';
    $scope.article.sources = [{source:"NYT"}];
    $scope.article.related = [{story: "WikiLeaks Returns on Someone Else's Leaks"}];
    $scope.article.tags = [{tag: 'add your <em>tags</em>'}];
    $scope.article.config = [];
    $scope.article.config.blogs = ['Intel', 'Science'];
    $scope.article.config.post = ['Intel', 'The Cut', 'Vulture', 'Science'];
    $scope.article.config.categories = [ "Politics", "News", "Finance", "Media", "Tech", "Sports", "Real Estate", "Crime", "Weird", "Other"];
    $scope.article.config.features = ['Interview', 'Feature', 'News', 'List', 'Sponsored', 'Magazine'];

    //General Methods

    // Near Plugin
    //near functionality
    function isNear(element, distance, event){
        var left = element.offset().left - distance,
            top = element.offset().top - distance,
            right = left + element.width() + 2*distance,
            bottom = top + element.height() + 2*distance,
            x = event.pageX,
            y = event.pageY;
        return (x > left && x < right && y > top && y < bottom);
    }
    //hoverNear function
    $.hoverNear=[];
    $(window).mousemove(function(e){
        $.each($.hoverNear, function(i,v){
            var el=$(v[0]),
                distance=v[1],
                on=v[2],
                off=v[3],
                near=isNear(el,distance,e)
            if(near && !el.data('near'))
                el.data('near', 1).each(on)
            else if(el.data('near') && !near)
                el.data('near', 0).each(off)
        })
    })
    // extend jQuery functionality
    $.fn.hoverNear = function(distance, on, off){
        return this.each(function(){
            $.hoverNear.push([this,distance,on,off])
        })
    }

//    console.log(localStorage);
//  Add local storage functionality.

    //Add Media Functionality
    $('.desktop .body')
        .hoverNear(25,
        function(){$('.pocket').fadeIn(50);},
        function(){$('.pocket').fadeOut(200);}
    );
    //Generate Popover
    $('#addMedia').popover({
        html:true,
        title: function(){return $("#pocketHeader").html();},
        content: function(){return $("#pocketBody").html();}
    })
        .on('click', (function(){
            return
        }));
    //Add image to article
    $('.pocket').on('click', '#addImage', function(){
        $('.desktop .body').prepend('<figure class="horizontal" contenteditable="false" draggable="true"><img src="//placehold.it/610x408" alt="Alternative text"><figcaption>Placeholder Caption<cite>Photo: Getty Images</cite></figcaption></figure>')
        $('.pocket *').popover('destroy');
    })

    // Hide and display Style Toolbar
    var subject = $(".desktop .body, #styleBar *");
    $(subject).on('click focus',function(){
        $('#styleBar').fadeIn(90);
    });
    $('html').on('click', 'body', function(e)
    {

        if(e.target.id != subject.attr('id') && !subject.has(e.target).length && document.activeElement != subject)
        {
            $('#styleBar').fadeOut(200);
        }
    });

    //Stylebar Functionality

    $('#link').popover({
        html:true,
        title:false,
        content: function(){return $("#linkPopover").html();}
    });

    var styleFunc = {
        undo : function undo() {document.execCommand( 'undo', false);},
        redo : function redo() {document.execCommand( 'redo', false);},
        bold : function bold() {document.execCommand( 'bold', false );},
        italic : function italics(){document.execCommand('italic', false);},
        underline : function underline(){document.execCommand('underline', false);},
        strike : function strike(){document.execCommand('strikeThrough', false);},
        link : function link() {

//            document.execCommand('createLink', false, '#link')
        },
        anchor : function anchor() {document.execCommand('createLink', false, '#anchor')},
        quote : function quote() {document.execCommand('formatblock', false,'blockquote');},
        orderedList: function orderedList() {document.execCommand('insertOrderedList',false)},
        unorderedList: function unorderedList() {document.execCommand('insertUnorderedList',false)},
        mdash : function mdash() {document.execCommand('insertHorizontalRule', false)},
        omega: function omega(){document.execCommand('removeFormat', false);}
    }

    $('#styleBar button').click(function(){
        var data = $(this).attr('data-tag');
        styleFunc[data]();
    });

    console.log($(".jump").position());
    console.log($(".jump-text"));



//    //Empty text helper
//    function placeholder(element, text){
//        $(element).focus(function() {
//            if (this.hasChildNodes() && document.createRange && window.getSelection) {
//                $(this).empty();
//                var range, sel;
//                range = document.createRange();
//                range.selectNodeContents(this);
//                sel = window.getSelection();
//                sel.removeAllRanges();
//                sel.addRange(range);
//            }
//        });
//
//        $(element).blur(function() {
//            if( $(this).is(':empty') ) {
//                $(this).append('<p><em>'+text+'</em></p>');
//            }
//        });
//    };
//
//    placeholder('.desktop .body', 'Enter Article Here')

//    // Depricated Tag Adding and removal
//    $(function(){
//        $('.tags').on('focusout',function(){
//            var txt= this.value.replace(/[^a-zA-Z0-9\+\-\?\!\ \.\#]/g,''); // allowed characters
//            if(txt) {
//                $('#tags span.tags').append('<a href="">'+ txt +'</a>');
//            }
//            this.value="";
//        }).on('keyup',function( e ){
//                // if: comma,enter (delimit more keyCodes with | pipe)
//                if(/(188|13)/.test(e.which)) $(this).focusout();
//            });
//        $('.tags').on('click','.tags a',function(){
//            $(this).remove();
//        });
//    });

//    //Depricated Author functions
//    $('#addAuthor').popover({
//        html : true,
//        content: function() {return $("#addAuthorContent").html();}
//    })
//        .on('click', (function(){
//            $('.popover #authorName').on('focusout', function(){
//                var auth= this.value;
//                if(auth) {
//                    $('<span class="authorLink"> '+ auth +'</span>').appendTo('.author');
//                }
//                this.value="";
//            }).on('keyup', function( e ){
//                if(/(188|13)/.test(e.which)) $(this).focusout();
//            });
//        })
//    );
//    $('.author').on('click','.authorLink', function(){
//        $(this).remove();
//    });
});

authorToolControllers.controller('dashboardCtrl', ['$scope', '$http', function($scope, $http){
    $scope.config = [];
    $scope.config.blogs = ['Intel', 'NY Mag', 'Cut', 'Vulture', 'Science', 'Grub'];
    $scope.config.ledes = ['Cut Homepage', 'Cut Section', 'Vulture Homepage'];
    $scope.config.ipad = ['None', 'Featured', 'Regular', 'News', 'Other'];
    $scope.orderProp = 'title';

//    $scope.blogs = {};
//    //pull related stories info
//   (function($) {
//        var url = 'http://api.nymag.com/content/latest?callback=?';
//        $.ajax({
//            type: 'GET',
//            url: url,
//            async: false,
//            jsonpCallback: 'jsonCallback',
//            contentType: "application/json",
//            dataType: 'jsonp',
//            success: function(json) {
//                $scope.blogs =  json;
//                console.log($scope.blogs);
//            },
//            error: function(e) {
//                console.log('error' + e.message);
//            }
//        });
//
//    })(jQuery);
//        console.log($scope.blogs);
    $http.get('js/latest.json').success(function(data) {
        $scope.blogs = data;
    });
}])
    .directive('tooltip', function(){
        return function(scope, elem){
            elem.tooltip();
        }
    });;

authorToolControllers.controller('statsCtrl', ['$scope', '$http', function($scope, $http){
    $http.get('http://api.chartbeat.com/live/toppages/v3/' +
            '?apikey=b6bf0068672459c3b4a269ae49b6f3ab&host=nymag.com&limit=10&author=kevin%20roose')
        .success(function(data){
        $scope.authorStats = data;
    });
}]);

authorToolControllers.controller('profileCtrl', function($scope){

});