const factoryfn=require('./../controllers/factoryFnc')
const Review=require('./../models/reviewModel')



exports.getReview=factoryfn.getOne(Review)
exports.deleteReview=factoryfn.deleteOne(Review)
exports.updateReview=factoryfn.updateOne(Review)
exports.getAllReview=factoryfn.getAll(Review)



