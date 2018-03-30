var checkPerInput = function(elm, options) {
    var $th = $(elm).parents('form');
    if (!$(elm).attr('exp')) {
        return true;
    }
    var vals = $(elm).attr('exp').split('|');
    var tips = $(elm).attr('tip').split('|');
    for (var j = 0; vals[j]; j++) {
        switch (vals[j]) {
            case 'empty':
                var val = $.trim($(elm).val());
                if (!val || val == "请输入标题") {
                    if (options.handleCheckError) {
                        //console.log($(elm)[0].id + "_" + options.handleCheckError + val + "_" +tips[j]);
                        options.handleCheckError.call($(elm), tips[j]);
                    }
                    return false;
                }
                break;
        }
    }
    if (options.handleCheckSuccess) {
        options.handleCheckSuccess.call($(elm));
    }
    return true;
};

var submitChecking = function(options) {
    var $th = this.tagName.toUpperCase() == 'FORM' ? $(this) : $(this).parents('form');
    if ($th.attr('submiting')) {
        return false;
    }
    var valInputs = $th.find('[exp]'); //不是很明白.
    //console.log(valInputs);
    for (var i = 0; valInputs[i]; i++) {
        //console.log(valInputs[i]) ;
        //暂时不理解,以后研究
        //if (!checkPerInput(valInputs[i], options)) {
        //  return false;
        //}
    }
    $th.attr('submiting', '1');
    console.log('submiting');
    var submitBtn = $th.find('input[type=submit]');
    if (submitBtn.attr('loading')) {
        submitBtn.attr('tmp', submitBtn.val());
        submitBtn.val(submitBtn.attr('loading'));
    }
    $.ajax($th.attr('action'), {
        data: $th.serialize(),
        method: "POST",
        success: function(data) {
            if (submitBtn.attr('loading')) {
                submitBtn.val(submitBtn.attr('tmp'));
            }
            $th.removeAttr('submiting');
            if (options.success) {
                options.success.call($th, data);
            }
        },
        error: function() {
            if (submitBtn.attr('loading')) {
                submitBtn.val(submitBtn.attr('tmp'));
            }
            $th.removeAttr('submiting');
            if (options.failed) {
                options.failed.call($th);
            }
        }
    });
};
$.entPlugin = {
    checkPerInput: checkPerInput,
    formSubmitChecking: function(formElm, options) {
        return submitChecking.call(formElm, options);
    },
};
//-------------------------------------------------------------
function jsonpCallback(data) {
    $('#yzm').html(data.join('')) ;
    //
};

