import mongoose from '../mongodb';
import behaviorSchema from '../schema/behaviorSchema';

const behaviorModel = mongoose.model('behavior', behaviorSchema);

export default behaviorModel;
