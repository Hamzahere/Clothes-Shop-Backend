const express = require("express")
const Flutterwave = require("flutterwave-node-v3")
const Order = require("../models/order")
const Cart = require("../models/cart")
const User = require("../models/user")
const Auth = require("../middleware/auth")


const router = new express.Router()


//const flw = new Flutterwave(process.env.FLUTTERWAVE_V3_PUBLIC_KEY, process.env.FLUTTERWAVE_V3_SECRET_KEY)
/* 
commenting that out till I find a fix for flutterwave public key required error
*/

//get orders

router.post('/orders', async (req, res) => {
    const owner = req.body.owner;
    try {
        const order = await Order.find({ owner: owner }).sort({ date: -1 });
        if(order) {
            return res.status(200).send(order)
        }
        res.status(404).send('No orders found')
    } catch (error) {
        res.status(500).send()
    }
})


//create an item
// router.post('/order', async(req, res) => {
//     try {
//         const newOrder = new Order({
//             ...req.body,
           
//         })
//         await newOrder.save()
//         res.status(201).send(newOrder)
//     } catch (error) {
//         console.log({error})
//         res.status(400).send({message: "error"})
//     }
// })

router.post('/checkout', (req, res, next) => {
    if(req.body.owner != undefined || req.body.owner != null){
        order = new Order({
           owner: req.body.owner,
           items: req.body.items,
           total: req.body.total
         });
   }
   else{

        order = new Order({
         items: req.body.items,
         total: req.body.total
       });
   }
    order.save()
      .then(result => {
        console.log(result);
        res.status(201).json({
          message: 'Order created successfully',
          order: result
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  });

//checkout
router.post('/order/checkout', Auth, async(req, res) => {
    try {
        const owner = req.user._id;
        let payload = req.body
        

        //find cart and user 
        let cart = await Cart.findOne({owner})
        let user = req.user
        if(cart) {
            
        payload = {...payload, amount: cart.bill, email: user.email}
            const response = await flw.Charge.card(payload)
           // console.log(response)
            if(response.meta.authorization.mode === 'pin') {
                let payload2 = payload
                payload2.authorization = {
                    "mode": "pin",
                    "fields": [
                        "pin"
                    ],
                    "pin": 3310
                }
                const reCallCharge = await flw.Charge.card(payload2)

                const callValidate = await flw.Charge.validate({
                    "otp": "12345",
                    "flw_ref": reCallCharge.data.flw_ref
                })
                console.log(callValidate)
                if(callValidate.status === 'success') {
                    const order = await Order.create({
                        owner,
                        items: cart.items,
                        bill: cart.bill
                    })
                    //delete cart
                    const data = await Cart.findByIdAndDelete({_id: cart.id})
                    return res.status(201).send({status: 'Payment successful', order})
                } else {
                    res.status(400).send('payment failed')
                }
            }
            if( response.meta.authorization.mode === 'redirect') {

                let url = response.meta.authorization.redirect
                open(url)
            }

           // console.log(response)

        } else {
            res.status(400).send('No cart found')
        }
    } catch (error) {
        console.log(error)
        res.status(400).send('invalid request')
        
    }
})

module.exports = router
