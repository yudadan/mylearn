(function($) {

  $(document).on('mouseenter mouseleave', 'div.photo', function(event) {
    var $details = $(this).find('.details');
    if (event.type == 'mouseenter') {
      $details.fadeTo('fast', 0.7);
    } else {
      $details.fadeOut('fast');
    }
  });

  $(document).on('nextPage', function(event, scrollToVisible) {
    var url = $('#more-photos').attr('href');
    if (url) {
      console.log(url)
      
      $.get(url, function(data) {
        var $data = $(data).appendTo('#gallery');
        if (scrollToVisible) {
          var newTop = $data.offset().top; //节点的当前坐标
          $(window).scrollTop(newTop); //帮助windows窗口滚动'滚动条'
        }
        checkScrollPosition(); 
        //加载ajax数据后,继续检查gallery容器的高度<window容器高度+滚动条scrollTop.
        //假如小于,则继续触发netxPage事件
      });
    }
  });

  var pageNum = 1;
  $(document).on('nextPage', function() {
    pageNum++;
    console.log(pageNum)
    if (pageNum < 20) {
      $('#more-photos').attr('href', 'pages/' + pageNum + '.html');
    }
    else {
      $('#more-photos').remove();
    }
  });

  function checkScrollPosition() {
    var distance = $(window).scrollTop() + $(window).height();
 
    if ($('#container').height() <= distance) {
      console.log('height') ;
      $(document).trigger('nextPage');
    }
  }

  $(document).ready(function() {
    
    //这个是手动触发,注意[true]参数,让windows窗口来滚动滚动条
    $('#more-photos').click(function(event) {
      event.preventDefault();
      $(this).trigger('nextPage', [true]);
    });


    //定义window的滚动事件
    //触发window的scroll事件
    var timer = 0;
    $(window).scroll(function() {
      if (!timer) {
        timer = setTimeout(function() {
          checkScrollPosition();
          timer = 0;
        }, 250);
      }
    }).trigger('scroll');

  });

  /*
  收获:
  1:节流事件 
  类似于scroll,resize,mousemove事件,会重复触发,从而导致性能下降.
  所以一般需要使用节流方案,比如setTimeout

  2:自定义事件参数
  在触发自定义事件的时候,可以给自定义事件处理程序传递额外参数

  3:无穷滚动
  主要监听scroll事件,在滚动条滚动的时候,测量当前滚动条的位置,从而加载新的内容.

  4:自定义事件
  将事件处理程序和触发他们的代码分离,通过trigger进行触发.

  5:悬停处理
  jQuery提供.hover()方法,也可以原生的mouseenter,mouseleave方法
  $('div.photo').hover(function() {
    $(this).find('.details').fadeTo('fast', 0.7);
  }, function() {
    $(this).find('.details').fadeOut('fast');
  });

  $('div.photo').on('mouseenter mouseleave', function(event) {
    var $details = $(this).find('.details');
    if (event.type == 'mouseenter') {
      $details.fadeTo('fast', 0.7);
    } else {
      $details.fadeOut('fast');
    }
  });

  但是上述代码存在一个问题,ajax调用不会绑定上述定义的事件处理程序,需要使用委托技术.

  6:委托技术
    $('#gallery').on('mouseover mouseout', function(event) {
    var $target = $(event.target).closest('div.photo');
    var $details = $target.find('.details');
    var $related = $(event.relatedTarget)
                   .closest('div.photo');

    if (event.type == 'mouseover' && $target.length) {
      $details.fadeTo('fast', 0.7);
    } else if (event.type == 'mouseout' && !$related.length) {
      $details.fadeOut('fast');
    }
  });
(1)注意是mouseover mouseout 事件而不是 mouseenter mouseleave,因为mouseenter mouseleave
是在刚进入/最后出 gallery div的时候才触发,而我们的需求是进入gallery 这个区域内部都能进行相关操作
relatedTarget:对于 mouseout 事件，它指向被进入的元素；对于 mouseover 事件，它指向被离开的元素。

7:jquery 的委托方法
委托的作用域/早委托
  */
})(jQuery);