$(document).ready(function() {
    var successPanel = $('#successPanel');
    var mask = $('<div class="master" style="display:none;"></div>').appendTo(document.body);
    $('.J_successClose').on('click', function() {
        console.log('close')
        successPanel.hide();
        $('html').css('overflow', '');
        mask.hide();
        $('form').each(function() {
            this.reset();
        });
        window.location.reload();
    });
    var form_province = $('#form_province')
    var form_city = $('#form_city');
    var procity = [];
    $.getJSON('procity.json', function(data) {
        var items = [];
        $.each(data, function(entryIndex, entry) {
            procity[entryIndex] = entry;
            //alert(entryIndex + entry);
            items.push('<option value="' + entryIndex + '">' + entryIndex + '</option>');
        });
        $(items.join('')).appendTo(form_province);
        form_province.trigger('change');
    });
    var response = function(json, textStatus, jqXHR) {
        $('#yzm').html(json.join(''))
    };
    $('#form_yzm').on('focusin', function() {
        $.ajax({
            url: 'http://www.ajax.com/ajax.php?ty=jsonp',
            dataType: 'jsonp',
            jsonp: 'callb',
            timeout: 15000,
            error: function(xhr, status, error) {
                console.log(status)
            },
            success: response
        });
    }).on('focusout', function() {
        $('#yzm').html('');
    });
    /*
    $('#form_yzm').on('focusin', function() {
    $.ajax({
    url: 'http://www.ajax.com/ajax.php?ty=jsonpself',
    dataType: 'jsonp',
    jsonp: false,
    jsonpCallback: 'jsonpCallback',
    timeout: 15000,
    data: {
    callback: 'jsonpCallback'
    },
    error: function(xhr, status, error) {
    },
    });
    });
    */
    form_province.on('change', function(event) {
        var items = [];
        //v = this.value == "" ? "请选择" : this.value;
        var arr = procity[this.value];
        if (!arr) {
            console.log(arr)
            arr = procity['请选择'];
        }
        for (var i = 0; arr[i]; i++) {
            items.push('<option value="' + arr[i] + '">' + arr[i] + '</option>');
        }
        form_city.html(items.join(''));
    });
    //光标进入事件
    $('#form_title').on('focusin', function() {
        //console.log($(this).val());
        if ($(this).val() == '请输入标题') {
            $(this).attr('value', '');
        }
    }).on('focusout', function() {
        if (!$(this).is(':focus') && $(this).val() == '') {
            $(this).attr('value', '请输入标题');
        }
    });
    $(document).on('click', function(event) {
        //console.log(event.currentTarget);
        $('#xxdiv').hide();
    });
    $('#form_xx').on('keyup', function(event) {
        //console.log(event.type) ;
        var requestData = {
            'val': $(this).val(),
            'ty': 'search'
        };
        $.get('ajax.php', requestData, function(data) {
            console.log(data)
            data = eval('(' + data + ')'); //将字符串转换为JSON对象
            //console.log(data)
            var li = [];
            $.each(data, function(k, v) {
                li.push('<li value="' + v + '" >' + v + '</li>');
            });
            $('#xxdiv').html('<ul>' + li.join('') + "</ul>");
            $('#xxdiv').show();
        }).fail(function(jqXHR, textStatus, errorThrown) {
            alert(textStatus + jqXHR.status);
        });
    });
    $('#xxdiv').on('mousemove', 'li', function() {
        $(this).css('background', 'red').siblings('li').css('background', 'white');
    });
    $('#xxdiv').on('click', 'li', function() {
        $('#form_xx').prop('value', $(this).attr('value'));
        $('#xxdiv').hide();
    });
    var showError = function(content) {
        var $li = this.parents('li');
        $li.addClass('error');
        $li.find('.J_ok').hide();
        $li.find('.J_error').show();
        $li.find('.J_error').html(content);
    };
    $('form input').focus(function(e) {
        var $li = $(this).parents('li');
        $li.removeClass('error');
        $li.addClass('current');
        $li.find('.J_ok').hide();
        $li.find('.J_error').hide();
    });
    $('form input').blur(function(e) {
        var $li = $(this).parents('li');
        var $this = $(this);
        //定义域
        $li.removeClass('current');
        $.entPlugin.checkPerInput(this, {
            handleCheckError: function(errTip) {
                showError.call($this, errTip);
            },
            handleCheckSuccess: function() {
                //console.log($li)
                $li.find('.J_ok').show();
                $li.find('.J_error').hide();
            }
        });
    });
    $('form input').keydown(function(e) {
        if (e.keyCode == 13) {
            var $th = $(this);
            var toIndex = $th.attr('toIndex');
            if (toIndex) {
                $th.parents('form').find('input[index=' + toIndex + ']')[0].focus();
            } else {
                /*
                var me = this;
                setTimeout(function(){
                $.entPlugin.formSubmitChecking(me,useOption);
                },0);
                */
            }
            return false;
        }
    });
    $('form').on('submit', function() {
        return false;
    });
    var useOption = {
        handleCheckError: function(element, errTip) {
            showError.call(element, errTip);
        },
        success: function(data) {
            try {
                data = eval('(' + data + ')');
                if (data.result) {
                    var topValue = $(window).scrollTop() + ($(window).height() - successPanel.height()) / 2;
                    successPanel.css('top', topValue < 0 ? 0 : topValue + 'px');
                    successPanel.show();
                    mask.show();
                } else {}
            } catch (e) {}
        },
        failed: function() {
            console.log('error');
        }
    };
    $('form input[type=submit]').click(function() {
        $.entPlugin.formSubmitChecking(this, useOption);
    });

});