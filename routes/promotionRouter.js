const { application } = require('express');
const express = require('express');
const Promotion = require('../models/promotion');
const promotionRouter = express.Router();
const authenticate = require('../authenticate');

promotionRouter.route('/')
    
    .get((req, res, next) => {
        Promotion.find()
        .then(promotions =>{
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(promotions)
        })
        .catch(err => next(err))
    })
    .post(authenticate.verifyUser, authenticate.verifyAdmin,(req, res, next) => {
        Promotion.create(req.body)
        .then(promotion => res.status(200).json(promotion))
        .catch(err => next(err))
    })
    .put(authenticate.verifyUser,(req, res) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /promotions');
    })
    .delete(authenticate.verifyUser, authenticate.verifyAdmin,(req, res) => {
        res.end('Deleting all promotions');
    });

promotionRouter.route('/:promotionId')

    .get((req, res, next) => {
        Promotion.findById(req.params.promotionId)
        .then(promotion => res.status(200).json(promotion))
        .catch(err => next(err))
    })

    .post(authenticate.verifyUser,(req, res) => {
        res.statusCode = 403;
        res.end(`POST operation not supported on /promotions/${req.params.promotionsId}`);
    })

    .put(authenticate.verifyUser, authenticate.verifyAdmin,(req, res) => {
        Promotion.findByIdAndUpdate(req.params.promotionId, {
            $set: req.body
        }, { new: true })
        .then(promotions => res.status(200).json(promotions))
        .catch(err => next(err))
    })
    .delete(authenticate.verifyUser, authenticate.verifyAdmin,(req, res) => {
        Promotion.findByIdAndDelete(req.params.promotionId)
        .then(promotion => res.status(200).json(promotion))
        .catch(err => next(err))
    });

module.exports = promotionRouter;