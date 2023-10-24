import * as model from './model.js'
import 'core-js/stable'
import 'regenerator-runtime/runtime'
import recipeView from './views/recipeView.js'
import searchView from './views/searchView.js'
import resultsView from './views/resultsView.js'
import { intersection } from 'lodash'
import paginationView from './views/paginationView.js'
import bookmarksView from './views/bookmarksView.js'



const recipeContainer = document.querySelector('.recipe');






const showrecipie = async () =>
{
  try{
    const id = window.location.hash.slice(1);
    if(!id) return;


    
    recipeView.renderSpinning();
  
  

  await model.loadRecipe(id);   // load recipe
  
  const {recipe} = model.state;
 
  recipeView.render(model.state.recipe);



  
   

  
  
 
}catch(err)
  {
    alert(err);
    console.log(err);
  }
};

const controllerSearchResult = async function(){

  try{

    // 1) Get search query
    const query = searchView.getQuery();
    if(!query) return;
    
    // 2) Load search results
      await model.loadSearchResults(query);

      // 3)render results
      console.log(model.state.search.results);

   // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage(1));

    // Page buttons
    paginationView.render(model.state.search);


   
    
  }catch(err){
    console.log(err);
  }

}

const controlPagination = function(goToPage){

  // render new results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // Page new buttons
  paginationView.render(model.state.search);

}



const controlAddBookmark = function(){
 if(!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
 else model.deleteBookmark(model.state.recipe.id);
  console.log(model.state.recipe);
  //recipeView.update(model.state.recipe);
  recipeView.render(model.state.recipe);

  bookmarksView.render(model.state.bookmarks);
}
controllerSearchResult();


const controlBookmarks = () => {
  bookmarksView.render(model.state.bookmarks);
}
const init = function(){
  bookmarksView.addHandlerRender(controlBookmarks);
  searchView.addHandlerSearch(controllerSearchResult);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  paginationView.addHandlerClick(controlPagination);
  
}
window.addEventListener('hashchange',showrecipie);
window.addEventListener('load',showrecipie); 
init();