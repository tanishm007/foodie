
import 'regenerator-runtime/runtime'
export const state = {
    recipe : {},
    
    search : {
        query : '',
        results: [],
        resultPerPage : 10,
        page : 1
    },
    bookmarks : [],
};

const persistBookmarks = () => {
    localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
}

export const loadRecipe = async function(id){
    try{ 

        const res = await fetch(`https://forkify-api.herokuapp.com/api/v2/recipes/${id}`);
        const data = await res.json();
       // console.log(res,data);
        if(!res.ok)
        {
            throw new Error(`${data.message} (${res.status})` );
        }
        const {recipe} = data.data;
        state.recipe = {
            id : recipe.id,
            title : recipe.title,
       publisher : recipe.publisher,
       source : recipe.source_url,
       servings : recipe.servings,
       image : recipe.image_url,
       cookingTime : recipe.cooking_time,
       ingredients : recipe.ingredients
       
 
    };

    if(state.bookmarks.some(bookmark => bookmark.id === id))
    state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;

 console.log(state.recipe);
}catch(err){alert(err);   
   
}
};

export const loadSearchResults = async function(query){

    try{
        state.search.query = query;
        const res = await fetch(`https://forkify-api.herokuapp.com/api/v2/recipes?search=${query}`);
        const data = await res.json();
       // console.log(data);
       state.search.results =  data.data.recipes.map(rec => {
            return {
                id : rec.id,
                title : rec.title,
           publisher : rec.publisher,
           image : rec.image_url,
           
         };
        });

        state.search.page =1;
       // console.log(state.search.results);
    }catch{
        alert(err);   
    
    }
}

export const getSearchResultsPage = function(page = recipe.search.page){
    state.search.page = page;
    const start = (page-1)*10;
    const end = page*10;
    return state.search.results.slice(start,end);

}



export const addBookmark = function(recipe){
    // add to bookmark
    state.bookmarks.push(recipe);

    // marking current recipe as bookmark
    if(recipe.id === state.recipe.id) state.recipe.bookmarked = true;

    persistBookmarks();

};

export const deleteBookmark = function(id){

    //delete bookmark
    const index = state.bookmarks.findIndex(el => el.id === id);
    state.bookmarks.splice(index,1);

    //marking current recipe not bookmarked
    if(id === state.recipe.id) state.recipe.bookmarked = false;
persistBookmarks();
    
}

const init = () =>
{
    const storage = localStorage.getItem('bookmarks');
    if(storage)
    state.bookmarks = JSON.parse(storage);
}

init();
console.log(state.bookmarks);