const Todo = require('../models/Todo')

module.exports = {

    getTodos: async (req,res)=>{  //like other todos but as part of the request
        console.log(req.user)  //have the ability to see the user who is making the request, so we see the usual request AND the logged in user
                               // we can console log and see everythign about that logged in user
                               //the user has their own unique ids to put in MongoDB collection, putting new user in our usercollection in MongoDB
                               //unique ID is useful since we can use it throughout the application, just get todos with that matching id
                               //if I have users what else must I have to add to the database, a new schema. models only thing that talk to the database. So if you see in the models database we have a todo and users model
        try{
            const todoItems = await Todo.find({userId:req.user.id})  //only get todos of logged in user

            const itemsLeft = await Todo.countDocuments({userId:req.user.id})
            res.render('todos.ejs', {todos: todoItems, left: itemsLeft, user: req.user}) 

        }catch(err){
            console.log(err)
        }
    },
// <<<<<<< HEAD
//     createTodo: async (req, res)=>{
//         try{
//             await Todo.create({todo: req.body.todoItem, completed: false, userId: req.user.id})
//             console.log('Card has been added!')
//             res.redirect('/todos')
//         }catch(err){
//             console.log(err)
// =======
    
    createTodo: async (req, res)=>{
        try{
            var todoName = req.body.name.charAt(0).toUpperCase() + req.body.name.toLowerCase().slice(1) //capitalizes first letter of pokemon name
            console.log(`create todo`,req.body)
            // await Todo.create({todo: req.body.todoItem, completed: false, userId: req.user.id}) //every todo we create will always have the users id
            
            await Todo.create({
                name: todoName, 
                favorite: false, 
                userId: req.user.id,
                height:req.body.height,
                weight:req.body.weight,
                image:req.body.image,
                types:req.body.types,
                ability:req.body.ability,
                attacks:req.body.attacks,
                description:req.body.description
            }) 
            console.log('Todo has been added!', req.body)
            
            res.redirect('/todos')
        }catch(err){

            console.log(`create todo failed`,err)
// >>>>>>> b688fee94f7d1fc83dc8fb149a130516cb1f0501
        }
    },
    markFavorite: async (req, res)=>{
        try{
            await Todo.findOneAndUpdate({_id:req.body.todoIdFromJSFile},{
                favorite: true
            })
            console.log('Marked as a favorite card')
            res.json('Marked as a favorite card')
        }catch(err){
            console.log(err)
        }
    },
    markNotFavorite: async (req, res)=>{
        try{
            await Todo.findOneAndUpdate({_id:req.body.todoIdFromJSFile},{
                favorite: false
            })
            console.log('Marked as not a favorite card/default')
            res.json('Marked as not a favorite card/default')
        }catch(err){
            console.log(err)
        }
    },
    deleteTodo: async (req, res)=>{
        console.log(req.body.todoIdFromJSFile)
        try{
            await Todo.findOneAndDelete({_id:req.body.todoIdFromJSFile})

            console.log('Deleted Card')

            res.json('Deleted It')
        }catch(err){
            console.log(err)
        }
    },

    //todo add card to public pool
    addToPublicCards: async (req, res)=>{
        console.log(`addtopublic`)
        // console.log(`card id`,req.body.todoIdFromJSFile)
        // console.log(`user id: `,req.user.id)
        try{

            /// todo **** verify userId of card matches user from request
            /// do not want users making others cards public****

             const card = await Todo.findOne({_id:req.body.todoIdFromJSFile})

             //card not found error out
            if(!card){ res.status(400).json({message:"card not found"})}

           const results =  await Todo.findOneAndUpdate({
                    _id:req.body.todoIdFromJSFile
                },
                {
                    userId:"public"
                }
            )
            console.log(results)

            res.json({message:"added to public", results:results})
        }catch(err){
            console.log(`error adding card to public`,err.message)
        }
    },

    getPublicCards: async (req, res)=>{
        console.log(` get public user id: `)

        try{
             const cards = await Todo.find({userId:"public"})

             //card not found error out
            if(!cards){ res.status(400).json({message:"no public cards found"})}
            res.json(cards)
        }catch(err){
            console.log(`error adding card to public`,err.message)
        }
    },

}    