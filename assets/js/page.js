//分页部分的js
// $(".tcdPageCode").createPage({
//     pageCount:20,
//     current:1,
//     backFn:function(p){
//         //console.log(p);
//     }
// });

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

