   function chall(event, data) {
        if ($(this).prop('checked')) {

            $("input[name='id[]']").prop("checked", "true");

        } else {
            $("input[name='id[]']").removeProp('checked');
        }
    }

    function dragtr() {
        var tbody = $('table > tbody');
        var rows = tbody.children();
        var selectedRow;
        var pos;
        //压下鼠标时选取行
        rows.mousedown(function() {
            selectedRow = this;
            tbody.css('cursor', 'move');
            $(this).addClass("selected");
            pos = parseInt($(this).offset().top);
            return false; //防止拖动时选取文本内容，必须和 mousemove 一起使用
        });

        rows.mousemove(function() {
            return false; //防止拖动时选取文本内容，必须和 mousedown 一起使用
        });

        rows.mouseup(function() {

            if (selectedRow && selectedRow != this) {

                if (parseInt($(this).offset().top) - pos < 0) {
                    $(this).before($(selectedRow));
                } else {
                    $(this).after($(selectedRow));
                }
            }
            tbody.find('tr').removeClass('selected');
            tbody.css('cursor', 'default');
            selectedRow = null;
            $(this).removeClass('move');
            pos = 0;
        });

        rows.hover(
            function() {
                if (selectedRow && selectedRow != this) {
                    $(this).addClass('move'); //区分大小写的，写成 'mouseover' 就不行           
                }
            },
            function() {
                if (selectedRow && selectedRow != this) {
                    $(this).removeClass('move');
                }
            }
        );

        /*
              $(":not(tbody)").mouseover(function(event){
                console.log(3)
                //alert(event.target)
                  // selectedRow = null;
                   //tbody.find('tr').removeClass('selected');
                //$(this).removeClass('move');
                //pos = 0;

              });
        */
        // tbody.mouseover(function(event) {
        //event.stopPropagation(); //禁止 tbody 的事件传播到外层的 div 中

        // });

    }

    function deltr(event, data) {

        event.preventDefault();

        // $(this).parent().parent().remove();

        var tr = $(this).closest('tr');
        var currentid = parseInt(tr.find(':checkbox').attr('value'));
        tr.nextAll().find('input:checkbox').attr('value', function(i, val) {
            return currentid + i;
        });

        tr.css("background-color", "#FF3700");
        tr.fadeOut(400, function() {
            tr.remove();
        });
    }

    function addtr(event, data) {
        var parent = $(this).closest('tr');
        parentid = parseInt(parent.find(':checkbox').attr('value'));

        var clone = parent.clone(true);
        var cloneid = parentid + 1;
        clone.find('input:checkbox').attr('value', cloneid);
        //clone.find(':text').val('');

        clone.insertAfter(parent);
        clone.nextAll().find('input:checkbox').attr('value', function(i, val) {
            return cloneid + 1 + i;
        });
    }

    function sorttr(obj) {

        obj.each(function(index, dome) {
            $(dome).find('input:checkbox').attr('value', index + 1);
        });
    };

    $(document).ready(function() {

        $(".up,.down").click(function() {
            event.preventDefault();
            var row = $(this).parents("tr:first");
            if ($(this).is(".up")) {
                // row.prev().get(0).nodeName 
                if ($('tr').index(row.prev().get(0)) != 0)
                    row.insertBefore(row.prev());
            } else {
                row.insertAfter(row.next());
            }
        });

        sorttr($("table tr:gt(0)"));
        $('table').click(dragtr);
        $('#chkall').on('click', '', {}, chall);
        $('.deltr').on('click', '', {}, deltr);
        $('.addtr').on('click', '', {}, addtr);
    });