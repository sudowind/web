//分页部分的js
 $("#tasks-index").createPage({
     pageCount:20,
     current:1,
     backFn:function(p){
         //console.log(p);
     }
 });

$("#comment_pagination").createPage({
    pageCount:20,
    current:1,
    backFn:function(p){
        //console.log(p);
    }
});

$("#note_pagination").createPage({
    pageCount:20,
    current:1,
    backFn:function(p){
        //console.log(p);
    }
});

$('#teacher_task_pagination').createPage({
    pageCount:20,
    current:1,
    backFn:function(p){
        //console.log(p);
    }
});