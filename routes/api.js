const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false);
const db = "mongodb+srv://sarathkumar:sarath@mongodb@cluster0.8omvh.mongodb.net/interview?retryWrites=true&w=majority";
var http = require("http");
const Consule = require('../models/consulting')
var nodemailer = require('nodemailer');

mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true }, err => {
    if (err) {
        console.log('Error !' + err);
    } else {
        console.log('Successfully connected to mongoDB!!!!!!!!!!!');
    }
});


  router.post('/saveSlot',  async(req, res) => {
    let checkStartDateandTime = await Consule.find({
            '$and':[
                
               {slotDate:{$exists:true, $eq:req.body.slotDate}},
               {endTime:{$exists:true, $eq:req.body.endTime}},
               {startTime:{$exists:true, $eq:req.body.startTime}}
            ]               
            }).exec();

      if(checkStartDateandTime.length>0)
      {
        res.status(200).send({ status: true,statusCode:400, msg: "Slot Already Alloted(Exists)!" })
      }
     else
      {
        let slotData = req.body;
        let slot = new Consule(slotData);
        await slot.save((error, slotData) => {
          if (error) {
          } else {
            res.status(200).send({ status: true,statusCode:200, msg: "Slot added successfully!!!", data: slotData });
          }
        })
      }
  });

  
  router.post('/searchSlot', (req, res) => {
    let searchData = req.body
    //console.log('######', searchData)
    Consule.find({ slotDate: searchData.slotDate }, (error, slots) => {
      if (error) {
        console.log(error)
      } else {
        res.status(200).send({ status: true,statusCode:200, msg: " Data Fetched Successfully!", data: slots })
      }
    });
  });

  router.post('/bookAppointment', function (req, res) {
      //console.log(req.body)
      Consule.findByIdAndUpdate(
        req.body._id,
        {
          $set: {
            pateientNumber: req.body.pateientNumber,
            pateientName: req.body.pateientName,
            appointment:req.body.appointment
          }
        },
        {
          new: true
        },
        function (err, updateSlot) {
          if (err) {
            res.send('Error updating ID status');
          } else {
            res.status(200).send({ status: true,statusCode:200, msg: " Appointment Booked Successfully!", updateSlot });
          }
        }
      );
  });

  router.get('/getAllAppointments', (req, res) => {
    Consule.find((error, slots) => {
      if (error) {
        console.log(error)
      } else {
        res.status(200).send({ status: true,statusCode:200, msg: " Data Fetched Successfully!", data: slots })
      }
    });
  });
  

module.exports = router;
