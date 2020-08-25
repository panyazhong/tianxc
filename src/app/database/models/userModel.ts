import mongoose from '../mongodb';
import userSchema from '../schema/userSchema';

const userModel = mongoose.model('user', userSchema);

export default userModel;
