//js folder, main.js

const deleteBtn = document.querySelectorAll('#delete')
const todoItem = document.querySelectorAll('span.favoriteStar')//creating a variable and assigning it a nodelist of spans with a favoriteStar class
const todoComplete = document.querySelectorAll('span.completed')//creating a variable and assigning it a nodelist of spans with a completed class

// ======= changed del class to delete id in ejs
// const deleteBtn = document.querySelectorAll('.del')
// const todoItem = document.querySelectorAll('span.not')
// const todoComplete = document.querySelectorAll('span.completed')


document.querySelector('#poke-search').addEventListener('click', getPokemon)


  async function getPokemon(){
    const choice = document.querySelector('#poke-name').value.trim().toLowerCase() //cleans up whatever the user input
    console.log(choice)
  
    const url = `https://pokeapi.co/api/v2/pokemon/${choice}`

    const data = await fetch(url).then(res => res.json()).catch(err=>{document.querySelector('.name').innerText = "Pokemon not found. Please try again."})
    
    //poke api fetch

    console.log(`full data from poke api`,data)

    const pokemon = new Poke(data.species.name, //we're making a new pokemon object using the class Poke constructor which is below under the fetch
            data.height,
            data.weight,
            data.types,
            data.sprites.other["official-artwork"].front_default,
            data.abilities[0].ability.name,
            data.moves,
            data.description
    )  

    pokemon.getTypes(data.types)
    pokemon.getAttacks(data.moves)

    document.querySelector('.name').innerText = pokemon.name
    document.querySelector('.height').innerText = `${pokemon.height/10} meters` // divided by 10 due to the weird units pokeapi uses
    document.querySelector('.weight').innerText = `${pokemon.weight/10} kilograms`
    document.querySelector('.type').innerText=pokemon.types.join(', ')
    document.querySelector('img').src = pokemon.image
    document.querySelector('.ability').innerText=pokemon.ability
    document.querySelector('.attacks').innerText=pokemon.attacks.join(', ')
    document.querySelector('.description').innerText=pokemon.description
  
    console.log(`pokemon is to send to server `, pokemon)  
    
    
    const uploadResult = await fetch("/todos/createTodo", {
        method: "post",
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(pokemon)
    })

   location.reload()
    console.log(pokemon)
    console.log(data)
    // fetch(url)
    //     .then(res => res.json()) // parse response as JSON
    //     .then(async data => {
    //       console.log(data)
    //       console.log(data.moves)
  
    //        pokemon= new Poke(data.species.name, //we're making a new pokemon object using the class Poke constructor which is below under the fetch
    //                               data.height,
    //                               data.weight,
    //                               data.types,
    //                               data.sprites.other["official-artwork"].front_default,
    //                               data.abilities[0].ability.name,
    //                               data.moves
    //                            )    //name, height, weight, type, picture (sprite),ability 1, type
  
    //       pokemon.getTypes(data.types)
    //       pokemon.getAttacks(data.moves)
    //       document.querySelector('.name').innerText = pokemon.name
    //       document.querySelector('.height').innerText = `${pokemon.height/10} meters` // divided by 10 due to the weird units pokeapi uses
    //       document.querySelector('.weight').innerText = `${pokemon.weight/10} kilograms`
    //       document.querySelector('.type').innerText=pokemon.types
    //       document.querySelector('img').src = pokemon.image
    //       document.querySelector('.ability').innerText=pokemon.ability
    //       document.querySelector('.attacks').innerText=pokemon.attacks
        
    //       console.log(`pokemon is `, pokemon)               
    //     })
        // .then(()=>{
        //     //post to server the pokemon 
        //     fetch("/todos/createTodo", {
        //         method: "post",
        //         headers: {'Content-Type':'application/json'},
        //         body: JSON.stringify(pokemon)
        //     })
        // })
        //then reload after sending to server
        // .then(()=> location.reload())

       
        
        // .catch(err => {
        //     console.log(`error ${err}`)
        //     document.querySelector('.error').innerText = `Pokemon not found. Please try again.`
        // });


        

  }
  
  class Poke {
    constructor (name, height, weight, types, image, ability, attacks) { //the order that the parameters here must be the same order as the parameters in const pokemon= new Poke (this is located above in the fetch and it calls this class constructor)
  
                                                          //the pokemon name is listed first here in the constructor, and so the "data.species.name" parameter is listed first in the new Poke object above, which calls this class constructor
      this.name = name
      this.height = height
      this.weight = weight
      this.types = []
      this.image = image
      this.ability =ability
      this.attacks = []
    }
      getTypes(arr) {
        if(arr.length == 2) {
          this.types.push(arr[0].type.name)
          this.types.push(arr[1].type.name)
        }else {
          this.types.push(arr[0].type.name)
        }
      }
  
      getAttacks(arr) {
        for(let i = arr.length-1; i >= 0; i--) {
          if(arr[i].version_group_details[0].move_learn_method.name === "level-up" && this.attacks.length < 4) {
            this.attacks.push(arr[i].move.name)
          }
        }
      }

      getDescription(arr) {
        for(let i = arr.length-1; i >= 0; i--) {
          if(arr[i].language.name === "en") this.description = arr[i].flavor_text
        }
      }
  
  
  }

// ========================================
// ORIG BELOW
// ========================================

// >>>>>>> b688fee94f7d1fc83dc8fb149a130516cb1f0501
Array.from(deleteBtn).forEach((el)=>{
    el.addEventListener('click', deleteTodo)
})

Array.from(todoItem).forEach((el)=>{
    el.addEventListener('click', markComplete)  //event listener for markComplete Button
    //since todoItem is a nodeList we need to turn it into an array
})

Array.from(todoComplete).forEach((el)=>{
    el.addEventListener('click', markIncomplete)  //event listener for markIncomplete Button
})

async function deleteTodo(){
    const todoId = this.parentNode.dataset.id
    try{
        const response = await fetch('todos/deleteTodo', {
            method: 'delete',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                'todoIdFromJSFile': todoId
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload()
    }catch(err){
        console.log(err)
    }
}

async function markComplete(){
    const todoId = this.parentNode.dataset.id
    try{
        const response = await fetch('todos/markComplete', {
            method: 'put',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                'todoIdFromJSFile': todoId
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload()
    }catch(err){
        console.log(err)
    }
}

async function markIncomplete(){
    const todoId = this.parentNode.dataset.id
    try{
        const response = await fetch('todos/markIncomplete', {
            method: 'put',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                'todoIdFromJSFile': todoId
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload()
    }catch(err){
        console.log(err)
    }
}

