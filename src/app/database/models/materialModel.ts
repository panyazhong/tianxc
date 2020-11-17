import mongoose from '../mongodb';
import materialSchema from '../schema/materialSchema';

const materialModel = mongoose.model('material', materialSchema);

export default materialModel;
