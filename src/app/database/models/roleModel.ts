import mongoose from '../mongodb';
import roleSchema from '../schema/roleSchema';

const roleModel = mongoose.model('role', roleSchema);

export default roleModel;
