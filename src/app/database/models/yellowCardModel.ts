import mongoose from '../mongodb'
import yellowCardSchema from '../schema/yellowCardSchema'

const yellowCardModel = mongoose.model('yellowCard', yellowCardSchema)

export default yellowCardModel
