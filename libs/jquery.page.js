/**
 * Created by yilong on 2016/10/10.
 */
(function($){
    var ms = {
        init:function(obj,args){
            return (function(){
                ms.fillHtml(obj,args);
                ms.bindEvent(obj,args);
            })();
        },
        fillHtml:function(obj,args){
            return (function(){
                obj.empty();

                if(args.current > 1){
                    obj.append('<a href="javascript:;" class="prevPage">上一页</a>');
                }else{
                    obj.remove('.prevPage');
                    obj.append('<span class="disabled">上一页</span>');
                }

                var start, end;
                if (args.pageCount < 8) {
                    start = 1;
                    end = args.pageCount;
                    for (;start <= end; start++) {
                        if(start <= args.pageCount && start >= 1){
                            if(start != args.current){
                                obj.append('<a href="javascript:;" class="tcdNumber">'+ start +'</a>');
                            }else{
                                obj.append('<span class="current">'+ start +'</span>');
                            }
                        }
                    }
                }
                else {
                    if (args.current != 1 && args.current >= 3 && args.pageCount != 3) {
                        obj.append('<a href="javascript:;" class="tcdNumber">' + 1 + '</a>');
                    }

                    if (args.current - 2 > 1 && args.current <= args.pageCount && args.pageCount > 5 && args.current != 4) {
                        obj.append('<span class="tcdNumber disabled">...</span>');
                    }
                    else if (args.current == 4) {
                        obj.append('<span class="tcdNumber disabled">' + 2 + '</span>');
                    }

                    start = args.current - 1;
                    end = args.current + 1;

                    // if((start > 1 && args.current < 4)||args.current == 1){
                    //     end++;
                    // }
                    if (args.current < 5) {
                        end = 5;
                    }
                    // if(args.current > args.pageCount-4 && args.current >= args.pageCount){
                    //     start--;
                    // }
                    if (args.current > args.pageCount - 4) {
                        start = args.pageCount - 4;
                    }

                    for (; start <= end; start++) {
                        if (start <= args.pageCount && start >= 1) {
                            if (start != args.current) {
                                obj.append('<a href="javascript:;" class="tcdNumber">' + start + '</a>');
                            } else {
                                obj.append('<span class="current">' + start + '</span>');
                            }
                        }
                    }

                    if (args.current + 1 < args.pageCount - 1 && args.current >= 1 && args.pageCount > 5 && args.current != args.pageCount - 3) {
                        obj.append('<span class="tcdNumber disabled">...</span>');
                    }
                    else if (args.current == args.pageCount - 3) {
                        obj.append('<span class="tcdNumber disabled">' + (args.pageCount - 1) + '</span>');
                    }

                    if (args.current != args.pageCount && args.current < args.pageCount - 1 && args.pageCount != 3) {
                        obj.append('<a href="javascript:;" class="tcdNumber">' + args.pageCount + '</a>');
                    }
                }
                if(args.current < args.pageCount){
                    obj.append('<a href="javascript:;" class="nextPage">下一页</a>');
                }else{
                    obj.remove('.nextPage');
                    obj.append('<span class="disabled">下一页</span>');
                }
            })();
        },

        bindEvent:function(obj,args){
            return (function(){
                obj.on("click","a.tcdNumber",function(){
                    var current = parseInt($(this).text());
                    ms.fillHtml(obj,{"current":current,"pageCount":args.pageCount});
                    if(typeof(args.backFn)=="function"){
                        args.backFn(current);
                    }
                });

                obj.on("click","a.prevPage",function(){
                    var current = parseInt(obj.children("span.current").text());
                    ms.fillHtml(obj,{"current":current-1,"pageCount":args.pageCount});
                    if(typeof(args.backFn)=="function"){
                        args.backFn(current-1);
                    }
                });

                obj.on("click","a.nextPage",function(){
                    var current = parseInt(obj.children("span.current").text());
                    ms.fillHtml(obj,{"current":current+1,"pageCount":args.pageCount});
                    if(typeof(args.backFn)=="function"){
                        args.backFn(current+1);
                    }
                });
            })();
        }
    };
    $.fn.createPage = function(options){
        var args = $.extend({
            pageCount : 10,
            current : 1,
            backFn : function(){}
        },options);
        ms.init(this,args);
    }
})(jQuery);