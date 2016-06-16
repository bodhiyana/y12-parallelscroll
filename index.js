/*
   ScrollSpy for parallel reading
    yapcheahshen@gmail.com
    GPL 3.0
    sample:
    http://tipitaka.ksana.tw/tipitaka/parallel.html
    2013/7/16

    2015/3/9 work with flex , modified for Lama Ginba
*/
;( function(){
           var scrollTimer=null;
         	var fbind=function(L) {
         	  return function(e){
                if (scrollTimer) clearTimeout(scrollTimer);
                scrollTimer=setTimeout(function() {
         	    var top=$(window).scrollTop();        	    
         	    $(L).each(function() {
         	    	var node=$(this);
         	    	if (node.position().top > top) {
         	    		scrollit(L,node);
         	    		return false;
         	    	}
         	    });
               },250);
         	 }
         	};

         var bind=function(lang) {
         	 if (typeof lang=='string') lang=[lang];
         	 for (var i in lang) {
         	  $("#"+lang[i]).bind('scroll', fbind(lang[i]));
         	}
         }
         var unbind=function(lang) {
         	 if (typeof lang=='string') lang=[lang];
         	 for (var i in lang) $("#"+lang[i]).unbind('scroll');
         }         
        var Lang=[];
         var getparallel=function(lang) {
            var out=[];
            for (var i in Lang) if (Lang[i]!=lang) out.push(Lang[i]);
            return out;
         }
         
        var queue=[],todo=0,lastlang="",lastnode=null;

        var rebind=function() {
            setTimeout( function(){bind(lastlang)}, 10);
            setTimeout( function(){bind(getparallel(lastlang))}, 10);              
        }
         var doscroll=function(lang,node) {
         	    	var n=node.attr('n').replace('/','');
         	    	var para=$(lang+"[n="+n+"]");
         	    	if (!para.length) { //cannot find corresponding  mapping.
         	    		todo--;
                                   if (todo<1 )  rebind();
         	    		return;
         	    	}
                       $n=$("#"+lang);
         	    	//save the original scrolltop
         	    	var ori=$n.scrollTop();
		$n.scrollTop(0);
		//now we know the offset of node
     	    	var delta=node.offset().top - $(window).scrollTop();
     	    	var scrollto=para.offset().top - delta;
     	    	$n.scrollTop(ori);
     	    	//scroll to the node slowly
     	    	$n.animate({scrollTop:scrollto},
     	    		600,
     	    		function(){
     	    		//after animate , check if ready to accept scroll event
     	    		todo--;
     	    		if (todo<1 )  rebind();
     	    	});
		//$("#info").html(n+'/'+para.offset().top);//,para.position().top)
         }
         
         processqueue=function() {
         	if (!queue.length)return;
         	var lang=lastlang=queue[ queue.length-1 ][0];
         	var node=lastnode=queue[queue.length-1 ][1];
         	todo+= getparallel(lang).length;
         	unbind( getparallel(lang));
         	unbind(lang);
	var L=getparallel(lang);
            for (var i in L) doscroll(L[i], node); 
        	queue=[];
         }
         setInterval( processqueue , 100);

         var scrollit=function(lang,node) {
         	//only allow same language in queue, drop event sent by other language
         	if (!queue.length || queue[queue.length-1].lang==lang)
         		queue.push([lang,node]);
         }

      var scrollspysetup=function(languages) {
           var screenheight=parseInt($(".container").css('height'));
            for (var i in languages) {
                $("#"+languages[i]).css("height",screenheight+'px');        
                bind(languages[i]);
            }
            Lang=languages;
      }
      $(function() {
        var languages=[];
        $languages=$("div.language").each(function(node) {
            languages.push( $(this).attr('id'));
        })
        scrollspysetup(languages);
    });

})()