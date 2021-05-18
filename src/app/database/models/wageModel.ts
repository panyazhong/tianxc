import mongoose from 'mongoose';
import { controller } from '../../../decorator';
import wageSchema from '../schema/wageSchema';

const wageModel = mongoose.model('wage', wageSchema);

export default wageModel;
