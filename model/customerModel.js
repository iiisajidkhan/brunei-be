const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose);

const customerSchema = new mongoose.Schema({
  registerNumber:    { type: Number},
  name:              { type: String, required: true },
  phoneNumber:       { type: String, required: true },
  address:           { type: String },
  length:            { type: String },
  arm:               { type: String },
  shoulder:          { type: String },
  neck:              { type: String },
  chest:             { type: String },
  width:             { type: String },
  pant:              { type: String },
  pancha:            { type: String },
  collarType:        { type: String, enum: ['toPices','halfBanGool','halfBanNook','fullBanGool','fullBanNook'], default: 'toPices' },
  patiType:          { type: String, enum: ['upperPati','sadaPati'], default: 'upperPati' },
  patiWidth:         { type: String, enum: ['pati1inch','patiSawa1inch'], default: 'pati1inch' },
  pocket:            { type: Boolean, default: false },
  pocketType:        { type: String, enum: ['sidePocket','doubleSidePocket'], default: 'doubleSidePocket' },
  chotaPlate:        { type: Boolean, default: false },
  GotyKeyBaghair:    { type: Boolean, default: false },
  sehdaGhera:        { type: Boolean, default: false },
  golAsteen:         { type: Boolean, default: false },
  rangeenButton:     { type: Boolean, default: false },
  kafType:           { type: String, enum: ['golKaf','katKaf','chorasKaf'], default: 'golKaf' },
  Kaf:               { type: String },
}, {
  timestamps: true
})

customerSchema.plugin(AutoIncrement, { inc_field: 'registerNumber' });

module.exports = mongoose.model('Customer', customerSchema)

