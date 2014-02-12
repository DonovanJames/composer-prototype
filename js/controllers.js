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
        $('.desktop .body').append('<figure class="horizontal"><img src="//placehold.it/610x408" alt="Alternative text"><figcaption>Placeholder Caption<cite>Photo: Getty Images</cite></figcaption></figure>')
        $('.pocket *').popover('hide');
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
    var styleFunc = {
        undo : function undo() {document.execCommand( 'undo', false);},
        redo : function redo() {document.execCommand( 'redo', false);},
        bold : function bold() {document.execCommand( 'bold', false );},
        italic : function italics(){document.execCommand('italic', false);},
        underline : function underline(){document.execCommand('underline', false);},
        strike : function strike(){document.execCommand('strikeThrough', false);},
        link : function link() {document.execCommand('createLink', false, '#link')},
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

    //pull related stories info
    (function($) {
        var url = 'http://api.nymag.com/content/latest?callback=?';
        $.ajax({
            type: 'GET',
            url: url,
            async: false,
            jsonpCallback: 'jsonCallback',
            contentType: "application/json",
            dataType: 'jsonp',
            success: function(json) {
                $scope.latest = json;
            },
            error: function(e) {
                console.log('error' + e.message);
            }
        });

    })(jQuery);

    var SidebarMenuEffects = (function() {

        function hasParentClass( e, classname ) {
            if(e === document) return false;
            if( classie.has( e, classname ) ) {
                return true;
            }
            return e.parentNode && hasParentClass( e.parentNode, classname );
        }

        // http://coveroverflow.com/a/11381730/989439
        function mobilecheck() {
            var check = false;
            (function(a){if(/(android|ipad|playbook|silk|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
            return check;
        }

        function init() {

            var container = document.getElementById( 'st-container' ),
                reset = document.getElementById( 'closeMenu' ),
                buttons = Array.prototype.slice.call( document.querySelectorAll( '#st-trigger-effects > button' ) ),
            // event type (if mobile use touch events)
                eventtype = mobilecheck() ? 'touchstart' : 'click',
                resetMenu = function() {
                    classie.remove( container, 'st-menu-open' );
                },
                bodyClickFn = function(evt) {
                    if( !hasParentClass( evt.target, 'st-menu' ) ) {
                        resetMenu();
                        document.removeEventListener( eventtype, bodyClickFn );
                    }
                },
                resetClickFn = function(evt) {
                    if (evt.target == reset) {
                        resetMenu();
                        document.removeEventListener(eventtype, bodyClickFn);
                    }
                };
            console.log(container);
            buttons.forEach( function( el, i ) {
                var effect = el.getAttribute( 'data-effect' );

                el.addEventListener( eventtype, function( ev ) {
                    ev.stopPropagation();
                    ev.preventDefault();
                    container.className = 'st-container'; // clear
                    classie.add( container, effect );
                    setTimeout( function() {
                        classie.add( container, 'st-menu-open' );
                    }, 25 );
                    document.addEventListener( eventtype, bodyClickFn );
                    document.addEventListener( eventtype, resetClickFn );
                });
            } );

        }

        init();

    })();


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
    $http.get('js/latest.json').success(function(data) {
/*        Depreciated! Based on dashboard.js.
        _.each(data, function(value, index){
            value.title = $('<div>'+value.title+'</div>').text();
            value.excerpt = $('<div>'+value.excerpt+'</div>').text();
            data[index] = value;
        })*/
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