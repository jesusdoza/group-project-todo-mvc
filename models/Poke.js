const mongoose = require('mongoose')
// name, height, weight, types, image, ability, attacks

const PokeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  height: {
    type: Number,
    required: true,
  },
  weight: {
    type: Number,
    required: true,
  },
  Image: {
    type: String,
    required: true,
  },
  ability: {
    type: [String],
    required: true,
  },
  attacks: {
    type: [String],
    required: true,
  },
  userId: {
    type: String,
    required: true,
    
  },
  description:{
    type:String,
    default:"pokemon description"
  }
  
})

module.exports = mongoose.model('Poke', PokeSchema)