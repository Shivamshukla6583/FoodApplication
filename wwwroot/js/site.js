// Please see documentation at https://learn.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.
let apiURL = "https://forkify-api.herokuapp.com/api/v2/recipes";
let apiKey = "c005c898-d7d6-4080-b7cd-613ef125695f";
async function GetRecipes(recipeName,id,isAllShow) {
    let resp = await fetch(`${apiURL}?search=${recipeName}&key=${apiKey}`);
    let result = await resp.json();
    //console.log(result);
    let Recipes = isAllShow ? result.data.recipes : result.data.recipes.slice(5, 11);
    showRecipes(Recipes, id);
}
function showRecipes(recipes, id) {
    $.ajax({
        contentType: "application/json;charset=utf-8",
        dataType: 'html',
        type: 'POST',
        url: '/Recipe/GetRecipeCard',
        data: JSON.stringify(recipes),
        success: function (htmlResult) {
            $('#' + id).html(htmlResult);
            getAddedCarts();
        },

    })
}
async function getOrderRecipe(id,showId) {
    let resp = await fetch(`${apiURL}/${id}?key=${apiKey}`);
    let result = await resp.json();
    console.log(result);
    let recipe = result.data.recipe;
    showOrderRecipeDetails(recipe, showId);
}
function showOrderRecipeDetails(orderRecipeDetails, showId) {
    $.ajax({
        url: '/Recipe/ShowOrder',
        //: "application/json;charset=utf-8",
        data: orderRecipeDetails,
        dataType:'html',
        type: 'POST',
       
       // data: JSON.stringify(details),
        success: function (htmlResult) {
            $('#' + showId).html(htmlResult);
        },

    })

}
// order page
function quantity(option) {
    let qty = $('#qty').val();
    let price = $('#price').val();
    let totalAmount = 0;
    if (option === 'inc') {
        qty++;
        price = price * qty;
    } else {
        qty = qty == 1 ? qty : qty - 1;
    }
    totalAmount=price*qty
    $('#qty').val(qty);
    $('#totalAmount').val(totalAmount);
}
// Add Cart
async function cart() {
    let iTag = $(this).children('i')[0];
    let recipeId = $(this).attr('data-RecipeId');
    //console.log(recipeId);
    //console.log($(this));
    if ($(iTag).hasClass('fa-regular')) {
        let resp = await fetch(`${apiURL}/${recipeId}?key=${apiKey}`);
        let result = await resp.json();
        //console.log(result);
        let carts = result.data.recipe;
        carts.RecipeId = recipeId;
        delete carts.id;
        //console.log(carts);
        cartRequest(carts, 'SaveCart', 'fa-solid', 'fa-regular', iTag,false);
    } else {
        let data = { Id: recipeId };
        cartRequest(data, 'RemoveCartFromList', 'fa-regular', 'fa-solid', iTag,false)
    }
}

function cartRequest(mdata, action,addcls,removecls,iTag,isReload) {
    //console.log(data);
    $.ajax({
        url: '/Cart/' + action,
        type: 'POST',
        data: mdata,
        success: function (resp) {
            // console.log(resp);
            if (isReload) {
                location.reload();
            } else {
                $(iTag).addClass(addcls);
                $(iTag).removeClass(removecls);
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
}


function getAddedCarts() {
    $.ajax({
        url: '/Cart/GetAddedCarts',
        type: 'Get',
        dataType: 'json',
        success: function (result) {
            //console.log(result);
            $('.addToCartIcon').each(function (index, spanTag) {
                let recipeId = $(spanTag).attr("data-RecipeId");
                for (var i = 0; i < result.length; i++) {
                    if (recipeId == result[i]) {
                        let itag = $(spanTag).children('i')[0];
                        $(itag).addClass('fa-solid');
                        $(itag).removeClass('fa-regular');
                        break;
                    }
                }
            });
        },
        error: function (err) {
            console.log(err);
        }
    });
};


function getCartList() {
    $.ajax({
        url: '/Cart/GetCartList',
        type: 'GET',
        dataType: 'html',
        success: function (result) {
            $('#showCartList').html(result);
        },
        error: function (err) {
            console.log(err);
        }
    })
}

function removeCartFromlist(id) {
    let data = { Id: id };
    cartRequest(data,'RemoveCartFromList',null,null,null,true)
}